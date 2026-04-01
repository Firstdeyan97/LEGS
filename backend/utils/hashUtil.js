const bcrypt = require('bcrypt');
const saltRounds = 10; // Standar industri untuk keseimbangan keamanan & performa

const hashPassword = async (password) => {
    return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

module.exports = { hashPassword, comparePassword };