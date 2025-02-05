import { Product } from "../_interfaces/Product";
import { pool } from "../_utils/pool";
import { CustomError } from "../_class/CustomError";
import { ProductMain } from "./type";
import { QueryResult } from "../_class/QueryResult";

export const getAllProducts = async (): Promise<Product[]> => {
    const client = await pool.connect();
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
    try {
        const query = await client.query(sql);
        if (query.rowCount !== null && query.rowCount > 0) {
            return query.rows;
        } else {
            throw new CustomError(`Product not found`, 400);
        }
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
};

export const getProductById = async (id: string): Promise<Product> => {
    const client = await pool.connect();
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
    try {
        const query = await client.query(sql, [id]);
        if (query.rowCount) {
            return query.rows[0];
        } else {
            throw new CustomError(`Product id ${id} not found`, 400);
        }
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
};

export const createProduct = async (product: Product): Promise<string> => {
    const client = await pool.connect();
    const { name, category, price, cost, stock, detail } = product;
    const sql = `
        INSERT
        INTO
            products
            (name, category_id, price, cost, stock, detail)
        VALUES
            ($1,$2,$3,$4,$5,$6);`;
    const sql2 = `
        SELECT
            id
        FROM
            products
        WHERE
            products.name = $1`;

    try {
        const query = await client.query(sql, [
            name,
            category,
            price,
            cost,
            stock,
            detail,
        ]);

        if (!query.rowCount) {
            throw new CustomError("Create product failed", 400);
        }

        const query2 = await client.query(sql2, [name]);
        return query2.rows[0].id;
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
};

export const updateProduct = async (product: Product): Promise<void> => {
    const client = await pool.connect();
    const { id, name, category, price, cost, stock, detail } = product;
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
            id = $7`;
    try {
        const query = await client.query(sql, [
            name,
            category,
            price,
            stock,
            cost,
            detail,
            id,
        ]);

        if (!query.rowCount) {
            throw new CustomError(`Cannot update product id: ${id}`, 400);
        }
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
};

export const deleteProduct = async (id: string): Promise<void> => {
    const client = await pool.connect();
    const sql = `
        UPDATE
            products
        SET
            status = 'deleted'
        WHERE
            id = $1
        AND
            status != 'deleted'`;
    try {
        const query = await client.query(sql, [id]);
        if (!query.rowCount) {
            throw new CustomError(`product id ${id} not found`, 404);
        }
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
};

export const getMainService = async (): Promise<QueryResult<ProductMain[]>> => {
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
`;
    try {
        const query = await pool.query(sql);
        if (!query.rowCount) {
            throw new CustomError("Product main data not found", 404);
        }
        return new QueryResult(
            "Get product main data success",
            200,
            query.rows,
        );
    } catch (error) {
        console.log(error);

        throw error;
    }
};

export const getVariantService = async () => {
    const client = await pool.connect();
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
`;
    try {
        const query = await client.query(sql);
        if (!query.rowCount) {
            throw new CustomError("Product variant data not found", 404);
        }

        return new QueryResult(
            "Get product variant data success",
            200,
            query.rows,
        );
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
};
