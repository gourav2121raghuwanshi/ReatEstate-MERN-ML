const { errorHandler } = require("../utils/error");
const bcrypt = require('bcrypt');
const User = require('../models/user.model')
exports.updateUser = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) return next(errorHandler(401, "You Can Only Update Your Own Account"));
        if (req.body.password) {
            req.body.password = bcrypt.hash(req.body.password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, { new: true })
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest)
    } catch (err) {
        next(err);
    }
};