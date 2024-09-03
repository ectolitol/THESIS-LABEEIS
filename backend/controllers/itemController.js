const Item = require('../models/ItemModel');
const Category = require('../models/CategoryModel');
const { createNotification } = require('../utils/notificationService');
const mongoose = require('mongoose');

// Create a new item
exports.createItem = async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();

    // Update category itemCount
    await Category.findByIdAndUpdate(
      newItem.category,
      { $inc: { itemCount: 1 } } // Increment itemCount by 1
    );

    // Check for low stock and notify admin
      if (newItem.quantity === 1) {
        await createNotification('Low Stock', `Item ${newItem.itemName} has low stock.`, null);
      }

    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all items
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find().populate('category');
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

    // Check if the categoryId is a valid ObjectId
    if (!mongoose.isValidObjectId(categoryId)) {
      return res.status(400).json({ message: 'Invalid category ID format' });
    }

    // Check if the category exists
    const categoryExists = await Category.findById(categoryId);

    if (!categoryExists) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Find items that belong to the specified category
    const itemsByCategory = await Item.find({ category: categoryId }).populate('category');

    if (!itemsByCategory.length) {
      return res.status(404).json({ message: 'No items found for this category' });
    }

    res.status(200).json(itemsByCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update item details
exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Store old category ID
    const oldCategoryId = item.category;

    // Update the item
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Update category itemCount
    // Adjust item count in category if the category is changed
    if (oldCategoryId.toString() !== updatedItem.category.toString()) {
      // Decrement itemCount in old category
      await Category.findByIdAndUpdate(
        oldCategoryId,
        { $inc: { itemCount: -1 } } // Decrement itemCount by 1
      );

      // Increment itemCount in new category
      await Category.findByIdAndUpdate(
        updatedItem.category,
        { $inc: { itemCount: 1 } } // Increment itemCount by 1
      );
    }

    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an item
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Store the category ID before deletion
    const categoryId = item.category;

    // Delete the item
    await Item.findByIdAndDelete(req.params.id);

    // Update category itemCount
    await Category.findByIdAndUpdate(
      categoryId,
      { $inc: { itemCount: -1 } } // Decrement itemCount by 1
    );

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get items by category
exports.getItemsByCategory = async (req, res) => {
  try {
    const itemsByCategory = await Item.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryDetails'
        }
      },
      {
        $unwind: '$categoryDetails'
      },
      {
        $group: {
          _id: '$categoryDetails.categoryName',
          items: {
            $push: {
              itemID: '$_id',
              itemName: '$itemName',
              model: '$model',
              description: '$description',
              quantity: '$quantity',
              barcode: '$itemBarcode',
              location: '$location'
            }
          }
        }
      }
    ]);

    res.status(200).json(itemsByCategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get items by category
exports.getItemsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    // Check if the categoryId is a valid ObjectId
    if (!mongoose.isValidObjectId(categoryId)) {
      return res.status(400).json({ message: 'Invalid category ID format' });
    }

    // Check if the category exists
    const categoryExists = await Category.findById(categoryId);

    if (!categoryExists) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Find items that belong to the specified category
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

// Get item by barcode
exports.getItemByBarcode = async (req, res) => {
  try {
    const { itemBarcode } = req.params;

    // Validate the itemBarcode
    if (!itemBarcode) {
      return res.status(400).json({ message: 'Item barcode is required' });
    }

    // Find item by barcode
    const item = await Item.findOne({ itemBarcode });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json(item);
  } catch (err) {
    console.error('Error fetching item by barcode:', err.message);
    res.status(500).json({ error: 'An error occurred while fetching the item' });
  }
};
