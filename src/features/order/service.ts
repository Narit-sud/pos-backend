import { client, pool } from "../../utils/pool";
import { CustomError } from "../../class/CustomError";
import { QueryResult } from "../../class/QueryResult";
import { OrderType } from "./types";
import { getAllService } from "../productLog/service";

export async function getAll(): Promise<QueryResult<OrderType[]>> {
    const orderSQL = `
        SELECT
            "uuid",
            "customer_uuid" as "customerUUID",
            "created_at" as "createdAt",
            "updated_at" as "updatedAt"
        FROM
            public.order
`;

    const logSQL = `
        SELECT
            "uuid",
            product_variant_uuid as "variantUUID",
            order_uuid as "orderUUID",
            quantity as "qty",
            total_value as "totalValue"
        FROM
            public.product_log
        WHERE
            procurement_uuid is null

`;
    try {
        const orderQuery = await pool.query(orderSQL);
        if (!orderQuery.rowCount) {
            throw new CustomError("Order data not found", 404);
        }
        const logQuery = await pool.query(logSQL);
        if (!logQuery.rowCount) {
            throw new CustomError("Product log data not found", 404);
        }
        const orders = orderQuery.rows.map((row) => ({
            ...row,
            saleItems: logQuery.rows.filter(
                (log) => log.orderUUID === row.uuid,
            ),
        })) as OrderType[];

        return new QueryResult("Get product log data success", 200, orders);
    } catch (error) {
        throw error;
    }
}

export async function createService(newOrder: OrderType): Promise<QueryResult> {
    const client = await pool.connect();
    const orderSQL = `insert into "order" (uuid, customer_uuid) values ($1, $2)`;
    const productLogSQL = `
        INSERT
        INTO
            product_log
        (
            "uuid",
            product_variant_uuid,
            order_uuid,
            quantity,
            total_value,
            created_at,
            updated_at
        )
        VALUES(
            $1,
            $2,
            $3,
            $4,
            $5,
            now(),
            now()
        );
`;
    try {
        await client.query("BEGIN");
        await client.query(orderSQL, [newOrder.uuid, newOrder.customerUUID]);
        await Promise.all(
            newOrder.saleItems.map((item) => {
                client.query(productLogSQL, [
                    item.uuid,
                    item.variantUUID,
                    item.receiptUUID,
                    item.qty,
                    item.total,
                ]);
            }),
        );
        return new QueryResult("Create new order success", 201);
    } catch (error) {
        throw error;
    } finally {
        client.release();
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
