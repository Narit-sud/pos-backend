import { Product } from "../types/Product";
import { pool } from "../utils/pool";

export const productService = {
    getAll: async () => {
        const client = await pool.connect();
        try {
            const sql =
                "SELECT products.id AS id, products.name AS name, categories.id AS category, products.price AS price, products.cost AS cost, products.stock AS stock FROM products JOIN categories ON categories.id = products.category_id WHERE store_id = 1 AND products.status = 'active';";
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
                "SELECT products.id  AS id, products.name AS name, categories.id AS category, products.detail AS detail, price,  cost, stock, products.detail FROM products JOIN categories ON products.category_id = categories.id where products.id = $1;";
            const query = await client.query(sql, [id]);
            if (query.rowCount !== null && query.rowCount > 0) {
                return query.rows[0];
            } else {
                throw new Error("Error query product data");
            }
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            client.release();
        }
    },
    update: async (
        updatedProduct: {
            id: number;
            name: string;
            category: number;
            price: number;
            cost: number;
            stock: number;
            detail: string;
        },
        id: string,
    ) => {
        const { name, category, price, cost, stock, detail } = updatedProduct;
        const client = await pool.connect();
        try {
            const sql = `UPDATE products SET "name"=$1, category_id=$2, price=$3, stock=$4 , updated_at=now(), "cost"=$5, detail=$6 WHERE id=$7`;
            const query = await client.query(sql, [
                name,
                category,
                price,
                stock,
                cost,
                detail,
                id,
            ]);

            if (query.rowCount !== null && query.rowCount > 0) {
                return true;
            } else {
                throw new Error("Error updating products data");
            }
        } catch (error) {
            console.log(error);
            return error;
        } finally {
            client.release();
        }
    },
    create: async (newProduct: Product) => {
        const client = await pool.connect();
        console.log(newProduct);

        try {
            const { name, category, price, cost, stock, detail } = newProduct;
            const sql =
                "INSERT INTO products (name, category_id, price, cost, stock, detail)  VALUES ($1,$2,$3,$4,$5,$6);";

            const query = await client.query(sql, [
                name,
                category,
                price,
                cost,
                stock,
                detail,
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
