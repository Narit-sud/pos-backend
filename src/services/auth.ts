import { pool } from "../utils/pool";
import { comparePassword, encryptPassword } from "../utils/encrypt";
import { QueryResults } from "../class/QueryResult";
import { User } from "../types/User";

export const authService = {
    register: async (newUser: User) => {
        const { name, surname, email, phone_number, username, password } =
            newUser;

        const client = await pool.connect();
        const hashedPassword = await encryptPassword(password);

        try {
            const sql = `
                INSERT INTO employees 
                    (name , surname, email, phone_number, username, password) 
                VALUES 
                    ($1, $2, $3, $4, $5, $6)`;
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
            throw error;
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
            const stringPassword = loginDetail.password;

            // check query result
            if (query.rowCount && query.rowCount > 0) {
                // query return something

                // compare password
                const { password: hashedPassword } = query.rows[0];
                const isPasswordMatched = await comparePassword(
                    stringPassword as string,
                    hashedPassword as string,
                );
                if (!isPasswordMatched) {
                    // if password doesn't matched
                    throw new Error("wrong password");
                }
                // if password matched
                return true;
            } else {
                // if query return nothing
                throw new Error("user not found");
            }
        } catch (error) {
            throw error; // return new QueryResults(false, "Database error", error);
        } finally {
            client.release();
        }
    },
};
