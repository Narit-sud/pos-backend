import { pool } from "../_utils/pool";
import type { Category } from "./types";
import { CustomError } from "../_class/CustomError";
import { QueryResult } from "../_class/QueryResult";
import { Query } from "mysql2";

export async function getCategoriesService(): Promise<QueryResult<Category[]>> {
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

export async function createCategoryService(
    newCategory: Category,
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

export async function deleteCategoryService(
    uuid: string,
): Promise<QueryResult<never>> {
    const sql = `update product_category set status = 'delete' where uuid = $1`;
    try {
        const query = await pool.query(sql, [uuid]);
        if (!query.rowCount) {
            throw new CustomError(
                `Faild to delete category with uuid = ${uuid}`,
                400,
            );
        }
        return new QueryResult(`Delete category uuid = ${uuid} success`, 200);
    } catch (error) {
        throw error;
    }
}
