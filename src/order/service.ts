import { pool } from "../_utils/pool";
import { CustomError } from "../_class/CustomError";
import { QueryResult } from "../_class/QueryResult";
import { OrderType } from "./types";

export async function getAll(): Promise<QueryResult<OrderType[]>> {
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

export async function createService(newOrder: OrderType): Promise<QueryResult> {
    const sql = `insert into "order" (uuid, customer_uuid) values ($1, $2)`;
    try {
        const query = await pool.query(sql, [
            newOrder.uuid,
            newOrder.customerUUID,
        ]);
        if (!query.rowCount) {
            throw new CustomError("Failed to create new order", 400);
        }
        return new QueryResult("Create new order success", 201);
    } catch (error) {
        throw error;
    }
}
export async function updateService(
    updatedOrder: OrderType,
): Promise<QueryResult> {
    const sql = `update "order" set customer_uuid = $1, updated_at = now() where uuid = $2`;
    try {
        const query = await pool.query(sql, [
            updatedOrder.customerUUID,
            updatedOrder.uuid,
        ]);
        if (!query.rowCount) {
            throw new CustomError(
                `Failed to update order uuid: ${updatedOrder.uuid}`,
                400,
            );
        }
        return new QueryResult(
            `Update order uuid: ${updatedOrder.uuid} success`,
            200,
        );
    } catch (error) {
        throw error;
    }
}
export async function deleteService(orderUUID: string): Promise<QueryResult> {
    const sql = `delete from "order" where uuid = $1`;
    try {
        const query = await pool.query(sql, [orderUUID]);
        if (!query.rowCount) {
            throw new CustomError(
                `Failed to delete order uuid: ${orderUUID}`,
                400,
            );
        }
        return new QueryResult(`Delete order uuid: ${orderUUID} success`, 200);
    } catch (error) {
        throw error;
    }
}
