const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const borrowReturnController = require('../controllers/borrowReturnController');

// User routes
router.post('/create', userController.createUser);
router.put('/approve/:userId', userController.approveUser);
router.put('/decline/:userId', userController.declineUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.get('/:id/transactions', borrowReturnController.getUserTransactions);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
