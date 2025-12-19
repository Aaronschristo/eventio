const config = require('../config');

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    const message = config.env === 'development' ? err.message : 'Internal Server Error';
    const status = err.status || 500;

    res.status(status).json({
        error: {
            message,
            ...(config.env === 'development' && { stack: err.stack })
        }
    });
};

module.exports = errorHandler;
