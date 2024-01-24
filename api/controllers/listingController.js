const errorHandler = require("../utils/error.js")
const Listing = require('../models/listingModel.js')

exports.createListing = async (req, res, next) => {
    try {
        console.log("inside listing ", req.body);
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (err) {
        console.log(err)
        next(err);
    }
}

exports.deleteListing = async (req, res, next) => {
    try {
        // console.log("inside listing ", req.body);
        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return next(errorHandler(404, "Listing Not Found"));
        }
        if (req.user.id !== listing.userRef) {
            return next(errorHandler(401, "You can only delete Your own listing "));
        }

        await Listing.findByIdAndDelete(req.params.id);
        return res.status(201).json("Listing deleted Success Fully");
    } catch (err) {
        console.log(err)
        next(err);
    }
}
