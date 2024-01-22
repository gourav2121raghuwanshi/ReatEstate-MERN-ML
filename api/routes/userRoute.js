const express = require('express');
const router = express.Router();
const {updateUser,deleteUser } = require('../controllers/userController'); // Import the correct function
const {verifyToken} = require('../utils/verifyUser')
router.post('/update/:id',verifyToken, updateUser);
router.delete('/delete/:id',verifyToken, deleteUser);

module.exports = router;