const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const itemController = require('../controllers/itemController');
const borrowReturnController = require('../controllers/borrowReturnController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authMiddleware to protected routes
router.post('/create', authMiddleware, upload.single('image'), itemController.createItem);
router.put('/:id', authMiddleware, upload.single('image'), itemController.updateItem);
router.get('/', authMiddleware, itemController.getAllItems);
router.get('/:id', authMiddleware, itemController.getItemById);
router.get('/category/:categoryId', authMiddleware, itemController.getItemsByCategory);
router.get('/barcode/:itemBarcode', itemController.getItemByBarcode);
router.get('/items/low-stock', authMiddleware, itemController.getLowStockItems);
router.get('/items/out-of-stock', authMiddleware, itemController.getOutOfStockItems);
router.get('/barcode/:itemBarcode/transactions', authMiddleware, borrowReturnController.getItemTransactions);
router.delete('/:id', authMiddleware, itemController.deleteItem);

// Get the maintenance schedule for a specific item
router.get('/:itemId/schedule', authMiddleware, itemController.getMaintenanceSchedule);

// Update maintenance status for a specific week
router.put('/:itemId/schedule/update', authMiddleware, itemController.updateMaintenanceStatus);

module.exports = router;
