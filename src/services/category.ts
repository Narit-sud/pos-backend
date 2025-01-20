import { pool } from "../utils/pool";
import { QueryResults } from "../class/QueryResult";
import { Category } from "../interfaces/Category";

export const categoryService = {
    getAll: async () => {
        const client = await pool.connect();
        const sql = `
            SELECT 
                id,
                name,
                detail 
            FROM
                categories 
            ORDER BY 
                id`;
        try {
            const query = await client.query(sql);
            if (query.rowCount && query.rowCount > 0) {
                return query.rows;
            } else {
                throw new Error("category not found");
            }
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    },

    getById: async (id: string) => {
        const client = await pool.connect();
        try {
            const sql = "select * from categories where id = $1";
            const query = await client.query(sql, [id]);
            if (query.rowCount && query.rowCount > 0) {
                return new QueryResults(
                    true,
                    `get category id: ${id} success`,
                    query.rows[0],
                );
            } else {
                return new QueryResults(false, `category id: ${id} not found`);
            }
        } catch (error) {
            return new QueryResults(
                false,
                `error getting get category id: ${id}`,
                error,
            );
        } finally {
            client.release();
        }
    },

    update: async (updatedCategory: {
        id: string;
        name: string;
        detail: string;
    }) => {
        const client = await pool.connect();
        try {
            const { id, name, detail } = updatedCategory;
            const sql =
                "update categories set name = $2, detail = $3 where id = $1";
            const query = await client.query(sql, [id, name, detail]);
            if (query.rowCount !== null && query.rowCount > 0) {
                return query.rows;
            } else {
                throw new Error("Error query category data");
            }
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    },

    create: async (newCategory: { name: string; detail: string }) => {
        const client = await pool.connect();
        try {
            const { name, detail } = newCategory;
            const sql = "INSERT INTO categories (name,detail) VALUES ($1, $2)";
            const query = await client.query(sql, [name, detail]);
            if (query.rowCount !== null && query.rowCount > 0) {
                return true;
            } else {
                throw new Error("Error query category data");
            }
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    },
    delete: async (categoryId: string) => {
        const client = await pool.connect();
        try {
            const sql = "DELETE FROM product_categories WHERE id = $1";
            const query = await client.query(sql, [categoryId]);
            if (query.rowCount !== null && query.rowCount > 0) {
                return true;
            }
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    },
};
