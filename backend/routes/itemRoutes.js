const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const borrowReturnController = require('../controllers/borrowReturnController');
const upload = require('../utils/upload'); // Import multer configuration

// Item routes with file upload support
router.post('/create', upload.single('image'), itemController.createItem);
router.put('/:id', upload.single('image'), itemController.updateItem);

// Other item routes
router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getItemById);
router.get('/category/:categoryId', itemController.getItemsByCategory);
router.get('/barcode/:itemBarcode', itemController.getItemByBarcode);
router.get('/items/low-stock', itemController.getLowStockItems);
router.get('/items/out-of-stock', itemController.getOutOfStockItems);
router.get('/barcode/:itemBarcode/transactions', borrowReturnController.getItemTransactions);
router.delete('/:id', itemController.deleteItem);

module.exports = router;
