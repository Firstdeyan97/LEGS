const pool = require('../db/connection');

class Application {
    // Dipakai di Landing Page (Hanya yang aktif)
    static async findAllActive() {
        const [rows] = await pool.execute(
            'SELECT id, app_name, description, target_url FROM legs_applications WHERE is_active = 1 ORDER BY app_name ASC'
        );
        return rows;
    }

    // Dipakai di Tabel Admin (Tampilkan semua, termasuk yang non-aktif)
    static async findAll() {
        const [rows] = await pool.execute(
            'SELECT * FROM legs_applications ORDER BY created_at DESC'
        );
        return rows;
    }

    // Tambah Aplikasi Baru
    static async create(data) {
        const { app_name, description, target_url, is_active } = data;
        const [result] = await pool.execute(
            'INSERT INTO legs_applications (app_name, description, target_url, is_active) VALUES (?, ?, ?, ?)',
            [app_name, description || null, target_url, is_active !== undefined ? is_active : 1]
        );
        return result.insertId;
    }

    // Edit Aplikasi
    static async update(id, data) {
        const { app_name, description, target_url, is_active } = data;
        const [result] = await pool.execute(
            'UPDATE legs_applications SET app_name = ?, description = ?, target_url = ?, is_active = ? WHERE id = ?',
            [app_name, description || null, target_url, is_active, id]
        );
        return result.affectedRows; // Mengembalikan 1 jika sukses
    }

    // Hapus Aplikasi Permanen
    static async delete(id) {
        const [result] = await pool.execute('DELETE FROM legs_applications WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = Application;