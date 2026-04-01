const authService = require('../services/authService');
const { success } = require('../utils/response');

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Validasi input kosong
        if (!username || !password) {
            throw { statusCode: 400, message: 'Username dan password wajib diisi.' };
        }

        // Eksekusi logika login di Service
        const data = await authService.login(username, password);

        // Jika berhasil, kembalikan response sukses
        return success(res, 'Login berhasil.', data);
    } catch (error) {
        // Jika gagal, lempar ke errorHandler global EXVAN
        next(error);
    }
};

module.exports = { login };