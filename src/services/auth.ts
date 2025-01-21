import { pool } from "../utils/pool"
import { comparePassword, encryptPassword } from "../utils/encrypt"
import { User } from "../types/User"
import { LoginDetail } from "../interfaces/LoginDetail"

export const registerService = async (user: User): Promise<void> => {
    const { name, surname, email, phone_number, username, password } = user

    const client = await pool.connect()
    const hashedPassword = await encryptPassword(password)

    try {
        const sql = `
                INSERT INTO employees 
                    (name , surname, email, phone_number, username, password) 
                VALUES 
                    ($1, $2, $3, $4, $5, $6)`
        const query = await client.query(sql, [
            name,
            surname,
            email,
            phone_number,
            username,
            hashedPassword,
        ])

        if (!query.rowCount) {
            throw new Error("create new user failed")
        }
    } catch (error) {
        throw error
    } finally {
        client.release()
    }
}

export const loginService = async (loginDetail: LoginDetail): Promise<void> => {
    const client = await pool.connect()
    try {
        const sql = "SELECT password from employees WHERE username = $1"
        const query = await client.query(sql, [loginDetail.username])
        // check query result
        if (!query.rowCount) {
            throw new Error("user not found")
        }
        // compare password
        const stringPassword = loginDetail.password
        const { password: hashedPassword } = query.rows[0]
        const isPasswordMatched = await comparePassword(
            stringPassword as string,
            hashedPassword as string,
        )
        // if password doesn't matched
        if (!isPasswordMatched) {
            throw new Error("wrong password")
        }
    } catch (error) {
        throw error
    } finally {
        client.release()
    }
}
