import { pool } from "../_utils/pool";
import { CustomError } from "../_class/CustomError";
import type { FullProduct, ProductMain, ProductVariant } from "./types";
import { QueryResult } from "../_class/QueryResult";

export async function createNewProductService(
    newProduct: FullProduct,
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
            }),
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

export const getMainService = async (): Promise<QueryResult<ProductMain[]>> => {
    const sql = `
        SELECT
            pm.index AS "index",
            pm.uuid AS "uuid",
            pm.name AS "name",
            pm.product_category_uuid AS "category",
            pm.detail AS "detail",
            pm.created_at AS "createdAt",
            pm.updated_at AS "updatedAt",
            count(pv.uuid) AS "variantCount"
        FROM
            product_main pm
        LEFT JOIN product_variant pv ON pm.uuid = pv.product_main_uuid
        WHERE
            pm.status = 'active'
        GROUP BY pm.uuid
        ORDER BY
            pm.index;
`;
    try {
        const query = await pool.query(sql);
        if (!query.rowCount) {
            throw new CustomError("Product main data not found", 404);
        }
        return new QueryResult(
            "Get product main data success",
            200,
            query.rows,
        );
    } catch (error) {
        console.log(error);

        throw error;
    }
};

export const getVariantsService = async () => {
    const client = await pool.connect();
    const sql = `
        SELECT
            pv.index AS "index",
            pv.uuid AS "uuid",
            pv.product_main_uuid AS "mainProduct",
            pv.name AS "name",
            pv.price AS "price",
            pv.cost AS "cost",
            pv.detail AS "detail",
            pv.created_at AS "createdAt",
            pv.updated_at AS "updatedAt"
        FROM
            product_variant pv
        ORDER BY
            pv.index;
`;
    try {
        const query = await client.query(sql);
        if (!query.rowCount) {
            throw new CustomError("Product variant data not found", 404);
        }

        return new QueryResult(
            "Get product variant data success",
            200,
            query.rows,
        );
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
};

export async function createVariantsService(variants: ProductVariant[]) {
    const client = await pool.connect();
    const sql = `
        INSERT
        INTO
            product_variant
        (
            "uuid",
            "name",
            product_main_uuid,
            detail,
            price,
            "cost"
        )
        VALUES(
            $1,
            $2,
            $3,
            $4,
            $5,
            $6
        );
`;
    try {
        await client.query("BEGIN");
        await Promise.all(
            variants.map((variant) =>
                client.query(sql, [
                    variant.uuid,
                    variant.name,
                    variant.mainProduct,
                    variant.detail,
                    variant.price,
                    variant.cost,
                ]),
            ),
        );
        await client.query("COMMIT");
        return new QueryResult(
            `Create ${variants.length} product variants success`,
            201,
        );
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export async function deleteMainService(uuid: string) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        await client.query(
            `UPDATE product_main SET status = 'delete' WHERE uuid = $1`,
            [uuid],
        );
        const variantsTargetQuery = await client.query(
            `select uuid from product_variant where product_main_uuid = $1`,
            [uuid],
        );
        if (variantsTargetQuery.rowCount) {
            await Promise.all(
                variantsTargetQuery.rows.map((item) =>
                    client.query(
                        `update product_variant set status = 'delete' where uuid = $1`,
                        [item.uuid],
                    ),
                ),
            );
        }

        await client.query("COMMIT");
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}
