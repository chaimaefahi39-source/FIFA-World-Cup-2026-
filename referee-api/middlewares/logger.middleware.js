const loggerMiddleware = (req, res, next) => {
    const timestamp = new Date().toIsSOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
};
module.exports = loggerMiddleware;