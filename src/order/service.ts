import { pool } from "../_utils/pool";
import { CustomError } from "../_class/CustomError";
import { QueryResult } from "../_class/QueryResult";
import { OrderType } from "./types";

export async function getAll() {
    const sql = `select * from product_log;`;
    try {
        const query = await pool.query(sql);
        if (!query.rowCount) {
            throw new CustomError("Product log data not found", 404);
        }
        return new QueryResult("Get product log data success", 200, query.rows);
    } catch (error) {
        throw error;
    }
}

export async function createService(newOrder: OrderType) {
    const sql = `insert into "order" (uuid, customer_id) values ($1, $2)`;
    try {
        const query = await pool.query(sql, [
            newOrder.uuid,
            newOrder.customerId,
        ]);
        if (!query.rowCount) {
            throw new CustomError("Failed to create new order", 400);
        }
        return new QueryResult("Create new order success", 201);
    } catch (error) {
        throw error;
    }
}
export async function updateService() {}
export async function deleteService() {}
