import { pool } from "../_utils/pool"
import { CustomError } from "../_class/CustomError"
import { QueryResult } from "../_class/QueryResult"
import { ProductMain, ProductMainCreate } from "../_interfaces/ProductMain"

export const getAllProductMainService = async (): Promise<
    QueryResult<ProductMain[]>
> => {
    const client = await pool.connect()
    const sql = `
        SELECT
            pm.index AS "index",
            pm.uuid AS "uuid",
            pm.name AS "name",
            pm.product_category_uuid AS "category",
            pm.detail AS "detail",
            pm.created_at AS "createdAt",
            pm.updated_at AS "updatedAt",
            count(pv.uuid) AS "variantCount",
            pm.TYPE AS "type"
        FROM
            product_main pm
        LEFT JOIN product_variant pv ON pm.uuid = pv.product_main_uuid
        WHERE
            pm.status = 'active'
            GROUP BY pm.uuid
        ORDER BY
            pm.index;
`
    try {
        const query = await client.query(sql)
        if (!query.rowCount) {
            throw new CustomError("Product main data not found", 404)
        }
        return new QueryResult<any[]>(
            "Get product main data success",
            200,
            query.rows,
        )
    } catch (error) {
        throw error
    } finally {
        client.release()
    }
}

export const getProductMainByUUIDService = async (
    uuid: string,
): Promise<QueryResult<ProductMain>> => {
    const client = await pool.connect()
    const sql = `
        SELECT
            pm.index AS "index",
            pm.uuid AS "uuid",
            pm.name AS "name",
            pc.name AS "category",
            pm.detail AS "detail",
            pm.created_at AS "createdAt",
            pm.updated_at AS "updatedAt"
        FROM
            product_main pm
        JOIN product_category pc ON
            pm.product_category_uuid = pc.uuid
        WHERE
            pm.status = 'active'
        AND
            pm.uuid = $1
        ORDER BY
            pm.index;
`
    try {
        const query = await client.query(sql, [uuid])
        if (!query.rowCount) {
            throw new CustomError(`Product main uuid: ${uuid} not found`, 404)
        }
        return new QueryResult(
            `Get product main uuid: ${uuid} success`,
            200,
            query.rows[0],
        )
    } catch (error) {
        throw error
    } finally {
        client.release()
    }
}

export const createSingleProductMainService = async (
    newProductMain: ProductMainCreate,
): Promise<QueryResult<string>> => {
    const { name, detail, category } = newProductMain
    const client = await pool.connect()
    const sql = `
        INSERT
        INTO
            product_main
            (
                name,
                product_category_uuid,
                detail,
                type,
            )
        VALUES
            (
                $1,
                $2,
                $3,
                'single'
            );
        `
    const sql2 = `
            SELECT
                uuid
            FROM
                product_main pm
            WHERE
                pm.name = $1
            AND
                pm.product_category_uuid = $2
            AND
                pm.detail = $3
`
    try {
        const query1 = await client.query(sql, [name, category, detail])
        if (!query1.rowCount) {
            throw new CustomError("Create new product main failed", 400)
        }
        const query2 = await client.query(sql2, [name, category, detail])
        if (!query2.rowCount) {
            throw new CustomError("Cannot get new product main uuid data", 404)
        }
        return new QueryResult(
            "Create new product main success",
            201,
            query2.rows[0] as string,
        )
    } catch (error) {
        console.log(error)

        throw error
    } finally {
        client.release()
    }
}
