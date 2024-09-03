const BorrowReturnLog = require('../models/BorrowReturnLogModel');
const { createNotification } = require('../utils/notificationService');

exports.checkOverdueItems = async () => {
    try {
        // Get all pending transactions that are overdue
        const overdueLogs = await BorrowReturnLog.find({ returnStatus: 'Pending' });

        const currentTime = new Date().getTime();

        for (const log of overdueLogs) {
            const durationInMillis = convertDurationToMillis(log.borrowedDuration);
            const borrowTime = new Date(log.dateTime).getTime();

            if (currentTime > borrowTime + durationInMillis) {
                // Update the return status to overdue
                log.returnStatus = 'Overdue';
                await log.save();

                // Notify admin
                await createNotification(
                    'Overdue Item',
                    `The item(s) borrowed by ${log.userName} are overdue.`,
                    log.userID
                );
            }
        }

        console.log('Overdue items check completed.');
    } catch (error) {
        console.error('Error checking overdue items:', error.message);
    }
};

// Helper function to convert duration to milliseconds
const convertDurationToMillis = (duration) => {
    const [value, unit] = duration.split(' ');

    switch (unit) {
        case 'hour':
        case 'hours':
            return parseInt(value) * 60 * 60 * 1000;
        case 'minute':
        case 'minutes':
            return parseInt(value) * 60 * 1000;
        case 'day':
        case 'days':
            return parseInt(value) * 24 * 60 * 60 * 1000;
        default:
            return 0;
    }
};
