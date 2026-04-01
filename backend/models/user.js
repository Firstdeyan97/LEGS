const pool = require('../db/connection');

class User {
    static async findByUsername(username) {
        const [rows] = await pool.execute('SELECT * FROM core_users WHERE username = ? AND is_active = 1', [username]);
        return rows[0]; 
    }

    // [BARU] Ambil semua data user untuk Admin
    static async findAll() {
        const [rows] = await pool.execute('SELECT id, id_pegawai, username, role, is_active, created_at FROM core_users ORDER BY created_at DESC');
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

    // [BARU] Ganti hak akses (Role) & Status
    static async updateStatusAndRole(id, role, is_active) {
        const [result] = await pool.execute('UPDATE core_users SET role = ?, is_active = ? WHERE id = ?', [role, is_active, id]);
        return result.affectedRows;
    }

    // [BARU] Reset Password
    static async resetPassword(id, newHash) {
        const [result] = await pool.execute('UPDATE core_users SET password_hash = ? WHERE id = ?', [newHash, id]);
        return result.affectedRows;
    }

    // [BARU] Hapus Permanen
    static async delete(id) {
        const [result] = await pool.execute('DELETE FROM core_users WHERE id = ?', [id]);
        return result.affectedRows;
    }
}
module.exports = User;