import { pool } from "../../../utils/pool";
import { CustomError } from "../../../class/CustomError";
import { QueryResult } from "../../../class/QueryResult";
import { VariantProductType } from "../types";

export async function getVariants(): Promise<
    QueryResult<VariantProductType[]>
> {
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
            pv.updated_at AS "updatedAt",
            pv.status as "status"
        FROM
            product_variant pv
        WHERE
            status != 'delete'
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
            query.rows as VariantProductType[]
        );
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
}

export async function createVariants(
    variants: VariantProductType[]
): Promise<QueryResult<never>> {
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
                ])
            )
        );
        await client.query("COMMIT");
        return new QueryResult(
            `Create ${variants.length} product variants success`,
            201
        );
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export async function updateVariants(
    variants: VariantProductType[]
): Promise<QueryResult<never>> {
    const client = await pool.connect();
    const sql = `update product_variant set name = $1, cost = $2, price = $3, detail = $4 where uuid = $5`;
    try {
        await client.query("BEGIN");
        await Promise.all(
            variants.map((prod) =>
                client.query(sql, [
                    prod.name,
                    prod.cost,
                    prod.price,
                    prod.detail,
                    prod.uuid,
                ])
            )
        );
        await client.query("COMMIT");
        return new QueryResult(`Update ${variants.length} success`, 200);
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export async function deleteVariants(
    variants: VariantProductType[]
): Promise<QueryResult<never>> {
    const client = await pool.connect();
    const sql = `update product_variant set status = 'delete' where uuid = $1`;
    try {
        await client.query("BEGIN");
        await Promise.all(
            variants.map((prod) => client.query(sql, [prod.uuid]))
        );
        await client.query("COMMIT");
        return new QueryResult(
            `Delete ${variants.length} variants success`,
            200
        );
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}
