const logger = require('../utils/logger'); // [NEW] Import logger
const { error } = require('../utils/response');

const errorHandler = (err, req, res, next) => { 
    logger.error(`${err.name}: ${err.message}\nStack: ${err.stack}`);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    return error(res, message, err.details || null, statusCode);
};

module.exports = errorHandler;