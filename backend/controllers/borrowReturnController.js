const BorrowReturnLog = require('../models/BorrowReturnLogModel');
const User = require('../models/UserModel');
const Item = require('../models/ItemModel');
const { createNotification } = require('../utils/notificationService');
const { sendTransactionEmail } = require('../utils/emailService');
const axios = require('axios'); // Import axios to send HTTP requests
exports.logTransaction = async (req, res) => {
  try {
    const {
      userID,
      userName,
      contactNumber,
      items = [], // Expect an array of items {itemBarcode, quantity}
      courseSubject,
      professor,
      profAttendance,
      roomNo,
      borrowedDuration,
      transactionType,
      notesComments,
    } = req.body;

    // Find the user by ID
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only process borrowing transactions
    if (transactionType === 'Borrowed') {
      // Create a new log entry for borrowing items
      const borrowReturnLog = new BorrowReturnLog({
        userID: user._id,
        userName: user.fullName, // Assuming 'fullName' is the correct field in the User model
        contactNumber: user.contactNumber,
        items: [],
        courseSubject,
        professor,
        profAttendance,
        roomNo,
        borrowedDuration,
        transactionType: 'Borrowed',
        returnStatus: 'Pending',
        notesComments,
        dueDate: new Date(Date.now() + convertDurationToMillis(borrowedDuration)) // Calculate due date
      });

      // Prepare the log items array and update item quantities
      for (const item of items) {
        // Find the item by barcode
        const foundItem = await Item.findOne({ itemBarcode: item.itemBarcode });
        if (!foundItem) {
          return res.status(404).json({ message: `Item not found for barcode: ${item.itemBarcode}` });
        }

        // Check stock availability and update item quantity
        const updatedQuantity = foundItem.quantity - item.quantity;
        if (updatedQuantity < 0) {
          return res.status(400).json({ message: `Not enough stock for item: ${item.itemBarcode}` });
        }

        // Add the borrowed item to the log
        borrowReturnLog.items.push({
          itemBarcode: foundItem.itemBarcode,
          itemName: foundItem.itemName,
          quantityBorrowed: item.quantity,
          quantityReturned: 0 // Initialize as 0 for borrowed items
        });

        // Update the item quantity in the database
        await Item.findOneAndUpdate(
          { itemBarcode: item.itemBarcode },
          { quantity: updatedQuantity },
          { new: true }
        );

        // Notify admin if stock is low
        if (updatedQuantity <= 1) {
          await createNotification(
            'Low Stock',
            `The stock for item ${foundItem.itemName} (Barcode: ${foundItem.itemBarcode}) is low.`,
            null
          );
        }
      }

      // Save the transaction log
      await borrowReturnLog.save();

      // Send email of transaction details
      await sendTransactionEmail(user, borrowReturnLog.items, borrowReturnLog.dueDate);

      // Send admin notification about borrowing
      await createNotification(
        'New Borrowing',
        `User ${user.fullName} has borrowed items: ${items.map(item => item.itemName).join(", ")}. Please ensure they are returned by ${borrowReturnLog.dueDate.toLocaleString()}.`,
        null // You can specify a user/admin if necessary
      );

      // Send SMS notification for borrowing via Server B
      const smsMessage = `Hi ${user.fullName}, please return the borrowed item(s) by ${borrowReturnLog.dueDate.toLocaleString()}. Details have been sent to your email. Thank you!`;
      const smsRequestData = {
        number: user.contactNumber,
        message: smsMessage
      };
      console.log(user.contactNumber, smsMessage)

      // Sending the SMS request to Server B
      try {
        const smsResponse = await axios.post(`${process.env.GSMClientIP}`, smsRequestData); // Replace <Server_B_IP> with Server B's IP address
        console.log('SMS request sent to Server B. Response:', smsResponse.data.message);
      } catch (error) {
        console.error('Error sending SMS via Server B:', error);
      }

      res.status(201).json({ message: "Borrowing transaction logged successfully", borrowReturnLog });
    } else {
      res.status(400).json({ message: "Invalid transaction type. Only 'Borrowed' transactions are allowed." });
    }
  } catch (error) {
    res.status(201).json({ message: "Error logging transaction", error: error.message });
  }
};


