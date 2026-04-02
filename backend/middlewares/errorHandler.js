const logger = require('../utils/logger');
const { error } = require('../utils/response');

const errorHandler = (err, req, res, next) => { 
    const errName = err.name || 'CustomError';
    const stack = err.stack || 'No stack trace provided';
    
    logger.error(`${errName}: ${err.message}\nStack: ${stack}`);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    return error(res, message, err.details || null, statusCode);
};

module.exports = errorHandler;