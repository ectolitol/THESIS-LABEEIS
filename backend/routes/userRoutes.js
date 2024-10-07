const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const borrowReturnController = require('../controllers/borrowReturnController');
const authMiddleware = require('../middleware/authMiddleware');

// User routes
router.post('/create', userController.createUser); //no middleware
router.put('/approve/:userId', authMiddleware, userController.approveUser);
router.put('/decline/:userId', authMiddleware, userController.declineUser);
router.get('/', authMiddleware, userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.get('/:id/transactions', borrowReturnController.getUserTransactions);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);

router.get('/pending/awaiting-approval-count', userController.countAwaitingApprovalUsers);

module.exports = router;
