// utils/pdfUtils.js
const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

// Generate QR code function
const generateQRCode = async (data) => {
    try {
        const filePath = path.join(__dirname, '..', 'uploads', 'qr-code.png');
        await QRCode.toFile(filePath, data);
        return filePath;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw error;
    }
};

// Create PDF with QR code and text
const createPDFWithQRCode = async (qrCodeFilePath, userName, outputFilePath) => {
    try {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 800]);
        const { width, height } = page.getSize();

        // Read QR code image
        const qrCodeImage = fs.readFileSync(qrCodeFilePath);
        const qrCodeImageEmbed = await pdfDoc.embedPng(qrCodeImage);
        const qrCodeImageDims = qrCodeImageEmbed.scale(216 / qrCodeImageEmbed.width); // Scale to 216 points

       // Center the QR code horizontally
       const qrCodeX = width / 2 - qrCodeImageDims.width / 2;
       const qrCodeY = height / 2 - qrCodeImageDims.height / 2;

     // Define the spacing between the QR code and the text
        const spacing = 36; // 0.5 inch in points
        
// Add QR code to PDF
        page.drawImage(qrCodeImageEmbed, {
            x: qrCodeX,
            y: qrCodeY,
            width: qrCodeImageDims.width,
            height: qrCodeImageDims.height
        });
        
       // Add "LABEEIS" text above QR code
       const labeeisText = 'LABEEIS';
       const labeeisFontSize = 30;
       const labeeisTextWidth = labeeisText.length * labeeisFontSize * 0.6; // Estimate text width
       const labeeisX = width / 2 - labeeisTextWidth / 2;
       page.drawText(labeeisText, {
           x: labeeisX,
           y: qrCodeY + qrCodeImageDims.height + spacing,
           size: labeeisFontSize,
           color: rgb(0, 0, 0)
       });

       // Add userName text below QR code
       const userNameText = userName;
       const userNameFontSize = 20;
       const userNameTextWidth = userNameText.length * userNameFontSize * 0.6; // Estimate text width
       const userNameX = width / 2 - userNameTextWidth / 2;
       page.drawText(userNameText, {
           x: userNameX,
           y: qrCodeY - userNameFontSize - spacing, // Adjust for text height
           size: userNameFontSize,
           color: rgb(0, 0, 0)
       });

       const pdfBytes = await pdfDoc.save();
       fs.writeFileSync(outputFilePath, pdfBytes);

       console.log('PDF created successfully:', outputFilePath);
   } catch (error) {
       console.error('Error creating PDF:', error);
       throw error;
   }
};

module.exports = { generateQRCode, createPDFWithQRCode };
