const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

// Import routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const itemRoutes = require('./routes/itemRoutes');
const borrowReturnRoutes = require('./routes/borrowReturnRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const surveyQuestionRoutes = require('./routes/surveyQuestionRoutes');
const reportRoutes = require('./routes/reportRoutes');


// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const authMiddleware = require('./middleware/authMiddleware');
const roleMiddleware = require('./middleware/roleMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');
const bodyParser = require('body-parser');

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/borrow-return', borrowReturnRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/survey-questions', surveyQuestionRoutes);
app.use('/api/reports', reportRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// const now = new Date();
// console.log(now.toString());

module.exports = app; // Export the app instance
