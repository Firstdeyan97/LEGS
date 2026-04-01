const { error } = require('../utils/response');
const logger = require('../utils/logger');

const requireRole = (role) => {
    return (req, res, next) => {
        // req.user didapat dari authMiddleware sebelumnya
        if (!req.user || req.user.role !== role) {
            logger.warn(`🛑 Pelanggaran Akses: User ${req.user?.username} mencoba mengakses rute khusus ${role}.`);
            return error(res, `Akses ditolak. Anda tidak memiliki hak akses sebagai ${role}.`, null, 403);
        }
        next();
    };
};

module.exports = requireRole;