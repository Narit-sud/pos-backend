import { CustomError } from "../_class/CustomError"
import { QueryResult } from "../_class/QueryResult"
import { pool } from "../_utils/pool"

export async function getAllCategories() {
    const client = await pool.connect()
    const sql = `
        SELECT
            "uuid",
            "index",
            "name",
            detail,
            created_at,
            updated_at
        FROM
            product_category;
`
    try {
        const query = await client.query(sql)
        if (!query.rowCount) {
            throw new CustomError("Category data not found", 404)
        }
        return new QueryResult("Get categories data success", 200, query.rows)
    } catch (error) {
        throw error
    } finally {
        client.release()
    }
}
