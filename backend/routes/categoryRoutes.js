const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Apply authMiddleware to protected routes
router.post('/create', categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
