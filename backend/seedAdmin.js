require('dotenv').config();
const User = require('./models/user');
const { hashPassword } = require('./utils/hashUtil');
const logger = require('./utils/logger');
const pool = require('./db/connection'); // Tetap di-import agar koneksi DB menyala

const seedAdmin = async () => {
    try {
        logger.info('⏳ Memulai proses injeksi akun Super Admin ke database...');

        // 1. Validasi: Cek apakah akun admin sudah pernah dibuat
        const usernameAdmin = 'admin_legs';
        const existingAdmin = await User.findByUsername(usernameAdmin);
        
        if (existingAdmin) {
            logger.warn('⚠️ Akun Super Admin sudah ada di database. Proses dibatalkan.');
            process.exit(0);
        }

        // 2. Persiapkan Kredensial (Password default sementara)
        const plainPassword = 'PasswordSuperKuat123!'; 
        logger.info('⏳ Sedang melakukan enkripsi bcrypt pada password...');
        const hashedPassword = await hashPassword(plainPassword);

        // 3. Eksekusi Insert ke Database melalui Model
        await User.create({
            id_pegawai: null, // Kosongkan dulu karena tabel core_pegawai belum ada datanya
            username: usernameAdmin,
            password_hash: hashedPassword,
            role: 'admin',
            created_by: 'system_seeder'
        });

        logger.info('✅ SUKSES! Akun Super Admin berhasil disuntikkan ke tabel core_users.');
        logger.info('=========================================');
        logger.info(`Username : ${usernameAdmin}`);
        logger.info(`Password : ${plainPassword}`);
        logger.info('=========================================');
        logger.info('Silakan catat kredensial di atas, lalu hapus file ini jika sudah masuk Production.');

    } catch (error) {
        logger.error(`❌ Gagal menyuntikkan admin: ${error.message}`);
    } finally {
        process.exit(0); // Matikan script dengan aman
    }
};

// Jalankan fungsi
seedAdmin();