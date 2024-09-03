const mongoose = require('mongoose');

// Custom function to generate barcode starting with "BC" followed by a numeric code
function generateBarcode() {
  const randomNumber = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit random number
  return `BC${randomNumber}`;
}

const ItemSchema = new mongoose.Schema({
  itemBarcode: { 
    type: String, 
    unique: true, 
    default: generateBarcode 
  },
  itemName: { 
    type: String, 
    unique: true, 
    required: true 
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  model: { 
    type: String 
  },
  description: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  location: { 
    type: String 
  }
});

module.exports = mongoose.model('Item', ItemSchema);
