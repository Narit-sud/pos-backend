import { pool } from "../../../utils/pool";
import type {
    FullProductType,
    MainProductType,
    VariantProductType,
} from "../types";
import { QueryResult } from "../../../class/QueryResult";

export async function getFull(): Promise<FullProductType[]> {
    const sql = `SELECT
    pm.index AS "index",
    pm.uuid AS "uuid",
    pm.name AS "name",
    pm.product_category_uuid AS "category",
    pm.detail AS "detail",
    pm.created_at AS "createdAt",
    pm.updated_at AS "updatedAt",
    pm.status AS "status",
    COUNT(pv.uuid) FILTER (WHERE pv.status != 'delete') AS "variantCount",
    COALESCE(json_agg(
        jsonb_build_object(
            'index', pv.index,
            'uuid', pv.uuid,
            'name', pv.name,
            'cost', pv.cost,
            'price', pv.price,
            'detail', pv.detail,
            'createdAt', pv.created_at,
            'updatedAt', pv.updated_at,
            'status', pv.status
        )
    ) FILTER (WHERE pv.uuid IS NOT NULL), '[]') AS "variants"
FROM product_main pm
LEFT JOIN product_variant pv 
    ON pm.uuid = pv.product_main_uuid
WHERE pm.status = 'active'
  AND (pv.status IS NULL OR pv.status != 'delete') 
GROUP BY pm.index, pm.uuid, pm.name, pm.product_category_uuid, pm.detail, pm.created_at, pm.updated_at, pm.status
ORDER BY pm.index;`;

    try {
        const { rows } = await pool.query(sql);
        return rows.map(
            (row) =>
                ({
                    index: row.index,
                    uuid: row.uuid,
                    name: row.name,
                    category: row.category,
                    detail: row.detail,
                    createdAt: row.createdAt,
                    updatedAt: row.updatedAt,
                    status: row.status,
                    variantCount: parseInt(row.variantCount),
                    variants: row.variants
                        .map(
                            (v: any): VariantProductType => ({
                                index: v.index,
                                uuid: v.uuid,
                                name: v.name,
                                cost: v.cost,
                                price: v.price,
                                mainProduct: v.mainProductUUID,
                                detail: v.detail,
                                createdAt: v.createdAt,
                                updatedAt: v.updatedAt,
                                status: v.status,
                            })
                        )
                        .sort(
                            (a: VariantProductType, b: VariantProductType) =>
                                a.index - b.index
                        ), // Sort variants by index
                } as FullProductType)
        );
    } catch (error) {
        throw error;
    }
}

export async function createNew(
    newProduct: FullProductType
): Promise<QueryResult<never>> {
    const createMainSql = `
        INSERT
        INTO
            product_main
            ("uuid", "name", product_category_uuid, detail)
        VALUES
            ($1, $2, $3, $4);`;

    const createVariantSql = `
        INSERT
        INTO
            product_variant
            ("uuid", "name", product_main_uuid, detail, price, "cost")
        VALUES
            ($1, $2, $3, $4, $5, $6);
`;
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        // create main product
        await client.query(createMainSql, [
            newProduct.uuid,
            newProduct.name,
            newProduct.category,
            newProduct.detail,
        ]);
        // create variant products
        await Promise.all(
            newProduct.variants.map((variant) => {
                client.query(createVariantSql, [
                    variant.uuid,
                    variant.name,
                    variant.mainProduct,
                    variant.detail,
                    variant.price,
                    variant.cost,
                ]);
            })
        );
        // commit creation
        await client.query("COMMIT");
        return new QueryResult("Create new product success", 201);
    } catch (error) {
        // if error, roll back creation
        await client.query("ROLLBACK");
        //TODO: handle error for constraint_unique_*something*
        //if (error.something){
        //return Response.json(new ApiResponse(false,"*something* already existed"))
        //}else if (error.something2){
        //return Response.json(new ApiResponse(false,"*something2* already existed"))
        //}else{
        //
        //}
        throw error;
    } finally {
        client.release();
    }
}

export async function deleteFull(
    mainProductUUID: string
): Promise<QueryResult<never>> {
    const client = await pool.connect();
    const delMainSql = `update product_main set status = 'delete' where uuid = $1`;
    const delVariantsSql = `update product_variant set status = 'delete' where product_main_uuid = $1`;
    try {
        await client.query("BEGIN");
        await client.query(delMainSql, [mainProductUUID]);
        await client.query(delVariantsSql, [mainProductUUID]);
        await client.query("COMMIT");
        return new QueryResult(
            `Delete product main and variants binded with uuid: ${mainProductUUID} success`,
            200
        );
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}
