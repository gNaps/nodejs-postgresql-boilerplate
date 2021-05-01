import { pool } from "../../utils/database";

/**
 * Stacca un nuovo token per l'utente in ingresso
 * @param userId 
 * @returns 
 */
const generateNewToken = async (userId: number) => {
    const query = 
        `INSERT INTO login_token (user_id, token, created_at, expired) 
            VALUES ($1, uuid_in(md5(random()::text || clock_timestamp()::text)::cstring), NOW(), false)
            RETURNING token`;
    const params = [userId];
    const result = await pool.query(query, params);
    return result.rows[0].token;
}

/**
 * Disabilita in automatico tutti i vecchi token quando utente esegue una nuova login
 * @param userId 
 * @param newToken 
 * @returns 
 */
const disableOldToken = async (userId: number, newToken: string) => {
    const query = 
        `UPDATE login_token SET expired = true WHERE user_id = $1 AND token <> $2`;
    const params = [userId, newToken];
    const result = await pool.query(query, params);
    return result.rowCount;
}

/**
 * Verifica che il token in esame non sia scaduto / non valido
 * @param token 
 * @returns 
 */
const verifyToken = async (token: string): Promise<any> => {
    const rows = await pool.query(`SELECT user_id FROM login_token WHERE token = $1 AND expired = false`, [token]);
    return rows.rows;
}

/**
 * Dato il metodo, la route e utente verifica se autorizzato dal gruppo policy
 * @param method 
 * @param route 
 * @param user 
 * @returns 
 */
const verifyPolicy = async (method: string, route: string, user: number | undefined): Promise<any> => {
    const query = `select pg.group_name 
    from users uu
    left join policy_groups pg on uu.policy_groups = pg.group_name
    where uu.id = $1 AND pg.controller = $2 and pg.method = $3`;
    const params = [user, route, method];
    const rows = await pool.query(query, params);
    return rows.rows;
}

/**
 * Quando utente esegue logout allora disabilita il token attivo nella sessione 
 * @param token 
 * @returns 
 */
const logout = async (token: string) => {
    const query = 
        `UPDATE login_token SET expired = true WHERE token = $1`;
    const params = [token];
    const result = await pool.query(query, params);
    return result.rowCount;
}

export const authService = {
    generateNewToken,
    disableOldToken,
    verifyToken,
    logout,
    verifyPolicy
}