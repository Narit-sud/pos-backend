import { pool } from "../../utils/pool";
import type { CategoryType } from "./types";
import { CustomError } from "../../class/CustomError";
import { QueryResult } from "../../class/QueryResult";

export async function getAll(): Promise<QueryResult<CategoryType[]>> {
    const sql = `
        SELECT
            "index",
            "uuid",
            "name",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
        FROM
            product_category
        WHERE
            status = 'active'
        ORDER BY "index";`;
    try {
        const query = await pool.query(sql);
        if (!query.rowCount) {
            throw new CustomError("Category data not found", 404);
        }
        return new QueryResult("Get category data success", 200, query.rows);
    } catch (error) {
        throw error;
    }
}

export async function getByUUID(
    uuid: string
): Promise<QueryResult<CategoryType>> {
    const sql = `
        SELECT
            "index",
            "uuid",
            "name",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
        FROM
            product_category
        WHERE
            status = 'active'
        AND
            uuid = $1`;
    try {
        const query = await pool.query(sql, [uuid]);
        if (!query.rowCount) {
            throw new CustomError(
                `Category with uuid = ${uuid} not found`,
                404
            );
        }
        return new QueryResult<CategoryType>(
            `Get category with uuid = ${uuid} success`,
            200,
            query.rows[0]
        );
    } catch (error) {
        throw error;
    }
}

export async function createNew(
    newCategory: CategoryType
): Promise<QueryResult<never>> {
    const { uuid, name, detail } = newCategory;
    const sql = `
        INSERT
        INTO
            product_category
            (uuid, name, detail)
        VALUES
            ($1, $2, $3);
`;
    try {
        const query = await pool.query(sql, [uuid, name, detail]);
        if (!query.rowCount) {
            throw new CustomError("Create new category failed", 400);
        }
        return new QueryResult("Create new category success", 201);
    } catch (error) {
        throw error;
    }
}

export async function deleteByUUID(uuid: string): Promise<QueryResult<never>> {
    const sql = `update product_category set status = 'delete' where uuid = $1`;
    try {
        const query = await pool.query(sql, [uuid]);
        if (!query.rowCount) {
            throw new CustomError(
                `Faild to delete category with uuid = ${uuid}`,
                400
            );
        }
        return new QueryResult(`Delete category uuid = ${uuid} success`, 200);
    } catch (error) {
        throw error;
    }
}

export async function updateByUUID(
    updatedCategory: CategoryType
): Promise<QueryResult> {
    const sql = `update product_category set name = $1, detail = $2 where uuid = $3`;
    try {
        const query = await pool.query(sql, [
            updatedCategory.name,
            updatedCategory.detail,
            updatedCategory.uuid,
        ]);
        if (!query.rowCount) {
            throw new CustomError(
                `Update category with UUID: ${updatedCategory.uuid} failed`,
                400
            );
        }
        return new QueryResult(
            `Update category with UUID: ${updatedCategory.uuid} success`,
            200
        );
    } catch (error) {
        throw error;
    }
}
