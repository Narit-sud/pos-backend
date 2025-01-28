import { CustomError } from "../_class/CustomError"
import { QueryResult } from "../_class/QueryResult"
import { ProductVariant } from "../_interfaces/ProductVariant"
import { pool } from "../_utils/pool"

export const getAllVariants = async () => {
    const client = await pool.connect()
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
`
    try {
        const query = await client.query(sql)
        if (!query.rowCount) {
            throw new CustomError("Product variant data not found", 404)
        }

        return new QueryResult(
            "Get product variant data success",
            200,
            query.rows,
        )
    } catch (error) {
        throw error
    } finally {
        client.release()
    }
}

export const getVariantsByMainUUID = async (
    uuid: string,
): Promise<QueryResult<ProductVariant[]>> => {
    const client = await pool.connect()
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
        WHERE
            pv.product_main_uuid = $1
        ORDER BY
            pv.index
`
    try {
        const query = await client.query(sql, [uuid])
        if (!query.rowCount) {
            throw new CustomError(
                `Product variants under product main UUID: ${uuid} not found`,
                404,
            )
        }
        return new QueryResult<ProductVariant[]>(
            `Get product variants under product main UUID: ${uuid} success`,
            200,
            query.rows,
        )
    } catch (error) {
        console.log(error)

        throw error
    } finally {
        client.release()
    }
}
