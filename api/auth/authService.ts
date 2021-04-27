import { pool } from "../../utils/database";

const generateNewToken = async (userId: number) => {
    const query = 
        `INSERT INTO login_token (user_id, token, created_at, expired) 
            VALUES ($1, uuid_in(md5(random()::text || clock_timestamp()::text)::cstring), NOW(), false)
            RETURNING token`;
    const params = [userId];
    const result = await pool.query(query, params);
    return result.rows[0].token;
}

const disableOldToken = async (userId: number, newToken: string) => {
    const query = 
        `UPDATE login_token SET expired = true WHERE user_id = $1 AND token <> $2`;
    const params = [userId, newToken];
    const result = await pool.query(query, params);
    return result.rowCount;
}

const verifyToken = async (token: string): Promise<any> => {
    const rows = await pool.query(`SELECT user_id FROM login_token WHERE token = $1 AND expired = false`, [token]);
    return rows.rows;
}

export const authService = {
    generateNewToken,
    disableOldToken,
    verifyToken
}