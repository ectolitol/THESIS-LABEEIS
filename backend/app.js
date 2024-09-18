const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const path = require('path');
const upload = require('./utils/upload'); 

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(express.json()); // Only include once
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/items', require('./routes/itemRoutes'));
app.use('/api/borrow-return', require('./routes/borrowReturnRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/survey-questions', require('./routes/surveyQuestionRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// File Upload Route
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  res.status(200).json({ filePath: `/uploads/${req.file.filename}` });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app; // Export the app instance