// Helper function to convert the borrowed duration to milliseconds
const convertDurationToMillis = (duration) => {
  const [value, unit] = duration.split(' ');
  const numValue = parseInt(value);

  switch (unit) {
    case 'hour':
    case 'hours':
    case 'hour/s':
      return numValue * 60 * 60 * 1000; // Convert to milliseconds
    case 'minute':
    case 'minutes':
    case 'minute/s':
      return numValue * 60 * 1000; // Convert to milliseconds
    case 'day':
    case 'days':
      case 'day/s':
      return numValue * 24 * 60 * 60 * 1000; // Convert to milliseconds
    default:
      throw new Error(`Unsupported time unit: ${unit}`);
  }
};

exports.completeReturn = async (req, res) => {
  try {
    const { pastTransactionID, userID, itemsReturned, feedbackEmoji } = req.body;

    console.log('Incoming return request:', req.body);

    // Find the borrow transaction that matches pastTransactionID and userID
    const borrowReturnLog = await BorrowReturnLog.findOne({
      _id: pastTransactionID,
      userID,
      transactionType: 'Borrowed',
    });

    if (!borrowReturnLog) {
      return res.status(404).json({ message: "Borrow transaction not found." });
    }

    // Filter items based on whether they haven't been fully returned yet
    const itemsToProcess = borrowReturnLog.items.filter(item => {
      return (
        itemsReturned.some(returnedItem => returnedItem.itemBarcode === item.itemBarcode) &&
        item.quantityReturned < item.quantityBorrowed // Only process items that haven't been fully returned
      );
    });

    // If no items are left to process
    if (itemsToProcess.length === 0) {
      return res.status(400).json({
        message: "All selected items have already been fully returned or no items are eligible for return.",
      });
    }

    // Loop through each item being returned and update the return quantity
    for (const logItem of itemsToProcess) {
      const returnedItem = itemsReturned.find(returned => returned.itemBarcode === logItem.itemBarcode);
      
      if (returnedItem) {
        const returnQuantity = Math.min(returnedItem.quantity, logItem.quantityBorrowed - logItem.quantityReturned); // Get the quantity being returned from the frontend, but cap it at the remaining quantity

        logItem.quantityReturned += returnQuantity; // Increment quantityReturned by the actual return quantity

        // Log to verify correct quantity update
        console.log(`Item ${logItem.itemBarcode} updated quantityReturned: ${logItem.quantityReturned} / ${logItem.quantityBorrowed}`);

        // Log the item condition
        logItem.condition = returnedItem.condition || 'Unknown'; // Store the condition

        // If quantityReturned equals quantityBorrowed, mark the item as fully returned
        if (logItem.quantityReturned === logItem.quantityBorrowed) {
          logItem.returnStatus = 'Completed';
        }

        // Update the stock quantity in the Item model
        const foundItem = await Item.findOne({ itemBarcode: logItem.itemBarcode });
        if (!foundItem) {
          return res.status(404).json({ message: `Item with barcode ${logItem.itemBarcode} not found in the database.` });
        }

        const updatedQuantity = foundItem.quantity + returnQuantity; // Increment stock by the return quantity

        try {
          // Update the item quantity in the database
          await Item.findOneAndUpdate(
            { itemBarcode: logItem.itemBarcode },
            { quantity: updatedQuantity },
            { new: true }
          );
        } catch (err) {
          console.error("Error updating item quantity:", err);
          return res.status(500).json({ message: "Error updating item quantity", error: err.message });
        }
      }
    }

    // Set return date and time to the current date
    borrowReturnLog.returnDate = new Date();

    // Check if all items in the transaction have been returned
    const allItemsReturned = borrowReturnLog.items.every(
      item => item.quantityBorrowed === item.quantityReturned
    );

    console.log(`All items returned? ${allItemsReturned}`);

    // Update the return status based on whether all items are returned
    if (allItemsReturned) {
      borrowReturnLog.returnStatus = "Completed";
      borrowReturnLog.transactionType = "Returned";
    } else {
      borrowReturnLog.returnStatus = "Partially Returned";
    }

    // Save the feedback emoji if provided
    if (feedbackEmoji) {
      borrowReturnLog.feedbackEmoji = feedbackEmoji;
    }

    try {
      // Save the updated transaction log
      await borrowReturnLog.save();
    } catch (err) {
      console.error("Error saving borrowReturnLog:", err);
      return res.status(500).json({ message: "Error saving transaction log", error: err.message });
    }

    // Send notification about the return process
    await createNotification(
      allItemsReturned ? 'Items Fully Returned' : 'Items Partially Returned',
      allItemsReturned
        ? `User ${borrowReturnLog.userName} has successfully returned all items: ${borrowReturnLog.items
            .map((item) => item.itemName)
            .join(", ")}.`
        : `User ${borrowReturnLog.userName} has partially returned items: ${itemsToProcess
            .map((item) => item.itemName)
            .join(", ")}. Please ensure the remaining items are returned.`,
      null // Specify recipient if needed (e.g., admin ID)
    );

    // Send SMS notification via Server B
    const smsMessage = allItemsReturned
      ? `Hi ${borrowReturnLog.userName}, your return process has been completed successfully. Thank you!`
      : `Hi ${borrowReturnLog.userName}, your return process is partially completed. Please return the remaining item(s) as soon as possible.`;

    const smsRequestData = {
      number: borrowReturnLog.contactNumber,
      message: smsMessage
    };

    try {
      // Send the SMS request to Server B
      const smsResponse = await axios.post(`${process.env.GSMClientIP}`, smsRequestData); // Replace <Server_B_IP> with Server B's IP address
      console.log('SMS request sent to Server B. Response:', smsResponse.data.message);
    } catch (err) {
      console.error("Error sending SMS via Server B:", err);
    }

    res.status(200).json({
      success: true,
      message: "Return process completed.",
      returnStatus: borrowReturnLog.returnStatus,
    });
  } catch (error) {
    console.error("Error completing return process:", error);
    res.status(200).json({
      message: "Error completing return process",
      error: error.message,
    });
  }
};


