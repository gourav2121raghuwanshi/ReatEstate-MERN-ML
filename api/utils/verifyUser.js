const { errorHandler } = require("./error.js");
const jwt = require('jsonwebtoken')
exports.verifyToken = async (req, res, next) => {

    const token = req.cookies.access_token;
    console.log(token)
    if (!token) {
        return next(errorHandler(401, "Unauthorized"));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(errorHandler(403, "forbiden"));
        req.user = user;
        next();
    });
}