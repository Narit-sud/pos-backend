import { pool } from "../utils/pool";
import { encryptPassword, comparePassword } from "../utils/encrypt";
import { User } from "../types/User";
import { QueryResults } from "../class/QueryResult";
import { PgError } from "../interfaces/PgError";

export const userService = {
    getAll: async () => {
        const client = await pool.connect();
        try {
            const sql =
                "SELECT employees.id, employees.name, employees.surname, employees.email, employees.phone_number, employees.username, employees.status, roles.name AS ROLE FROM employees JOIN roles ON roles.id = employees.role_id";
            const query = await client.query(sql);
            if (query.rowCount && query.rowCount > 0) {
                return new QueryResults(
                    true,
                    "get users data success",
                    query.rows,
                );
            } else {
                return new QueryResults(false, "failed to query users data");
            }
        } catch (error) {
            return new QueryResults(false, "error query users data", error);
        } finally {
            client.release();
        }
    },

    getById: async (id: string) => {
        const client = await pool.connect();
        try {
            const query = await client.query(
                "SELECT employees.id as id, employees.name as name, employees.surname as surname, employees.email as email, employees.phone_number as phone_number, employees.username as username, employees.status as status, roles.name AS role FROM employees JOIN roles ON roles.id = employees.role_id WHERE employees.id = $1",
                [id],
            );
            if (query.rowCount && query.rowCount > 0) {
                return new QueryResults(
                    true,
                    `success query user id: ${id}`,
                    query.rows[0],
                );
            } else {
                return new QueryResults(
                    false,
                    `user id: ${id} doesn't existed`,
                );
            }
        } catch (error) {
            return new QueryResults(false, `error query user id: ${id}`, error);
        } finally {
            client.release();
        }
    },

    create: async (user: User) => {
        const { name, surname, email, phone_number, username, password } = user;

        const client = await pool.connect();
        const hashedPassword = await encryptPassword(password);

        try {
            const sql =
                "insert into employees (name , surname, email, phone_number, username, password) values ($1, $2, $3, $4, $5, $6)";
            const query = await client.query(sql, [
                name,
                surname,
                email,
                phone_number,
                username,
                hashedPassword,
            ]);

            return new QueryResults(true, "Create new user success");
        } catch (error) {
            return new QueryResults(
                false,
                "Error creating new user",
                undefined,
                error as PgError,
            );
        } finally {
            client.release();
        }
    },

    login: async (loginDetail: { username: string; password: string }) => {
        const client = await pool.connect();
        try {
            // query password
            const sql = "SELECT password from employees WHERE username = $1";
            const query = await client.query(sql, [loginDetail.username]);
            if (query.rowCount && query.rows.length > 0) {
                // compare password
                const isPasswordMatched = await comparePassword(
                    loginDetail.password,
                    query.rows[0].password,
                );

                // if wrong password, get out
                if (!isPasswordMatched) {
                    return new QueryResults(false, "Wrong password");
                }

                return new QueryResults(true, "Login success");
            }
        } catch (error) {
            return new QueryResults(false, "Database error", error);
        } finally {
            client.release();
        }
    },
    getAuth: async (username: string) => {
        // query user data
        const client = await pool.connect();
        try {
            const sql =
                "SELECT employees.id AS id, employees.name AS name, employees.surname AS surname, employees.email AS email, employees.phone_number AS phone_number, employees.username AS username, employees.status AS status, roles.name AS role FROM employees JOIN roles ON roles.id = employees.role_id WHERE employees.username = $1;";
            const userQuery = await client.query(sql, [username]);

            if (userQuery.rowCount && userQuery.rows.length > 0) {
                return new QueryResults(
                    true,
                    "get user data success",
                    userQuery.rows[0],
                );
            } else {
                return new QueryResults(
                    false,
                    "unexpected error: query user data after login",
                );
            }
        } catch (error) {
            return new QueryResults(false, "error query user auth", error);
        }
    },

    update: async (user: User) => {
        const { id, name, surname, email, phone_number } = user;

        const client = await pool.connect();

        try {
            const sql =
                "UPDATE employees SET name = $1, surname = $2, email = $3, phone_number = $4 WHERE id = $5";

            await client.query(sql, [name, surname, email, phone_number, id]);

            return true;
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    },
};
