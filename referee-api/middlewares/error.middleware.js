const errorMiddlewere = (err, req, res, next) => {
    console.error(err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || 
     
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message
    });
};
module.exports = errorMiddlewere;