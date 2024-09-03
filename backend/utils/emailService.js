const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { generateQRCode, createPDFWithQRCode } = require('../utils/pdfService'); // Updated import

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendAdminNotification = async (user) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: 'New User Registration Awaiting Approval',
        text: `A new user has registered: ${user.fullName}. Please review and approve their registration.`
    };

    await transporter.sendMail(mailOptions);
};

// Send confirmation email with PDF attachment
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

        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending user confirmation:', error);
        throw error;
    }
};