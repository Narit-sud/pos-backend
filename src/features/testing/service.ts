import { CustomError } from "../../class/CustomError";
import { QueryResult } from "../../class/QueryResult";
import { pool } from "../../utils/pool";

export const testingGetAllProductIncludeProductMainAndVariant = async () => {
    const client = await pool.connect();
    try {
        const query = await client.query(`SELECT 
	pm.*,
	pv.*
	FROM product_main pm
	LEFT JOIN
	product_variant pv
	ON pm.uuid = pv.product_main_uuid
`);
        if (!query.rowCount) {
            throw new CustomError("No product data found", 404);
        }

        return new QueryResult("Get all data success", 200, query.rows);
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
};
