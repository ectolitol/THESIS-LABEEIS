const BorrowReturnLog = require('../models/BorrowReturnLogModel');
const { createNotification } = require('../utils/notificationService');
const { sendSMS } = require('../utils/smsService'); // Ensure you import your SMS utility

exports.checkOverdueItems = async () => {
    try {
        // console.log("Starting overdue items check...");

        // Get all pending or extended transactions that may be overdue
        const overdueLogs = await BorrowReturnLog.find({
            returnStatus: { $in: ['Pending', 'Extended', 'Partially Returned'] }
        });

        // console.log(`Found ${overdueLogs.length} logs to check for overdue status.`);

        const currentTime = new Date().getTime();
        // console.log(`Current time: ${new Date(currentTime).toLocaleString()}`);

        for (const log of overdueLogs) {
            const dueDate = new Date(log.dueDate).getTime();
            // console.log(`Checking log ID: ${log._id}`);
            console.log(`Borrower: ${log.userName}, Due Date: ${new Date(dueDate).toLocaleString()}`);

            // Check if the current time is beyond the due date
            if (currentTime > dueDate) {
                console.log(`Log ID: ${log._id} is overdue. Marking as overdue...`);

                // Update the return status to overdue
                log.returnStatus = 'Overdue';
                await log.save();

                console.log(`Log ID: ${log._id} has been updated to Overdue.`);

                // Notify admin
                await createNotification(
                    'Overdue Item',
                    `The item(s) borrowed by ${log.userName} are overdue.`,
                    log.userID
                );

                console.log(`Notification sent for log ID: ${log._id}`);

                // Send SMS to user informing them of the overdue status
                const smsMessage = `Hi ${log.userName}, your borrowed item(s) are overdue. Please return them as soon as possible. Thank you!`;
                await sendSMS(log.contactNumber, smsMessage);

                console.log(`SMS sent to ${log.userName} (Contact: ${log.contactNumber}) regarding overdue items.`);
            } else {
                console.log(`Log ID: ${log._id} is not overdue. Skipping...`);
            }
        }

        // console.log('Overdue items check completed.');
    } catch (error) {
        console.error('Error checking overdue items:', error.message);
    }
};
