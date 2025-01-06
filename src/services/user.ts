import { pool } from "../utils/pool";
import { User } from "../types/User";
import { encryptPassword, comparePassword } from "../utils/encrypt";

export const userService = {
    getAll: async () => {
        const client = await pool.connect();
        try {
            const sql =
                "SELECT employees.id, first_name, last_name, phone_number, roles.name AS ROLE, username FROM employees JOIN roles ON employees.ROLE = roles.id";
            const data = await client.query(sql);
            if (data.rowCount !== null && data.rowCount > 0) {
                return data.rows;
            } else {
                throw new Error("Error querying user data");
            }
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    },

    getById: async (id: string) => {
        const client = await pool.connect();
        try {
            const data = await client.query(
                "SELECT employees.id, first_name, last_name, phone_number, roles.name AS ROLE, username FROM employees JOIN roles ON employees.ROLE = roles.id WHERE employees.id = $1",
                [id],
            );
            if (data.rowCount !== null && data.rowCount > 0) {
                return data.rows[0]; // Return a single user object
            } else {
                throw new Error("Error querying user data by id");
            }
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    },

    create: async (user: User) => {
        const {
            first_name,
            last_name,
            phone_number,
            username,
            password,
            role,
        } = user;

        const client = await pool.connect();
        const hashedPassword = await encryptPassword(password);

        try {
            const sql =
                "insert into employees (first_name, last_name, phone_number, role, username, password) values ($1, $2, $3, $4, $5, $6)";
            await client.query(sql, [
                first_name,
                last_name,
                phone_number,
                role,
                username,
                hashedPassword,
            ]);

            return true;
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    },

    login: async (loginDetail: { username: string; password: string }) => {
        const client = await pool.connect();
        const sql =
            "select username, password from employees where username = $1";

        // get pass from database
        try {
            const query = await client.query(sql, [loginDetail.username]);

            if (query.rowCount !== null || query.rows.length > 0) {
                const queryResults = query.rows[0];

                const isPasswordMatched = await comparePassword(
                    loginDetail.password, // stringPassword
                    queryResults.password, // hashedPassword
                );

                if (isPasswordMatched) {
                    // if password matched
                    return true;
                } else {
                    // if password doesn't matched
                    return false;
                }
            } else {
                // if no data returned from database
                return false;
            }
        } catch (error) {
            throw error;
        }
    },
};
