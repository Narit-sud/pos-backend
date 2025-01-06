import { Product } from "../types/Product";
import { pool } from "../utils/pool";

export const productService = {
    getAll: async () => {
        const client = await pool.connect();
        try {
            const sql =
                "SELECT products.id  AS id, products.name AS name, product_categories.name AS category, products.detail AS detail, recommend_price,  current_cost,  current_stock FROM products JOIN product_categories ON products.category = product_categories.id;";
            const query = await client.query(sql);
            if (query.rowCount !== null && query.rowCount > 0) {
                return query.rows;
            } else {
                throw new Error("Error query products data");
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
            const sql =
                "SELECT products.id  AS id, products.name AS name, product_categories.name AS category, products.detail AS detail, recommend_price,  current_cost,  current_stock FROM products JOIN product_categories ON products.category = product_categories.id where products.id = $1;";
            const query = await client.query(sql, [id]);
            if (query.rowCount !== null && query.rowCount > 0) {
                return query.rows;
            } else {
                throw new Error("Error query product data");
            }
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    },
    // update: async (updatedCategory: {
    //     id: string;
    //     name: string;
    //     detail: string;
    // }) => {
    //     const client = await pool.connect();
    //     try {
    //         const { id, name, detail } = updatedCategory;
    //         const sql =
    //             "update product_categories set name = $2, detail = $3 where id = $1";
    //         const query = await client.query(sql, [id, name, detail]);
    //         if (query.rowCount !== null && query.rowCount > 0) {
    //             return query.rows;
    //         } else {
    //             throw new Error("Error query product data");
    //         }
    //     } catch (error) {
    //         throw error;
    //     } finally {
    //         client.release();
    //     }
    // },
    create: async (newProduct: Product) => {
        const client = await pool.connect();
        try {
            const {
                name,
                detail,
                category,
                recommend_price,
                current_cost,
                current_stock,
            } = newProduct;
            const sql =
                "INSERT INTO products (name, detail,category, recommend_price, current_cost, current_stock)  VALUES ($1,$2,$3,$4,$5,$6);";
            const query = await client.query(sql, [
                name,
                detail,
                category,
                recommend_price,
                current_cost,
                current_stock,
            ]);

            if (query.rowCount !== null && query.rowCount > 0) {
                return true;
            } else {
                throw new Error("Error query product data");
            }
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    },
    delete: async (productId: string) => {
        const client = await pool.connect();
        try {
            const sql = "DELETE FROM products WHERE id = $1";
            const query = await client.query(sql, [productId]);
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
