import { pool } from "../utils/pool"
import { User } from "../types/User"

export const getAllUserService = async (): Promise<User[]> => {
    const client = await pool.connect()
    const sql = `
            SELECT 
                employees.id as id, 
                employees.name as name, 
                employees.surname as surname, 
                employees.email as email, 
                employees.phone_number as phone_number, 
                employees.username as username, 
                employees.status as status, 
                roles.name AS role 
            FROM 
                employees 
            JOIN 
                roles 
            ON
                roles.id = employees.role_id`
    try {
        const query = await client.query(sql)
        if (query.rowCount) {
            return query.rows
        } else {
            throw new Error("no user data found")
        }
    } catch (error) {
        throw error
    } finally {
        client.release()
    }
}

export const getUserByUsernameService = async (
    username: string,
): Promise<User> => {
    const client = await pool.connect()
    const sql = `
            SELECT
                employees.id as id, 
                employees.name as name, 
                employees.surname as surname, 
                employees.email as email, 
                employees.phone_number as phone_number, 
                employees.username as username, 
                employees.status as status, 
                roles.name AS role 
            FROM employees 
            JOIN roles 
                ON roles.id = employees.role_id 
            WHERE employees.username= $1`
    try {
        const query = await client.query(sql, [username])
        if (query.rowCount && query.rowCount > 0) {
            return query.rows[0]
        } else {
            throw new Error("user not found")
        }
    } catch (error) {
        throw error
    } finally {
        client.release()
    }
}

export const updateUserService = async (user: User): Promise<void> => {
    const { id, name, surname, email, phone_number } = user
    const client = await pool.connect()
    try {
        const sql =
            "UPDATE employees SET name = $1, surname = $2, email = $3, phone_number = $4 WHERE id = $5"

        const query = await client.query(sql, [
            name,
            surname,
            email,
            phone_number,
            id,
        ])
        if (!query.rowCount) {
            throw new Error("cannot update this user")
        }
    } catch (error) {
        throw error
    } finally {
        client.release()
    }
}
