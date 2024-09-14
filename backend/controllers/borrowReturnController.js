const BorrowReturnLog = require('../models/BorrowReturnLogModel');
const User = require('../models/UserModel');
const Item = require('../models/ItemModel');
const { createNotification } = require('../utils/notificationService');

exports.logTransaction = async (req, res) => {
  try {
    const {
      userID,
      items, // Expect an array of items {itemBarcode, quantity}
      courseSubject,
      professor,
      roomNo,
      borrowedDuration,
      transactionType,
      notesComments
    } = req.body;

    // Find the user by ID
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find an existing BorrowReturnLog if the transaction is a return
    let borrowReturnLog;
    if (transactionType === 'Returned') {
      borrowReturnLog = await BorrowReturnLog.findOne({
        userID: user._id,
        transactionType: 'Borrowed',
        returnStatus: ['Pending', 'Overdue'] // Only consider logs that haven't been fully returned
      });

      if (!borrowReturnLog) {
        return res.status(404).json({ message: "No corresponding borrow transaction found" });
      }
    } else {
      // If it's a borrowing transaction, create a new log entry
      borrowReturnLog = new BorrowReturnLog({
        userID: user._id,
        userName: user.fullName, // Assuming 'fullName' is the correct field in the User model
        items: [],
        courseSubject,
        professor,
        roomNo,
        borrowedDuration,
        transactionType,
        returnStatus: 'Pending',
        notesComments
      });
    }

    // Prepare the log items array and update item quantities
    for (const item of items) {
      // Find the item by barcode
      const foundItem = await Item.findOne({ itemBarcode: item.itemBarcode });
      if (!foundItem) {
        return res.status(404).json({ message: `Item not found for barcode: ${item.itemBarcode}` });
      }

      let updatedQuantity;
      let logItem = borrowReturnLog.items.find(logItem => logItem.itemBarcode === item.itemBarcode);

      if (transactionType === 'Borrowed') {
        if (logItem) {
          logItem.quantityBorrowed += item.quantity;
        } else {
          borrowReturnLog.items.push({
            itemBarcode: foundItem.itemBarcode,
            itemName: foundItem.itemName,
            quantityBorrowed: item.quantity,
            quantityReturned: 0 // Initialize as 0 for borrowed items
          });
        }
        updatedQuantity = foundItem.quantity - item.quantity;
      } else if (transactionType === 'Returned') {
        if (!logItem || item.quantity > logItem.quantityBorrowed - logItem.quantityReturned) {
          return res.status(400).json({ message: `Return quantity for item ${item.itemBarcode} exceeds borrowed quantity` });
        }
        logItem.quantityReturned += item.quantity;
        updatedQuantity = foundItem.quantity + item.quantity;

        // If all borrowed items are returned, mark the transaction as Completed
        if (borrowReturnLog.items.every(logItem => logItem.quantityBorrowed <= logItem.quantityReturned)) {
          borrowReturnLog.returnStatus = 'Completed';
          borrowReturnLog.transactionType = 'Returned';
        }
      }

      // Ensure quantity does not go negative
      if (updatedQuantity < 0) {
        return res.status(400).json({ message: `Not enough stock for item: ${item.itemBarcode}` });
      }

      // Update the item in the database
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

    // Save or update the transaction log
    await borrowReturnLog.save();

    res.status(201).json({ message: "Transaction logged successfully", borrowReturnLog });
  } catch (error) {
    res.status(500).json({ message: "Error logging transaction", error: error.message });
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
