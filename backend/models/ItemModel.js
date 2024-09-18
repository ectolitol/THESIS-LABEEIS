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
  image: {
    type: String, // Store image URL or path
    default: '' // Optional: set a default value or leave it blank
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', 
    required: true 
  },
  brand: {
    type: String,
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
  condition: {
    type: String,
    enum: ['New', 'Excellent', 'Good', 'Fair', 'Poor', 'Defective', 'Missing'],
    default: '',
    required: true 
  },
  location: { 
    type: String,
    required: true  
  },
  calibrationNeeded: {
    type: String,
    enum: ['Yes', 'No'], 
    default: '',
    required: true
  },
  calibrationDueDate: {
    type: Date,
  },
  calibrationStatus: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Overdue'],

  },
  calibrationFrequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually', 'Other'],
  },
  notesComments: {
    type: String,
  }
}, { 
  timestamps: true, // Add timestamps option here
});

module.exports = mongoose.model('Item', ItemSchema);
