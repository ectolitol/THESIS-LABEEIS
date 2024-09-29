const express = require('express');
const router = express.Router();
const borrowReturnController = require('../controllers/borrowReturnController');

// Borrow/Return routes
router.post('/log', borrowReturnController.logTransaction);
router.get('/', borrowReturnController.getTransactionLogs);
router.get('/:id', borrowReturnController.getLogById);
router.get('/br/aggregated-transactions', borrowReturnController.getAggregatedTransactionData);
router.put('/:id', borrowReturnController.updateLog);
router.delete('/:id', borrowReturnController.deleteLog);

router.put('/:id/extend', borrowReturnController.extendBorrowingDuration);

router.post('/complete-return', borrowReturnController.completeReturn);


module.exports = router;
