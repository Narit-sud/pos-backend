import { pool } from "../_utils/pool"
import { Category } from "../_interfaces/Category"
import { CustomError } from "../_class/CustomError"

export const getAllCategoryService = async (): Promise<Category[]> => {
    const client = await pool.connect()
    const sql = `
            SELECT 
                id,
                name,
                detail 
            FROM
                categories 
            WHERE
                status != 'deleted'
            ORDER BY 
                id`
    try {
        const query = await client.query(sql)
        if (!query.rowCount) {
            throw new CustomError("Category not found", 404)
        }

        return query.rows
    } catch (error) {
        throw error
    } finally {
        client.release()
    }
}

export const getCategoryByIdService = async (id: string): Promise<Category> => {
    const client = await pool.connect()
    const sql = `
        SELECT
            id, name, detail
        FROM
            categories
        WHERE
            id = $1
        AND
            status != 'deleted'`
    try {
        const query = await client.query(sql, [id])
        if (!query.rowCount) {
            throw new CustomError(`Category id ${id} not found`, 404)
        }
        return query.rows[0]
    } catch (error) {
        throw error
    }
}
export const createCategoryService = async (category: {
    name: string
    detail: string
}): Promise<void> => {
    const client = await pool.connect()
    try {
        const { name, detail } = category
        const sql = "INSERT INTO categories (name,detail) VALUES ($1, $2)"
        const query = await client.query(sql, [name, detail])
        if (!query.rowCount) {
            throw new Error("Failed to create new category")
        }
    } catch (error) {
        throw error
    } finally {
        client.release()
    }
}

export const updateCategoryService = async (
    category: Category,
): Promise<void> => {
    const client = await pool.connect()
    try {
        const { id, name, detail } = category
        const sql = "update categories set name = $2, detail = $3 where id = $1"
        const query = await client.query(sql, [id, name, detail])
        if (!query.rowCount) {
            throw new Error(`Failed to update category id ${id}`)
        }
        return
    } catch (error) {
        throw error
    } finally {
        client.release()
    }
}

export const deleteCategoryService = async (id: string): Promise<void> => {
    const client = await pool.connect()
    const sql = "update categories set status = 'deleted' where id = $1"
    try {
        const query = await client.query(sql, [id])
        if (!query.rowCount) {
            throw new Error(`category id ${id} doesn't existed`)
        }
        return
    } catch (error) {
        throw error
    } finally {
        client.release()
    }
}
