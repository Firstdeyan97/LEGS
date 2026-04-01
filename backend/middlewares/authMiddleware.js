const { verifyToken } = require('../utils/jwtUtil');
const { error } = require('../utils/response');

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        // Cek apakah ada Karcis di dalam header
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return error(res, 'Akses ditolak. Token tidak ditemukan.', null, 401);
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        
        // Simpan data user (ID, username, role) ke request untuk dipakai di fungsi selanjutnya
        req.user = decoded; 
        next();
    } catch (err) {
        return error(res, 'Sesi tidak valid atau telah berakhir.', null, 401);
    }
};

module.exports = authenticate;