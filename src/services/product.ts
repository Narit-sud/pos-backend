import { Product } from "../types/Product"
import { TrueResults, FalseResults, QueryResults } from "../class/QueryResult"
import { pool } from "../utils/pool"

export const getAllProducts = async (): Promise<Product[]> => {
    const client = await pool.connect()
    try {
        const sql = `
                SELECT
                    products.id AS id,
                    products.name AS name,
                    products.category_id as category,
                    products.price AS price, 
                    products.cost AS cost,
                    products.stock AS stock,
                    products.detail as detail
                FROM 
                    products 
                WHERE 
                    products.status = 'active' 
                ORDER BY
                    products.id;`
        const query = await client.query(sql)
        if (query.rowCount !== null && query.rowCount > 0) {
            return query.rows
        } else {
            throw new Error("product not found")
        }
    } catch (error) {
        throw error
    } finally {
        client.release()
    }
}

export const getProductById = async (id: string): Promise<Product> => {
    const client = await pool.connect()
    try {
        const sql = `
                SELECT
                    products.id AS id,
                    products.name AS name,
                    products.category_id as category,
                    products.price AS price, 
                    products.cost AS cost,
                    products.stock AS stock,
                    products.detail as detail
                FROM 
                    products 
                WHERE 
                    products.status = 'active' 
                AND
                    products.id = $1
                ORDER BY
                    products.id;`
        const query = await client.query(sql, [id])
        if (query.rowCount) {
            return query.rows[0]
        } else {
            throw new Error("product not found")
        }
    } catch (error) {
        throw error
    } finally {
        client.release()
    }
}

export const createProduct = async (product: Product): Promise<void> => {
    const client = await pool.connect()

    try {
        const { name, category, price, cost, stock, detail } = product
        const sql = `
            INSERT
            INTO
                products
                (name, category_id, price, cost, stock, detail)
            VALUES
                ($1,$2,$3,$4,$5,$6);`

        const query = await client.query(sql, [
            name,
            category,
            price,
            cost,
            stock,
            detail,
        ])

        if (!query.rowCount) {
            throw new Error("create product failed")
        }
    } catch (error) {
        throw error
    } finally {
        client.release()
    }
}

export const updateProduct = async (product: Product): Promise<void> => {
    const client = await pool.connect()
    const { id, name, category, price, cost, stock, detail } = product
    try {
        const sql = `
            UPDATE
                products 
            SET 
                "name" = $1, 
                category_id = $2, 
                price = $3, 
                stock = $4 , 
                "cost" = $5, 
                detail = $6, 
                updated_at = now() 
            WHERE 
                id = $7`
        const query = await client.query(sql, [
            name,
            category,
            price,
            stock,
            cost,
            detail,
            id,
        ])

        if (!query.rowCount) {
            throw new Error("update product data failed")
        }
    } catch (error) {
        throw error
    } finally {
        client.release()
    }
}

export const deleteProduct = async (id: string): Promise<void> => {
    const client = await pool.connect()
    try {
        const sql = `
                UPDATE 
                    products
                SET
                    status = 'deleted'
                WHERE
                    id = $1
                AND
                    status != 'deleted'`
        const query = await client.query(sql, [id])
        if (!query.rowCount) {
            throw new Error(`product id ${id} doesn't existed`)
        }
    } catch (error) {
        throw error
    } finally {
        client.release()
    }
}
