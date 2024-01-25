const express = require('express');
const router = express.Router();
const {updateUser,deleteUser,getUserListing ,getUser} = require('../controllers/userController'); // Import the correct function
const {verifyToken} = require('../utils/verifyUser')
router.post('/update/:id',verifyToken, updateUser);
router.delete('/delete/:id',verifyToken, deleteUser);
router.get('/listings/:id',verifyToken, getUserListing);
router.get('/:id',verifyToken, getUser); // landlord details route

module.exports = router;