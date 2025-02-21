import { CustomError } from "../../class/CustomError";
import { pool } from "../../utils/pool";
import { ProcurementType } from "./types";
import { QueryResult } from "../../class/QueryResult";

export async function getAllService(): Promise<QueryResult<ProcurementType[]>> {
    const procureSQL = `
        SELECT
            "uuid",
            "supplier_uuid" as "supplierUUID",
            "is_paid" as "isPaid",
            "is_received" as "isReceived",
            "bill_date" as "billDate",
            "created_at" as "createdAt",
            "updated_at" as "updatedAt"
        FROM
            procurement;
`;
    const logSQL = `
        SELECT
            "uuid",
            product_variant_uuid as "variantUUID",
            procurement_uuid as "procurementUUID",
            quantity as "qty",
            total_value as "totalValue"
        FROM
            public.product_log
        WHERE
            order_uuid is null
        
`;
    try {
        const procureQuery = await pool.query(procureSQL);
        if (!procureQuery.rowCount) {
            throw new CustomError("No procurement data found", 404);
        }
        const logQuery = await pool.query(logSQL);
        if (!logQuery.rowCount) {
            throw new CustomError("No product log data found", 404);
        }

        const procurements = procureQuery.rows.map((row) => ({
            ...row,
            procurementItems: logQuery.rows.filter(
                (log) => log.procurementUUID === row.uuid,
            ),
        })) as ProcurementType[];

        return new QueryResult(
            "Get procurement data success",
            200,
            procurements,
        );
    } catch (error) {
        throw error;
    }
}

export async function createService(
    newProcure: ProcurementType,
): Promise<QueryResult> {
    const client = await pool.connect();
    const procureSQL = `
        INSERT
        INTO
            procurement
        (
            "uuid",
            supplier_uuid,
            is_paid,
            is_received,
            bill_date,
            created_at,
            updated_at
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4,
            $5,
            now(),
            now()
        );
`;
    const logSQL = `
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
    try {
        await client.query("BEGIN");
        await client.query(procureSQL, [
            newProcure.uuid,
            newProcure.supplierUUID,
            newProcure.isPaid,
            newProcure.isReceived,
            newProcure.billDate,
        ]);
        await Promise.all(
            newProcure.procurementItems.map((item) => {
                return client.query(logSQL, [
                    item.uuid,
                    item.variantUUID,
                    newProcure.uuid,
                    item.qty,
                    item.totalValue,
                ]);
            }),
        );
        await client.query("COMMIT");
        return new QueryResult("Create new order success", 201);
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}
