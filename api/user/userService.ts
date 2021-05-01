import { User } from '../../model/User';
import { pool } from '../../utils/database'

/** Recupera tutti gli utenti */
const getAll = async () => {
    const rows = await pool.query(`SELECT * FROM users`);
    return rows.rows;
}

/** Recupera un solo utente data la mail */
const getByEmail = async (email: string) => {
    const rows = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    return rows.rows;
}

/** Recupera un solo utente dato l'id */
const getById = async (id: number) => {
    const rows = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    return rows.rows;
}

/** Recupera un solo utente dato un token attivo su di esso */
const getUserByToken = async (token: string): Promise<Array<User>> => {
    const query = `select u.id, u.email, coalesce(u.username, '') as username
    from login_token l
    join users u on u.id = l.user_id
    where token = $1 and expired = false`;

    const rows = await pool.query(query, [token]);
    const users: Array<User> = rows.rows;

    return users;
}

/** Crea un nuovo utente */
const createUser = async (user: User): Promise<number> => {
    const query = 
        `INSERT INTO users (email, created_at, policy_groups) 
            VALUES ($1, NOW(), $2)
            RETURNING id`;
    const params = [user.email, user.policy_groups];

    const result = await pool.query(query, params);
    return result.rows[0].id;
}

/** Aggiorna username di utente */
const updateUser = async (user: User): Promise<number> => {
    const query = `UPDATE users SET username = $1, policy_groups = $2 WHERE id = $3 RETURNING id`;
    const result = await pool.query(query, [user.username, user.policy_groups, user.id]);
    return result.rows[0].id;
}

/** Elimina un utente dato l'id */
const deleteUser = async (id: number): Promise<boolean> => {
    const query = `DELETE FROM users WHERE id = $1`;
    const result = await pool.query(query, [id]);
    if(result.rowCount === 1) {
        return true;
    } else {
        return false;
    }
}

export const userService = {
    getAll,
    getByEmail,
    getById,
    createUser,
    updateUser,
    deleteUser,
    getUserByToken
}