import { pool } from "../../utils/pool";
import { CustomError } from "../../class/CustomError";
import { QueryResult } from "../../class/QueryResult";
import { SupplierType } from "./types";

export async function getAllService(): Promise<QueryResult<SupplierType[]>> {
    const sql = `select uuid,name,surname, phone_number as "phoneNumber", email, detail,created_at as "createdAt", updated_at as "updatedAt" from supplier`;
    try {
        const query = await pool.query(sql);
        if (!query.rowCount) {
            throw new CustomError("Supplier data not found", 404);
        }
        return new QueryResult("Get supplier data success", 200, query.rows);
    } catch (error) {
        throw error;
    }
}

export async function createService(
    newSupplier: SupplierType,
): Promise<QueryResult> {
    const sql = `insert into supplier (uuid,name,surname,phone_number,email,detail) values($1,$2,$3,$4,$5,$6)`;
    try {
        await pool.query(sql, [
            newSupplier.uuid,
            newSupplier.name,
            newSupplier.surname,
            newSupplier.phoneNumber,
            newSupplier.email,
            newSupplier.detail,
        ]);
        return new QueryResult("Supplier data created", 201);
    } catch (error) {
        throw error;
    }
}
