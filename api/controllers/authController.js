// authController.js
const User = require('../models/user.model.js')
const bcrypt = require('bcrypt');
const { errorHandler } = require('../utils/error.js');
exports.signup = async (req, res,next) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });

        res.status(201).json({
            success: true,
            data: user,
            message: "user created successfully"
        });
    } catch (err) {
        console.log(`error in signup ${err.message}`);
        next(error);
    }
};