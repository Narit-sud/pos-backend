import { pool } from "../utils/pool";

export const categoryService = {
    getAll: async () => {
        const client = await pool.connect();
        try {
            const sql = "select * from product_categories";
            const query = await client.query(sql);
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

    getById: async (id: string) => {
        const client = await pool.connect();
        try {
            const sql = "select * from product_categories where id = $1";
            const query = await client.query(sql, [id]);
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
    update: async (updatedCategory: {
        id: string;
        name: string;
        detail: string;
    }) => {
        const client = await pool.connect();
        try {
            const { id, name, detail } = updatedCategory;
            const sql =
                "update product_categories set name = $2, detail = $3 where id = $1";
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
            const sql =
                "INSERT INTO product_categories (name,detail) VALUES ($1, $2)";
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
