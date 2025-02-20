import { CustomError } from "../../class/CustomError";
import { QueryResult } from "../../class/QueryResult";
import { pool } from "../../utils/pool";
import { ProductLogType } from "./types";

export async function getAllService(
    fromOrder: boolean = true
): Promise<QueryResult<ProductLogType[]>> {
    const orderSql = `
        SELECT
            "uuid",
            product_variant_uuid as "variantUUID",
            order_uuid as "orderUUID",
            quantity as "qty",
            total_value as "totalValue"
        FROM
            public.product_log
        WHERE
            procurement_uuid = null
        `;
    const procurementSql = `
        SELECT
            "uuid",
            product_variant_uuid as "variantUUID",
            procurement_uuid as "procurementUUID",
            quantity as "qty",
            total_value as "totalValue"
        FROM
            public.product_log
        WHERE
            order_uuid = null
        `;
    try {
        const query = await pool.query(fromOrder ? orderSql : procurementSql);
        if (!query.rowCount) {
            throw new CustomError("Product log data not found", 404);
        }
        return new QueryResult("Get product log data success", 200, query.rows);
    } catch (error) {
        throw error;
    }
}

export async function createService(
    newLogs: ProductLogType[],
    toOrder: boolean = true
): Promise<QueryResult> {
    const orderSql = `
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
    const procurementSql = `
        INSERT
        INTO
            product_log
        (
            "uuid",
            product_variant_uuid,
            procurement_uuid,
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
    const client = await pool.connect();
    try {
        await Promise.all(
            newLogs.map((item) => {
                client.query(toOrder ? orderSql : procurementSql),
                    [
                        item.uuid,
                        item.variantUUID,
                        toOrder ? item.orderUUID : item.variantUUID,
                        item.qty,
                        item.totalValue,
                    ];
            })
        );
        return new QueryResult(
            `Create ${newLogs.length} new product log success`,
            201
        );
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
}

export async function updateService(
    updatedLogs: ProductLogType[]
): Promise<QueryResult> {
    const sql = `
        UPDATE
            product_log
        SET
            quantity = $1,
            total_value = $2,
            updated_at = now()
        WHERE
            "uuid" = $3;
`;
    const client = await pool.connect();
    try {
        await Promise.all(
            updatedLogs.map((item) => {
                client.query(sql, [item.qty, item.totalValue, item.uuid]);
            })
        );
        return new QueryResult(`Update ${updatedLogs.length} success`, 200);
    } catch (error) {
        throw error;
    } finally {
    }
}
export async function deleteByUUIDService(uuid: string): Promise<QueryResult> {
    if (uuid.length < 10) {
        throw new CustomError("This uuid is not valid", 400);
    }

    try {
        const sql = `delete from product_log where uuid = $1`;
        const query = await pool.query(sql, [uuid]);
        if (!query.rowCount) {
            throw new CustomError(
                `Failed to delete product log uuid: ${uuid}`,
                404
            );
        }
        return new QueryResult(`Delete product log uuid: ${uuid} success`, 200);
    } catch (error) {
        throw error;
    }
}
