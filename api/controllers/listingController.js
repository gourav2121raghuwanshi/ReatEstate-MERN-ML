const errorHandler = require('../utils/error.js')
const Listing = require('../models/listingModel.js')

exports.createListing = async (req, res, next) => {
    try {
        console.log("inside listing ",req.body);
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (err) {
        console.log(err)
     next(err);
    }
}