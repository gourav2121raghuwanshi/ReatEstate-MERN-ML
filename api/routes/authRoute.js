// authRoute.js
const express = require('express');
const router = express.Router();
const { signup } = require('../controllers/authController.js');

router.post('/signup', signup);

module.exports = router;