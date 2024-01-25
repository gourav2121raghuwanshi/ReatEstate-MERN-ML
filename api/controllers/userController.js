const { errorHandler } = require("../utils/error.js");
const bcrypt = require('bcrypt');
const User = require('../models/userModel.js');
const Listing = require('../models/listingModel.js')
exports.updateUser = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) return next(errorHandler(401, "You Can Only Update Your Own Account"));
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
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
        // console.log("done");
        res.status(200).json(rest)
    } catch (err) {
        // console.log(err)
        next(err);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        console.log(req.user.id)
        console.log(req.params.id)
        if (req.user.id !== req.params.id) {
            return next(errorHandler(401, `You Can Delete Your own account `));
        }
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token')
        res.status(200)
            .json('User Has been Deleted ')


    } catch (err) {
        next(err);
    }
};

exports.getUserListing = async (req, res, next) => {
    try {
        if (req.user.id === req.params.id) {
            const listings = await Listing.find({ userRef: req.params.id });
            res.status(200).json(listings);
        } else {
            console.log("Error in viewing Listings");
            return next(errorHandler(401, "You can view your own Listings"));
        }
    } catch (err) {
        console.log(err);
        next(err)
    }
}

exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(errorHandler(404, "User Not Found!"))
        }
        const { password: pass, ...rest } = user._doc;
        return res.status(200).json(rest);
    } catch (err) {
        console.log(err);
        next(err)
    }
}