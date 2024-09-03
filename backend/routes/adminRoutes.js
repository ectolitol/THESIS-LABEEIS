const express = require('express');
const { loginAdmin } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

// Admin login route (this route should not be protected by middleware)
router.post('/login', loginAdmin);

// Apply the authentication middleware to all routes below this line
router.use(authenticateToken);

// Example of a protected route
router.get('/dashboard', (req, res) => {
    res.send('Welcome to the Admin Dashboard');
});

module.exports = router;
