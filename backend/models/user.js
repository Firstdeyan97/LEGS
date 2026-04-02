const pool = require('../db/connection');

class User {
    static async findByUsername(username) {
        const [rows] = await pool.execute('SELECT * FROM core_users WHERE username = ? AND is_active = 1', [username]);
        return rows[0]; 
    }

    static async findAll() {
        const [rows] = await pool.execute('SELECT id, id_pegawai, username, role, is_active, created_at FROM core_users WHERE is_active = 1 ORDER BY created_at DESC');
        return rows;
    }

    static async create(data) {
        const { id_pegawai, username, password_hash, role, created_by } = data;
        const [result] = await pool.execute(
            `INSERT INTO core_users (id_pegawai, username, password_hash, role, created_by) VALUES (?, ?, ?, ?, ?)`,
            [id_pegawai || null, username, password_hash, role || 'user', created_by || 'system']
        );
        return result.insertId;
    }

    static async updateStatusAndRole(id, role, is_active) {
        const [result] = await pool.execute('UPDATE core_users SET role = ?, is_active = ? WHERE id = ?', [role, is_active, id]);
        return result.affectedRows;
    }

    static async resetPassword(id, newHash) {
        const [result] = await pool.execute('UPDATE core_users SET password_hash = ? WHERE id = ?', [newHash, id]);
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await pool.execute('UPDATE core_users SET is_active = 0 WHERE id = ?', [id]);
        return result.affectedRows;
    }
}
module.exports = User;