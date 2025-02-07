import { pool } from "../../_utils/pool";
import { CustomError } from "../../_class/CustomError";
import type {
    FullProductType,
    MainProductType,
    VariantProductType,
} from "../types";
import { QueryResult } from "../../_class/QueryResult";

export async function createNew(
    newProduct: FullProductType,
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

export async function deleteFull(
    mainProductUUID: string,
): Promise<QueryResult<never>> {
    const client = await pool.connect();
    const delMainSql = `update product_main set status = 'delete' where uuid = $1`;
    const delVariantsSql = `update product_variant set status = 'delete' wherer mainProduct = $1`;
    try {
        await client.query("BEGIN");
        await client.query(delMainSql, [mainProductUUID]);
        await client.query(delVariantsSql, [mainProductUUID]);
        await client.query("COMMIT");
        return new QueryResult(
            `Delete product main and variants binded with uuid: ${mainProductUUID} success`,
            200,
        );
    } catch (error) {
        await client.query("ROLLBACK");
        return new QueryResult(
            `Delete product main and variants binded with uuid: ${mainProductUUID} failed`,
            400,
        );
    } finally {
        client.release();
    }
}
