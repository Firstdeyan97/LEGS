const authService = require('../services/authService');
const { success } = require('../utils/response');

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            throw { statusCode: 400, message: 'Username dan kata sandi wajib diisi.' };
        }

        const data = await authService.login(username, password);
        
        res.cookie('jwt_token', data.token, {
            httpOnly: true,  // Wajib True agar aman dari XSS
            secure: false,   // Wajib False karena IP 172.30.14.94 tidak menggunakan HTTPS
            sameSite: 'Lax', // Konfigurasi optimal untuk koneksi HTTP internal
            maxAge: 8 * 60 * 60 * 1000 // 8 Jam
        });

        return success(res, 'Login berhasil.', { user: data.user });
    } catch (error) { next(error); }
};

const logout = (req, res) => {
    res.clearCookie('jwt_token');
    return success(res, 'Sesi berhasil diakhiri.');
};

const verifySession = (req, res) => {
    return success(res, 'Sesi valid terverifikasi.', { user: req.user });
};

module.exports = { login, logout, verifySession };