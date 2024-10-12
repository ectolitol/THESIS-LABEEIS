const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const itemController = require('../controllers/itemController');
const borrowReturnController = require('../controllers/borrowReturnController');

// Apply authMiddleware to protected routes
router.post('/create', upload.single('image'), itemController.createItem);
router.put('/:id', upload.single('image'), itemController.updateItem);
router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getItemById);
router.get('/category/:categoryId', itemController.getItemsByCategory);
router.get('/barcode/:itemBarcode', itemController.getItemByBarcode);
router.get('/items/low-stock', itemController.getLowStockItems);
router.get('/items/out-of-stock', itemController.getOutOfStockItems);
router.get('/barcode/:itemBarcode/transactions', borrowReturnController.getItemTransactions);
router.delete('/:id', itemController.deleteItem);

// Get the maintenance schedule for a specific item
router.get('/:itemId/schedule', itemController.getMaintenanceSchedule);

// Update maintenance status for a specific week
router.put('/:itemId/schedule/update', itemController.updateMaintenanceStatus);

module.exports = router;
