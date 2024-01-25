const errorHandler = require('../utils/error.js')
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
        return res.status(201).json("Listing deleted SuccessFully");
    } catch (err) {
        console.log(err)
        next(err);
    }
}

// exports.updateListing = async (req, res, next) => {
//     try {
//         const listing = await Listing.findById(req.params.id);

//         if (!listing) {
//             return next(errorHandler(404, "Listing Not Found"));
//         }
//         if (req.user.id !== listing.userRef) {
//             return next(errorHandler(401, "You can only Update Your own listing "));
//         }

//         const updatedListing = await Listing.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true });

//         return res.status(200).json("Listing Update SuccessFully").json(updatedListing);
//     } catch (err) {
//         console.log(err)
//         next(err);
//     }
// }
exports.updateListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return next(errorHandler(404, "Listing Not Found"));
        }
        if (req.user.id !== listing.userRef) {
            return next(errorHandler(401, "You can only Update Your own listing "));
        }

        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        return res.status(200).json( updatedListing );
    } catch (err) {
        console.log(err);
        next(err);
    }
};

exports.getListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ error: "No listing found for the given ID" });
        }

      return  res.status(200).json(listing);

    } catch (err) {
        console.error(err);
        next(err);
    }
};
