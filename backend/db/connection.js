require('dotenv').config();
const mysql = require('mysql2/promise');
const logger = require('../utils/logger'); // Menggunakan logger elegan bawaan kita

// Membuat Connection Pool yang efisien
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Fungsi kritis untuk mengecek database saat server pertama kali menyala
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        logger.info('✅ Berhasil terhubung ke database MySQL (LEGS)');
        connection.release();
    } catch (error) {
        logger.error(`❌ Gagal terhubung ke database: ${error.message}`);
        // Jika gagal konek DB, matikan sistem. Jangan biarkan aplikasi jalan dalam keadaan cacat.
        process.exit(1); 
    }
};

testConnection();

module.exports = pool;