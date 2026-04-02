const User = require('../models/user');
const { comparePassword } = require('../utils/hashUtil');
const { generateToken } = require('../utils/jwtUtil');

const login = async (username, password) => {
    const user = await User.findByUsername(username);
    
    if (!user || user.username !== username) {
        throw { statusCode: 401, message: 'Username atau kata sandi yang Anda masukkan salah.' };
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
        throw { statusCode: 401, message: 'Username atau kata sandi yang Anda masukkan salah.' };
    }

    const payload = { id: user.id, username: user.username, role: user.role };
    const token = generateToken(payload);
    
    return { token, user: { id: user.id, username: user.username, role: user.role } };
};

module.exports = { login };