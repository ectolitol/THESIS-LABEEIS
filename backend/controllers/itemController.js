const Item = require('../models/ItemModel');
const Category = require('../models/CategoryModel');
const { createNotification } = require('../utils/notificationService');
const mongoose = require('mongoose');

const LOW_STOCK_THRESHOLD = 2;
const OUT_OF_STOCK_THRESHOLD = 0;

// Create new item
exports.createItem = async (req, res) => {
  try {
    const file = req.file || null;
    const imagePath = file ? `/uploads/${file.filename}` : '';

    const { itemName, quantity, category, categoryName, newCategory } = req.body;

    if (!itemName || !quantity) {
      return res.status(400).json({ error: 'Item name and quantity are required.' });
    }

    let categoryDoc;

    // Priority: Check for category ID, new category, then category name
    if (category && mongoose.isValidObjectId(category.trim())) {
      categoryDoc = await Category.findById(category.trim());
      if (!categoryDoc) {
        return res.status(400).json({ error: 'Invalid category ID.' });
      }
    } else if (newCategory && newCategory.trim() !== '') {
      // Create new category if provided
      categoryDoc = await Category.findOne({ categoryName: newCategory.trim() });
      if (!categoryDoc) {
        categoryDoc = new Category({ categoryName: newCategory.trim() });
        await categoryDoc.save();
      }
    } else if (categoryName && categoryName.trim() !== '') {
      // Check for existing category by name
      categoryDoc = await Category.findOne({ categoryName: categoryName.trim() });
      if (!categoryDoc) {
        return res.status(400).json({ error: 'Invalid category name provided.' });
      }
    } else {
      return res.status(400).json({ error: 'Category is required.' });
    }

    // Create new item
    const newItem = new Item({
      ...req.body,
      category: categoryDoc ? categoryDoc._id : null,
      image: imagePath,
    });

    await newItem.save();

    // Increment category item count
    if (categoryDoc) {
      await Category.findByIdAndUpdate(categoryDoc._id, { $inc: { itemCount: 1 } });
    }

    // Notifications for stock levels
    if (newItem.quantity <= LOW_STOCK_THRESHOLD && newItem.quantity > OUT_OF_STOCK_THRESHOLD) {
      await createNotification('Low Stock', `Item ${newItem.itemName} has low stock.`);
    } else if (newItem.quantity <= OUT_OF_STOCK_THRESHOLD) {
      await createNotification('Out of Stock', `Item ${newItem.itemName} is out of stock.`);
    }

    // Notify admin of new item
    await createNotification('New Item Added', `A new item has been added: ${newItem.itemName}.`);

    res.status(201).json({ message: "Item created successfully", newItem });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: err.message });
  }
};
//----------------------------------------------------------------
// Update item details
exports.updateItem = async (req, res) => {
  try {
    const file = req.file || null;
    const imagePath = file ? `/uploads/${file.filename}` : '';

    // Find the item by ID
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const oldCategoryId = item.category;
    const { category, newCategory, categoryName, quantity } = req.body;

    let categoryDoc;

    // Category update logic
    if (mongoose.isValidObjectId(category)) {
      // If `category` is a valid ObjectId, find the category document
      categoryDoc = await Category.findById(category);
      if (!categoryDoc) {
        return res.status(400).json({ error: 'Invalid category ID.' });
      }
    } else if (newCategory && newCategory.trim() !== '') {
      // Create a new category if `newCategory` is provided
      categoryDoc = await Category.findOne({ categoryName: newCategory.trim() });
      if (!categoryDoc) {
        categoryDoc = new Category({ categoryName: newCategory.trim() });
        await categoryDoc.save();
      }
    } else if (categoryName && categoryName.trim() !== '') {
      // Check for existing category by name if `categoryName` is provided
      categoryDoc = await Category.findOne({ categoryName: categoryName.trim() });
      if (!categoryDoc) {
        return res.status(400).json({ error: 'Invalid category name provided.' });
      }
    }

    // Update item details
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        category: categoryDoc ? categoryDoc._id : oldCategoryId,
        image: imagePath || item.image,
      },
      { new: true }
    ).populate('category'); // Populate the category field

    // Adjust category counts if the category has changed
    if (oldCategoryId && oldCategoryId.toString() !== updatedItem.category.toString()) {
      await Category.findByIdAndUpdate(oldCategoryId, { $inc: { itemCount: -1 } });
      await Category.findByIdAndUpdate(updatedItem.category, { $inc: { itemCount: 1 } });
    }

    // Update quantity and trigger notifications
    const newQuantity = updatedItem.quantity;
    if (newQuantity !== undefined) {
      if (newQuantity <= OUT_OF_STOCK_THRESHOLD) {
        await createNotification('Out of Stock', `Item ${updatedItem.itemName} is out of stock.`);
      } else if (newQuantity <= LOW_STOCK_THRESHOLD) {
        await createNotification('Low Stock', `Item ${updatedItem.itemName} has low stock.`);
      }
    }

    res.status(200).json({ message: 'Item updated successfully', updatedItem });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: error.message });
  }
};

//----------------------------------------------------------
// Get all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find().populate('category', 'categoryName');
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single item by ID
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('category');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get items by category
exports.getItemsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    if (!mongoose.isValidObjectId(categoryId)) {
      return res.status(400).json({ message: 'Invalid category ID format' });
    }

    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const itemsByCategory = await Item.find({ category: categoryId }).populate('category');
    if (!itemsByCategory || itemsByCategory.length === 0) {
      return res.status(404).json({ message: 'No items found for this category' });
    }

    res.status(200).json(itemsByCategory);
  } catch (err) {
    console.error('Error fetching items by category:', err.message);
    res.status(500).json({ error: 'An error occurred while fetching items' });
  }
};

// Delete an item
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const categoryId = item.category;
    await Item.findByIdAndDelete(req.params.id);

    await Category.findByIdAndUpdate(categoryId, { $inc: { itemCount: -1 } });
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get item by barcode
exports.getItemByBarcode = async (req, res) => {
  try {
    const { itemBarcode } = req.params;
    if (!itemBarcode) {
      return res.status(400).json({ message: 'Item barcode is required' });
    }

    const item = await Item.findOne({ itemBarcode });
    if (!item) return res.status(404).json({ message: 'Item not found' });

    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get low stock items
exports.getLowStockItems = async (req, res) => {
  try {
    const lowStockItems = await Item.find({ 
      quantity: { $gt: OUT_OF_STOCK_THRESHOLD, $lte: LOW_STOCK_THRESHOLD } 
    });
    res.status(200).json(lowStockItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get out-of-stock items
exports.getOutOfStockItems = async (req, res) => {
  try {
    const outOfStockItems = await Item.find({ quantity: { $lte: OUT_OF_STOCK_THRESHOLD } });
    res.status(200).json(outOfStockItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
