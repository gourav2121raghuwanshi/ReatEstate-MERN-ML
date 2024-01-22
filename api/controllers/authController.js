// authController.js
const User = require('../models/user.model.js')
const bcrypt = require('bcrypt');
require('dotenv').config();
const { errorHandler } = require('../utils/error.js');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
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
        next(err);
    }
};

exports.signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const validUser = await User.findOne({ email });

        if (!validUser) {
            return next(errorHandler(404, "User Not Found!"));
        }

        const hashedPassword = validUser.password;
        const validPassword = await bcrypt.compare(password, hashedPassword);
        if (!validPassword) {
            return next(errorHandler(401, "Wrong Credentials"));
        }

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        validUser.password = ''
        res.
            cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) }).
            status(200).
            json({
                success: true,
                message: "User logged in successfully",
                curretUser: validUser,

            });
    } catch (err) {
        console.error(`Error in signin: ${err.message}`);
        next(err);
    }
};

exports.google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = user._doc;
            res.
                cookie('access_token', token, { httpOnly: true })
                .status(200).json(rest);

        } else {
            const generatePassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(generatePassword, 10);
            const user = await User.create({ username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4), email: req.body.email, password: hashedPassword, avatar: req.body.photo });
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = user._doc;

            res.
                cookie('access_token', token, { httpOnly: true })
                .status(200).json(rest);

        }
    } catch (err) {
        next(err);
    }
}

exports.signout = async (req, res,next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json('user has been logged out !');
    }  
    catch (err) {
        next(err);
    }
}