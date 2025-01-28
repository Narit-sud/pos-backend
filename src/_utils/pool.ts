import { Pool } from "pg";

const dbConfig = {
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    ssl: true,
    idleTimeoutMillis: 0,
};
export const pool = new Pool(dbConfig);

export const client = pool.connect();
