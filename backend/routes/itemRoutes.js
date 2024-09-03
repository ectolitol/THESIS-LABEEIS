const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// Item routes
router.post('/create', itemController.createItem);
router.get('/', itemController.getAllItems);
router.get('/:id', itemController.getItemById);
router.get('/category/:categoryId', itemController.getItemsByCategory);
router.get('/barcode/:itemBarcode', itemController.getItemByBarcode);
router.put('/:id', itemController.updateItem);
router.delete('/:id', itemController.deleteItem);

module.exports = router;
