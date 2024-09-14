const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { generateQRCode, createPDFWithQRCode } = require('../utils/pdfService'); // Updated import
require('dotenv').config();


// Set up the transporter with Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Notify Admin about a new user registration
exports.sendAdminNotification = async (user) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: 'New User Registration Awaiting Approval',
            text: `A new user has registered: ${user.fullName}. Please review and approve their registration.`
        };

        await transporter.sendMail(mailOptions);
        console.log('Admin notification sent successfully');
    } catch (error) {
        console.error('Error sending admin notification:', error);
        throw error;
    }
};

// Send confirmation email with PDF attachment after approval
exports.sendUserConfirmation = async (user, pdfFilePath) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Registration Approved',
            text: `Your registration has been approved. Please find your QR code attached.`,
            attachments: [
                {
                    filename: 'user-info.pdf',
                    path: pdfFilePath
                }
            ]
        };

        await transporter.sendMail(mailOptions);

        // Clean up the file after sending
        fs.unlinkSync(pdfFilePath);

        console.log('Confirmation email sent successfully');
    } catch (error) {
        console.error('Error sending user confirmation:', error);
        throw error;
    }
};

// Send decline email with reason for rejection
exports.sendUserDeclineEmail = async (user, notesComments) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Registration Declined',
            text: `We regret to inform you that your registration has been declined for the following reason:\n\n${notesComments}\n\nIf you have any questions, please feel free to contact us.`
        };

        await transporter.sendMail(mailOptions);

        console.log('Decline email sent successfully');
    } catch (error) {
        console.error('Error sending decline email:', error);
        throw error;
    }
};
