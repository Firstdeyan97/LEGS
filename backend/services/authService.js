const User = require('../models/user');
const { comparePassword } = require('../utils/hashUtil');
const { generateToken } = require('../utils/jwtUtil');

const login = async (username, password) => {
    // 1. Cari user di database berdasarkan username
    const user = await User.findByUsername(username);
    if (!user) {
        // Kita lempar error dengan statusCode 401 (Unauthorized)
        throw { statusCode: 401, message: 'Username atau password salah.' };
    }

    // 2. Cocokkan password plaintext dari user dengan hash di database
    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
        throw { statusCode: 401, message: 'Username atau password salah.' };
    }

    // 3. Jika cocok, siapkan data untuk dibungkus ke dalam Token JWT
    const payload = {
        id: user.id,
        username: user.username,
        role: user.role
    };

    // 4. Generate Token
    const token = generateToken(payload);

    // 5. Kembalikan token dan data user (tanpa password) untuk dikonsumsi Frontend
    return {
        token,
        user: {
            id: user.id,
            username: user.username,
            role: user.role
        }
    };
};

module.exports = { login };