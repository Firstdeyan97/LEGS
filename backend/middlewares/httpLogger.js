const morgan = require('morgan');
const logger = require('../utils/logger');

/**
 * Membelokkan output Morgan agar tidak menggunakan console.log,
 * melainkan menggunakan Winston logger level 'info'.
 */
const streamOptions = {
    write: (message) => logger.info(message.trim()),
};

// Format 'dev' menghasilkan log yang ringkas dan berwarna (Method, Endpoint, Status, Waktu).
// Untuk production yang lebih detail, bisa diganti menggunakan format 'combined'.
const format = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';

const httpLogger = morgan(format, { stream: streamOptions });

module.exports = httpLogger;