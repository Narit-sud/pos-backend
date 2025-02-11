import { pool } from "../_utils/pool";
pool;
import { CustomError } from "../_class/CustomError";
import { QueryResult } from "../_class/QueryResult";
import { CustomerType } from "./types";

export async function getAll(): Promise<QueryResult<CustomerType[]>> {
    const sql = `
        SELECT
            uuid,
            name,
            surname,
            phone_number AS "phoneNumber",
            email,
            detail,
            created_at AS " createdAt",
            updated_at AS " updatedAt",
            status
        FROM
            customer
        WHERE
            status = 'active';`;
    try {
        const query = await pool.query(sql);
        if (!query.rowCount) {
            throw new CustomError("Customer data not found", 404);
        }

        return new QueryResult("Get customer data success", 200, query.rows);
    } catch (error) {
        throw error;
    }
}

export async function createNew(
    newCustomer: CustomerType,
): Promise<QueryResult> {
    const sql = `
        INSERT
        INTO
            customer
        (
            "uuid",
            "name",
            surname,
            phone_number,
            email,
            detail,
            created_at,
            updated_at,
            status
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            now(),
            now(),
            'active'
        );`;
    try {
        const query = await pool.query(sql, [
            newCustomer.uuid,
            newCustomer.name,
            newCustomer.surname,
            newCustomer.phoneNumber,
            newCustomer.email,
            newCustomer.detail,
        ]);
        if (!query.rowCount) {
            throw new CustomError("Failed to create new customer", 400);
        }
        return new QueryResult("Create new customer success", 201);
    } catch (error) {
        throw error;
    }
}

export async function updateByUUID(
    updatedCustomer: CustomerType,
): Promise<QueryResult> {
    const { name, surname, phoneNumber, email, detail, uuid } = updatedCustomer;
    const sql = `
        UPDATE
            customer
        SET
            "name" = $1,
            surname = $2,
            phone_number = $3,
            email = $4,
            detail = $5,
            updated_at = now()
        WHERE
            "uuid" = $6;`;
    try {
        const query = await pool.query(sql, [
            name,
            surname,
            phoneNumber,
            email,
            detail,
            uuid,
        ]);
        if (!query.rowCount) {
            throw new CustomError(
                `Failed to update customer with UUID: ${updatedCustomer.uuid}`,
                400,
            );
        }
        return new QueryResult(
            `Update customer with UUID: ${updatedCustomer.uuid} success`,
            200,
        );
    } catch (error) {
        throw error;
    }
}

export async function deleteByUUID(uuid: string): Promise<QueryResult> {
    try {
        const sql = `update customer set status = 'delete' where uuid = $1`;
        const query = await pool.query(sql, [uuid]);
        if (!query.rowCount) {
            throw new CustomError(
                `Failed to delete customer UUID: ${uuid}`,
                400,
            );
        }

        return new QueryResult(`Delete customer UUID: ${uuid} success`, 200);
    } catch (error) {
        throw error;
    }
}
