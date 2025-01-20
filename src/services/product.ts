import { Product } from "../types/Product";
import { TrueResults, FalseResults, QueryResults } from "../class/QueryResult";
import { pool } from "../utils/pool";

export const productService = {
    getAll: async () => {
        const client = await pool.connect();
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
                    products.id;`;
            const query = await client.query(sql);
            if (query.rowCount !== null && query.rowCount > 0) {
                return query.rows;
            } else {
                throw new Error("product not found");
            }
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    },

    getById: async (id: string) => {
        const client = await pool.connect();
        console.log(id);

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
                    products.id;`;
            const query = await client.query(sql, [id]);
            if (query.rowCount && query.rowCount > 0) {
                return new QueryResults(
                    true,
                    `get product id: ${id} success`,
                    query.rows[0],
                );
            } else {
                return new QueryResults(false, `product id: ${id} not found`);
            }
        } catch (error) {
            return new QueryResults(
                false,
                `error getting get product id: ${id}`,
                error,
            );
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
            const sql = `UPDATE products SET "name"=$1, category_id=$2, price=$3, stock=$4 , updated_at=now(), "cost"=$5, detail=$6, updated_at = now() WHERE id=$7`;
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

            if (query.rowCount && query.rowCount > 0) {
                const result = new TrueResults("insert new product success");
                return result;
            } else {
                const result = new FalseResults("insert new product failed");
                return result;
            }
        } catch (error) {
            const result = new FalseResults("insert new product failed", error);
            console.log(result);
            return result;
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
