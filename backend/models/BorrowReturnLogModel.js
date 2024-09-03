const mongoose = require('mongoose');

// Define the schema for each item log
const ItemLogSchema = new mongoose.Schema({
  itemBarcode: { type: String, required: true },
  itemName: { type: String, required: true },
  quantityBorrowed: { type: Number, default: 0 },
  quantityReturned: { type: Number, default: 0 },
  _id: false
});

// Define the schema for borrow/return logs
const BorrowReturnLogSchema = new mongoose.Schema({
  dateTime: { type: Date, default: Date.now },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  items: [ItemLogSchema], // Array of items being logged
  courseSubject: { type: String },
  professor: { type: String },
  roomNo: { type: String },
  borrowedDuration: { type: String },
  transactionType: { type: String, enum: ['Borrowed','Returned'], required: true },
  returnStatus: { type: String, enum: ['Pending', 'Completed', 'Overdue', 'Partially Returned'], default: 'Pending' },
  notesComments: { type: String }
});

// Create and export the model
module.exports = mongoose.model('BorrowReturnLog', BorrowReturnLogSchema);
