const cron = require('node-cron');
const moment = require('moment');
const BorrowReturnLog = require('../models/BorrowReturnLogModel');
const { sendSMS } = require('./smsService');

// Function to send SMS without retry logic
const sendSMSOnce = async (recipient, message) => {
  try {
    // Try to send the SMS
    const response = await sendSMS(recipient, message);
    
    // Log the response after sending SMS
    console.log(`SMS sent successfully to ${recipient}. Response: ${JSON.stringify(response)}`);
    
    return response; // SMS sent successfully
  } catch (error) {
    // Log detailed error message if sending fails
    console.error(`Failed to send SMS to ${recipient}: ${error.message}`);
    console.log(`Error details: ${JSON.stringify(error)}`); // Log the full error object for more info
    throw error;
  }
};

// Function to check if the current time is within 5 minutes of the due date and send SMS
const sendReminderIfDue = async (log) => {
  // Log the log entry being processed
  console.log(`Processing log ID: ${log._id}`);

  const dueDate = moment(log.dueDate); // Directly use the dueDate from the log
  const now = moment();
  const fiveMinutesBeforeDue = dueDate.clone().subtract(5, 'minutes'); // Get the time 5 minutes before the due date

  // console.log(`Current time: ${now.format('YYYY-MM-DD HH:mm:ss')}`);
  // console.log(`Due date: ${dueDate.format('YYYY-MM-DD HH:mm:ss')}`);
  // console.log(`Five minutes before due date: ${fiveMinutesBeforeDue.format('YYYY-MM-DD HH:mm:ss')}`);

  // Check if the current time is between 5 minutes before the due date and the due date itself,
  // and that the reminder has not been sent yet
  if (now.isBetween(fiveMinutesBeforeDue, dueDate) && !log.reminderSent) {
    const user = log.userID; // Assuming userID contains user information
    const smsMessage = `Hello ${user.fullName}, reminder to return borrowed items by due date. If you wish to extend, please inform in lab. Thank you!`;

    try {
      // Log that we are about to send the SMS
      console.log(`Sending reminder to ${user.fullName} (${user.contactNumber})`);

      // Send the SMS once without retries
      await sendSMS(user.contactNumber, smsMessage);

      // Mark the reminder as sent by updating the log
      log.reminderSent = true;
      await log.save(); // Save the change to the database

      console.log(`SMS reminder sent to ${user.fullName} (${user.contactNumber})`);
    } catch (error) {
      console.error(`Failed to send SMS reminder to ${user.fullName}: ${error.message}`);
    }
  } else {
    console.log(`Current time is not within 5 minutes of due date or reminder already sent for log ID: ${log._id}`);
  }
};

// The simplified cron job to send SMS reminders for Pending and Extended transactions
const startSmsReminderCron = () => {
  cron.schedule('* * * * *', async () => { // Runs every minute
    try {
      // console.log('Looking for transactions with returnStatus: Pending or Extended...');

      // Fetch logs with returnStatus 'Pending' or 'Extended'
      const logs = await BorrowReturnLog.find({
        returnStatus: { $in: ['Pending', 'Extended'] },
      }).populate('userID'); // Assuming userID is a reference to the User model

      // console.log(`Found ${logs.length} logs to check for overdue status.`);

      // Loop through all logs and send reminders if the due date is within the next 5 minutes
      for (const log of logs) {
        await sendReminderIfDue(log); // Check and send SMS if the due date is near
      }

      // console.log('SMS reminder process completed.');
    } catch (error) {
      console.error("Error while sending SMS reminders:", error.message);
    }
  });

  console.log('Cron job for SMS reminders has been started.');
};

module.exports = { startSmsReminderCron };
