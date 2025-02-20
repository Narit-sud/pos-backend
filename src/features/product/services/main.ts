import { pool } from "../../../utils/pool";
import { CustomError } from "../../../class/CustomError";
import type { MainProductType } from "../types";
import { QueryResult } from "../../../class/QueryResult";

export const getMains = async (): Promise<QueryResult<MainProductType[]>> => {
    const sql = `
        SELECT
            pm.index AS "index",
            pm.uuid AS "uuid",
            pm.name AS "name",
            pm.product_category_uuid AS "category",
            pm.detail AS "detail",
            pm.created_at AS "createdAt",
            pm.updated_at AS "updatedAt",
            count(pv.uuid) AS "variantCount",
            pm.status as "status"
        FROM
            product_main pm
        LEFT JOIN product_variant pv ON pm.uuid = pv.product_main_uuid
        WHERE
            pm.status = 'active'
        GROUP BY pm.uuid
        ORDER BY
            pm.index;
`;
    try {
        const query = await pool.query(sql);
        if (!query.rowCount) {
            throw new CustomError("Product main data not found", 404);
        }
        return new QueryResult(
            "Get product main data success",
            200,
            query.rows
        );
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export async function updateMain(
    mainProduct: MainProductType
): Promise<QueryResult<never>> {
    const sql = `update product_main set name = $1, product_category_uuid = $2, detail = $3, updated_at = now() where uuid = $4`;

    try {
        const query = await pool.query(sql, [
            mainProduct.name,
            mainProduct.category,
            mainProduct.detail,
            mainProduct.uuid,
        ]);
        if (!query.rowCount) {
            throw new CustomError(
                `Update product: ${mainProduct.name} with uuid: ${mainProduct.uuid} failed`,
                400
            );
        }

        return new QueryResult(
            `Update product: ${mainProduct.name} with uuid: ${mainProduct.uuid} success`,
            200
        );
    } catch (error) {
        throw error;
    }
}