// Get transaction logs
exports.getTransactionLogs = async (req, res) => {
  try {
    const logs = await BorrowReturnLog.find().populate('userID').sort({ dateTime: -1 });
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error.message);
    res.status(500).json({ message: 'Error fetching logs', error: error.message });
  }
};

// Get transactions by user ID
exports.getUserTransactions = async (req, res) => {
  try {
    const transactions = await BorrowReturnLog.find({ userID: req.params.id });
    if (!transactions) {
      return res.status(404).json({ message: 'No transactions found for this user' });
    }
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
};

// Get transactions by item barcode
exports.getItemTransactions = async (req, res) => {
  try {
    const itemBarcode = req.params.itemBarcode;
    
    // Ensure itemBarcode is properly sanitized/validated as needed
    if (!itemBarcode) {
      return res.status(400).json({ message: 'Item barcode is required' });
    }

    // Find logs where any item's barcode matches the provided itemBarcode
    const logs = await BorrowReturnLog.find({ 'items.itemBarcode': itemBarcode });

    if (logs.length === 0) {
      return res.status(404).json({ message: 'No transactions found for this item barcode' });
    }

    res.json(logs);
  } catch (error) {
    console.error('Error fetching item transactions:', error);
    res.status(500).json({ message: 'Error fetching item transactions', error: error.message });
  } 
};


// Get all logs
exports.getAllLogs = async (req, res) => {
  try {
    const logs = await BorrowReturnLog.find();
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a log by ID
exports.getLogById = async (req, res) => {
  try {
    const log = await BorrowReturnLog.findById(req.params.id);
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.status(200).json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a log by ID
exports.updateLog = async (req, res) => {
  try {
    const log = await BorrowReturnLog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.status(200).json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a log by ID
exports.deleteLog = async (req, res) => {
  try {
    const log = await BorrowReturnLog.findByIdAndDelete(req.params.id);
    if (!log) return res.status(404).json({ message: 'Log not found' });
    res.status(200).json({ message: 'Log deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAggregatedTransactionData = async (req, res) => {
  try {
    // Aggregate data to sum quantities by date
    const data = await BorrowReturnLog.aggregate([
      {
        $project: {
          dateTime: { $dateToString: { format: "%Y-%m-%d", date: "$dateTime" } },
          items: 1
        }
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: { date: "$dateTime" },
          totalBorrowed: { $sum: "$items.quantityBorrowed" },
          totalReturned: { $sum: "$items.quantityReturned" }
        }
      },
      { $sort: { _id: 1 } } // Sort by date
    ]);

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching aggregated data:', error.message);
    res.status(500).json({ message: 'Error fetching aggregated data', error: error.message });
  }
};

exports.extendBorrowingDuration = async (req, res) => {
  try {
      const { borrowedDuration } = req.body; // New extension duration
      const logId = req.params.id;

      // Validate input
      if (!logId || !borrowedDuration) {
          return res.status(400).json({ message: 'Log ID and new duration are required' });
      }

      // Find the log entry and populate user details
      const borrowReturnLog = await BorrowReturnLog.findById(logId).populate('userID');
      if (!borrowReturnLog) {
          return res.status(404).json({ message: 'Borrow/Return log not found' });
      }

      // Check if the current status is "Overdue"
      if (borrowReturnLog.returnStatus !== 'Overdue') {
          return res.status(400).json({ message: 'Only overdue transactions can be extended' });
      }

      // Update the borrowed duration and calculate the new extended time
      const newExtensionMillis = convertDurationToMillis(borrowedDuration); // Convert duration to milliseconds
      const currentDate = new Date();
      const extendedDueDate = new Date(currentDate.getTime() + newExtensionMillis);

      // Initialize extendedDuration if it doesn't exist
      if (!borrowReturnLog.extendedDuration) {
        borrowReturnLog.extendedDuration = 0; // Initialize with 0 if no extension has been done yet
      }

      // Update the extended duration by adding the new extension (in milliseconds)
      borrowReturnLog.extendedDuration += newExtensionMillis;

      // Update the due date
      borrowReturnLog.dueDate = extendedDueDate; // Update the due date
      
      // Update return status to "Extended"
      borrowReturnLog.returnStatus = "Extended";
      borrowReturnLog.markModified('returnStatus');

      // Log the total extended duration in minutes for readability
      const totalExtendedMinutes = Math.floor(borrowReturnLog.extendedDuration / 60000); // Convert to minutes for logging
      console.log(`Total Extended Duration: ${totalExtendedMinutes} minutes`);
      console.log(`New Due Date: ${extendedDueDate.toLocaleString()}`);

      // Save the updated log
      await borrowReturnLog.save();

      // Notify user about the extension via SMS (via Server B)
      const smsMessage = `Hello ${borrowReturnLog.userID.fullName}, your borrowing duration has been extended until ${extendedDueDate.toLocaleString()}.`;
      const userContactNumber = borrowReturnLog.userID.contactNumber;

      // Send the SMS request to Server B
      const smsRequestData = {
        number: userContactNumber,
        message: smsMessage
      };

      try {
        const smsResponse = await axios.post(`${process.env.GSMClientIP}`, smsRequestData); // Replace <Server_B_IP> with Server B's IP address
        console.log('SMS request sent to Server B. Response:', smsResponse.data.message);
      } catch (error) {
        console.error('Error sending SMS via Server B:', error);
      }

      // Optionally notify the user/admin
      await createNotification(
          'Borrowing Extended',
          `The borrowing duration for ${borrowReturnLog.userID.fullName} has been extended until ${extendedDueDate.toLocaleString()}.`,
          null
      );

      res.status(200).json({ message: 'Borrowing duration extended successfully', borrowReturnLog });
  } catch (error) {
      console.error('Error extending borrowing duration:', error);
      res.status(200).json({ message: 'Error extending borrowing duration', error: error.message });
  }
};


const formatDuration = (millis) => {
  const seconds = millis / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;

  // Choose the most appropriate unit for the duration
  if (minutes < 60) {
      return `${Math.round(minutes)} minutes`;
  } else if (hours < 24) {
      return `${Math.round(hours)} hours`;
  } else {
      return `${Math.round(days)} days`;
  }
};

exports.updateFeedbackEmoji = async (req, res) => {
  const { transactionID } = req.params;  // transactionID corresponds to the _id field in MongoDB
  const { feedbackEmoji } = req.body;

  try {
    const transaction = await BorrowReturnLog.findById(transactionID);  // Use the _id to find the transaction

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Update the feedback emoji
    transaction.feedbackEmoji = feedbackEmoji;

    // Save the updated transaction 
    await transaction.save();

    res.status(200).json({ success: true, message: 'Feedback updated successfully' });
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ success: false, message: 'Error updating feedback' });
  }
};

// PUT request handler for partial return reason
exports.submitPartialReturnReason = async (req, res) => {
  const { transactionID } = req.params;
  const { reason } = req.body;

  try {
    // Validate reason
    if (!reason) {
      return res.status(400).json({ message: 'Reason for partial return is required.' });
    }

    // Find the transaction by ID and update the reason
    const transaction = await BorrowReturnLog.findById(transactionID);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }

    // Update the transaction with the reason
    transaction.partialReturnReason = reason;
    await transaction.save();

    // Return success response
    res.status(200).json({ message: 'Partial return reason submitted successfully.' });
  } catch (error) {
    console.error('Error submitting partial return reason:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Controller function to get top borrowed items
exports.getTopBorrowedItems = async (req, res) => {
  try {
    // Aggregation to calculate total borrowed quantities for each item
    const topItems = await BorrowReturnLog.aggregate([
      { 
        $unwind: "$items"  // Unwind the array of items to process each item individually
      },
      {
        $group: {
          _id: '$items.itemName', // Group by the item name
          totalBorrowed: { $sum: '$items.quantityBorrowed' } // Sum the borrowed quantities
        }
      },
      {
        $sort: { totalBorrowed: -1 } // Sort by total borrowed in descending order
      },
      {
        $limit: 10 // Limit to the top 10 borrowed items
      }
    ]);

    res.status(200).json(topItems); // Send the result back as JSON
  } catch (error) {
    console.error('Error fetching top borrowed items:', error);
    res.status(500).json({ error: 'Failed to fetch top borrowed items' });
  }
};

// Get all borrow/return logs with feedback emojis
exports.getAllFeedbackLogs = async (req, res) => {
  try {
    const feedbackLogs = await BorrowReturnLog.find().select('feedbackEmoji');
    
    // Count occurrences of each emoji
    const emojiCounts = feedbackLogs.reduce((acc, log) => {
      const emoji = log.feedbackEmoji;
      acc[emoji] = (acc[emoji] || 0) + 1; // Increment count for the emoji
      return acc;
    }, {});

    // Convert emoji counts to an array
    const response = Object.keys(emojiCounts).map(emoji => ({
      emoji,
      count: emojiCounts[emoji],
    }));

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

