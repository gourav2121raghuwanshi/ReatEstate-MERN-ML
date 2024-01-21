const express = require('express');
const router = express.Router();
const { updateUser } = require('../controllers/userController'); // Import the correct function
const {verifyToken} = require('../utils/verifyUser')
router.post('/update/:id',verifyToken, updateUser);

module.exports = router;