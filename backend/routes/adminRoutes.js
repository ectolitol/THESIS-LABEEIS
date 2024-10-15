const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Login route
router.post('/login', adminController.login);

// Logout route (protected by auth middleware)
router.post('/logout', adminController.logout);


module.exports = router;
