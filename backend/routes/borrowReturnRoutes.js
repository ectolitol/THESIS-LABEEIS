const express = require('express');
const router = express.Router();
const borrowReturnController = require('../controllers/borrowReturnController');

// Borrow/Return routes
router.post('/log', borrowReturnController.logTransaction);
router.get('/', borrowReturnController.getTransactionLogs);
router.get('/:id', borrowReturnController.getLogById);
router.put('/:id', borrowReturnController.updateLog);
router.delete('/:id', borrowReturnController.deleteLog);

module.exports = router;
