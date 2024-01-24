const express = require('express');
const router = express.Router();
const {verifyToken} = require('../utils/verifyUser.js')
const {createListing,deleteListing} = require('../controllers/listingController')
router.post('/create',verifyToken,createListing);
router.delete('/delete/:id',verifyToken,deleteListing);
module.exports = router;