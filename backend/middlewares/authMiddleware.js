const { verifyToken } = require('../utils/jwtUtil');
const { error } = require('../utils/response');

const authenticate = (req, res, next) => {
    try {
        const token = req.cookies.jwt_token;
        
        if (!token) {
            return error(res, 'Akses ditolak. Sesi tidak ditemukan.', null, 401);
        }

        const decoded = verifyToken(token);
        req.user = decoded; 
        next();
    } catch (err) {
        return error(res, 'Sesi tidak valid atau telah berakhir.', null, 401);
    }
};

module.exports = authenticate;