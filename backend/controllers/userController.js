const User = require('../models/UserModel');
const { sendAdminNotification, sendUserConfirmation, sendUserDeclineEmail } = require('../utils/emailService');
const { generateQRCode, createPDFWithQRCode } = require('../utils/pdfService'); 
const { createNotification } = require('../utils/notificationService');
const path = require('path');
const fs = require('fs');

// Create a new user
exports.createUser = async (req, res) => {
    try {
        console.log('Received request body:', req.body); // Log the incoming request data

        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        console.log('User saved successfully:', savedUser); // Log the saved user

        // Notify admin for approval
        await sendAdminNotification(newUser);

        // Create a notification for the admin
        await createNotification('User Registration', `New user ${newUser.fullName} registered and awaiting approval.`, null);

        res.status(201).json({ message: 'Registration successful! Await admin approval.' });
    } catch (error) {
        res.status(400).json({ message: 'Error registering user', error: error.message });
    }
};

// Approve user function
exports.approveUser = async (req, res) => {
  try {
      const { userId } = req.params;

      // Update status to 'Approved'
      const user = await User.findByIdAndUpdate(userId, { status: 'Approved' }, { new: true });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const qrCodeFilePath = await generateQRCode(user._id.toString());
      const pdfFilePath = path.join(__dirname, '..', 'uploads', 'user-info.pdf');

      await createPDFWithQRCode(qrCodeFilePath, user.fullName, pdfFilePath);

      await sendUserConfirmation(user, pdfFilePath);

      // Create a notification for the admin
      await createNotification('User Registration Approved', `New user ${user.fullName} was approved.`, null);

      res.status(200).json({ message: 'User approved successfully', user });
  } catch (error) {
      console.error('Error approving user:', error);
      res.status(500).json({ message: 'Error approving user', error: error.message });
  }
};

// Decline user function
exports.declineUser = async (req, res) => {
  try {
      const { userId } = req.params;
      const { notesComments } = req.body; // Get comments from request body

      // Validate the input
      if (!notesComments) {
          return res.status(400).json({ message: 'Rejection reason is required' });
      }

      // Update status to 'Declined' and add comments
      const user = await User.findByIdAndUpdate(userId, { 
          status: 'Declined',
          notesComments
      }, { new: true });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Create a notification for the admin
      await createNotification('User Registration Declined', `User ${user.fullName} was declined.`, null);

      // Send decline email with the reason
      await sendUserDeclineEmail(user, notesComments);

      res.status(200).json({ message: 'User declined successfully', user });
  } catch (error) {
      console.error('Error declining user:', error);
      res.status(500).json({ message: 'Error declining user', error: error.message });
  }
};


// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve users', error: error.message });
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve user', error: error.message });
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
};

