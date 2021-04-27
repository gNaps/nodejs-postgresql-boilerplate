import { User } from '../../model/User';
import { pool } from '../../utils/database'

const getAll = async () => {
    const rows = await pool.query(`SELECT * FROM users`);
    return rows.rows;
}

const getByEmail = async (email: string) => {
    const rows = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    return rows.rows;
}

const getById = async (id: number) => {
    const rows = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
    return rows.rows;
}

const createUser = async (user: User): Promise<number> => {
    const query = 
        `INSERT INTO users (email, created_at) 
            VALUES ($1, NOW())
            RETURNING id`;
    const params = [user.email];

    const result = await pool.query(query, params);
    return result.rows[0].id;
}

const updateUser = async (user: User): Promise<number> => {
    const query = `UPDATE users SET username = $1 WHERE id = $2 RETURNING id`;
    const result = await pool.query(query, [user.username, user.id]);
    return result.rows[0].id;
}

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
    deleteUser
}