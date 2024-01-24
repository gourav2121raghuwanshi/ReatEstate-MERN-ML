// const { errorHandler } = require("./error.js");
// const jwt = require('jsonwebtoken')
// exports.verifyToken = async (req, res, next) => {

//   const token =  req.cookies.access_token ||  req.body.access_token  || req.header("Authorization").replace("Bearer ", "");
//     // const token = req.cookies.access_token;
//     console.log(token)
//     if (!token) {
//         return next(errorHandler(401, "Unauthorized : token is empty or incorrect "));
//     }
// const ans =    await jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) return next(errorHandler(403, `forbiden ${err}`));
//         req.user = user;
//         next();
//     });

// }

const { errorHandler } = require("./error.js");
const jwt = require('jsonwebtoken');

exports.verifyToken = async (req, res, next) => {
    const token = req.cookies.access_token;
    console.log(token);

    if (!token) {
        return next(errorHandler(401, "Unauthorized: Token is empty or incorrect"));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(errorHandler(403, `Forbidden: ${err}`));

        req.user = user;
        next();
    });
};


// const decode = await jwt.verify(token, process.env.JWT_SECRET);
// // step4: Console log the decoded token
// console.log(decode);
// req.user = decode;

// next(); 