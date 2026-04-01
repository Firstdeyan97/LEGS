const User = require('../models/user');
const { hashPassword } = require('../utils/hashUtil');
const { success } = require('../utils/response');

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll();
        return success(res, 'Data pengguna berhasil dimuat.', users);
    } catch (error) { next(error); }
};

const createUser = async (req, res, next) => {
    try {
        const { username, password, role } = req.body;
        if (!username || !password) throw { statusCode: 400, message: 'Username dan Password wajib diisi.' };
        
        // Cek duplikat username
        const existing = await User.findByUsername(username);
        if (existing) throw { statusCode: 400, message: 'Username sudah digunakan.' };

        const hashedPassword = await hashPassword(password);
        await User.create({ username, password_hash: hashedPassword, role: role || 'user', created_by: req.user.username });
        return success(res, 'Pengguna baru berhasil ditambahkan.', null, 201);
    } catch (error) { next(error); }
};

const updateUserRole = async (req, res, next) => {
    try {
        const { role, is_active } = req.body;
        await User.updateStatusAndRole(req.params.id, role, is_active);
        return success(res, 'Hak akses pengguna berhasil diperbarui.');
    } catch (error) { next(error); }
};

const resetPassword = async (req, res, next) => {
    try {
        // Password default jika di-reset admin
        const defaultPassword = 'UTLibrary2026!';
        const hashedPassword = await hashPassword(defaultPassword);
        await User.resetPassword(req.params.id, hashedPassword);
        return success(res, `Password berhasil direset menjadi: ${defaultPassword}`);
    } catch (error) { next(error); }
};

const deleteUser = async (req, res, next) => {
    try {
        await User.delete(req.params.id);
        return success(res, 'Pengguna berhasil dihapus.');
    } catch (error) { next(error); }
};

module.exports = { getAllUsers, createUser, updateUserRole, resetPassword, deleteUser };