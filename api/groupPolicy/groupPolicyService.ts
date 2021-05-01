import { GroupPolicy } from '../../model/GroupPolicy';
import { pool } from '../../utils/database'

/** Recupera tutti i gruppi policy */
const getAll = async () => {
    const rows = await pool.query(`SELECT * FROM policy_groups`);
    return rows.rows;
}

/** Recupera un solo gruppo policy dato l'id */
const getById = async (id: number) => {
    const rows = await pool.query(`SELECT * FROM policy_groups WHERE id = $1`, [id]);
    return rows.rows;
}

/** Crea un nuovo group policy */
const createGroupPolicy = async (gp: GroupPolicy): Promise<number> => {
    const query = 
        `insert into policy_groups
            (group_name, controller, method, created_at)
        values 
            ($1, $2, $3, NOW())
        RETURNING id`;
    const params = [gp.group_name, gp.controller, gp.method];

    const result = await pool.query(query, params);
    return result.rows[0].id;
}

/** Aggiorna un group policy già esistente */
const updateGroupPolicy = async (gp: GroupPolicy): Promise<number> => {
    const query = `UPDATE policy_groups 
                    SET group_name = $1, controller = $2, method = $3
                    WHERE id = $4 
                    RETURNING id
                `;
    const { id, group_name, controller, method } = gp;
    const params = [id, group_name, controller, method];
    const result = await pool.query(query, params);
    return result.rows[0].id;
}

/** Elimina un gruppoPolicy dato l'id */
const deleteGroupPolicy = async (id: number): Promise<boolean> => {
    const query = `DELETE FROM group_policy WHERE id = $1`;
    const result = await pool.query(query, [id]);
    if(result.rowCount === 1) {
        return true;
    } else {
        return false;
    }
}

export const groupPolicyServer = {
    getAll,
    getById,
    createGroupPolicy,
    updateGroupPolicy,
    deleteGroupPolicy
}