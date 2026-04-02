const pool = require('../db/connection');

class Application {
    static async findAllActive() {
        const [rows] = await pool.execute(
            'SELECT * FROM legs_applications WHERE is_active = 1 ORDER BY app_name ASC'
        );
        return rows;
    }

    static async findAll() {
        const [rows] = await pool.execute(
            'SELECT * FROM legs_applications WHERE is_active = 1 ORDER BY app_name ASC'
        );
        return rows;
    }

    static async create(data) {
        const { app_name, category, description, target_url, is_active, is_login_from_legs } = data;
        const [result] = await pool.execute(
            'INSERT INTO legs_applications (app_name, category, description, target_url, is_active, is_login_from_legs) VALUES (?, ?, ?, ?, ?, ?)',
            [app_name, category || 'Web App', description || null, target_url, is_active !== undefined ? is_active : 1, is_login_from_legs ? 1 : 0]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const { app_name, category, description, target_url, is_active, is_login_from_legs } = data;
        const [result] = await pool.execute(
            'UPDATE legs_applications SET app_name = ?, category = ?, description = ?, target_url = ?, is_active = ?, is_login_from_legs = ? WHERE id = ?',
            [app_name, category, description || null, target_url, is_active, is_login_from_legs ? 1 : 0, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await pool.execute('UPDATE legs_applications SET is_active = 0 WHERE id = ?', [id]);
        return result.affectedRows;
    }
}
module.exports = Application;