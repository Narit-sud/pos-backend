import { CustomError } from "../../class/CustomError";
import { pool } from "../../utils/pool";
import { ProcurementType } from "./types";
import { QueryResult } from "../../class/QueryResult";
import { log } from "console";

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
        console.log(procureQuery.rows);
        if (!procureQuery.rowCount) {
            throw new CustomError("No procurement data found", 404);
        }
        const logQuery = await pool.query(logSQL);
        console.log(logQuery.rows);
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
