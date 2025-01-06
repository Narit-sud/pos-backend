import { pool } from "../utils/pool";

export const role = {
    // get all role
    getAll: async () => {
        const client = await pool.connect();
        try {
            const sql = "select * from roles";
            const data = await client.query(sql);
            if (data.rowCount !== null && data.rowCount > 0) {
                return data.rows;
            } else {
                throw new Error("Error querying roles");
            }
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    },
    // get role by id
    getById: async (id: string) => {
        const client = await pool.connect();
        try {
            const sql = "select * from roles where id = $1";
            const data = await client.query(sql, [id]);
            if (data.rowCount !== null && data.rowCount > 0) {
                return data.rows[0];
            } else {
                throw new Error("Error querying roles");
            }
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    },
};
