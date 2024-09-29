import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReturningProcess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userID, userName, transactionType } = location.state || {}; // Retrieve userID, userName, and transactionType from navigation state

  // Log to verify values
  console.log('Navigation State:', { userID, userName, transactionType });

  // Manage states for displaying past transactions and selected transaction
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [error, setError] = useState('');

  // Fetch past transactions when the component mounts
  useEffect(() => {
    const fetchPastTransactions = async () => {
        try {
          const response = await axios.get(`/api/users/${userID}/transactions`);
          const borrowedTransactions = response.data.filter(transaction => {
            // Check if any item in the transaction has quantityBorrowed !== quantityReturned
            const hasPendingItems = transaction.items.some(item => item.quantityBorrowed !== item.quantityReturned);
            return transaction.transactionType === 'Borrowed' && hasPendingItems;
          });
      
          if (borrowedTransactions.length > 0) {
            setTransactions(borrowedTransactions); // Save only transactions with pending items
          } else {
            setError("No past 'Borrowed' transactions with pending returns found.");
          }
        } catch (error) {
          console.error("Error fetching past transactions:", error);
          setError("Error fetching past transactions.");
        }
      };
      

    fetchPastTransactions();
  }, [userID]);

  const handleSelectTransaction = (transaction) => {
    setSelectedTransaction(transaction); // Set the selected transaction when user clicks on one
  };

  const handleContinue = () => {
    // Ensure a transaction is selected before continuing
    if (!selectedTransaction) {
      setError('Please select a transaction to continue.');
      return;
    }

    // Navigate to the next step for item scanning
    navigate(`/item-return-scan/${selectedTransaction._id}`, { state: { selectedTransaction, userID, userName, transactionType: 'Returned' } });
  };

  return (
    <div>
      <h2>Returning Process</h2>

      {error && <p className="error">{error}</p>}

      {transactions.length > 0 ? (
        <div>
          <h3>Select a transaction to continue:</h3>
          <ul>
            {transactions.map((transaction) => (
              <li
                key={transaction._id}
                onClick={() => handleSelectTransaction(transaction)} // Set the selected transaction when clicked
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedTransaction?._id === transaction._id ? '#f0f0f0' : '#fff',
                  padding: '10px',
                  border: '1px solid #ddd',
                  marginBottom: '10px',
                }}
              >
                <p><strong>Transaction ID:</strong> {transaction._id}</p>
                <p><strong>User:</strong> {transaction.userName}</p>
                <p><strong>Contact Number:</strong> {transaction.contactNumber}</p>
                <p><strong>Course:</strong> {transaction.courseSubject}</p>
                <p><strong>Room:</strong> {transaction.roomNo}</p>
                <p><strong>Professor:</strong> {transaction.professor}</p>

                {/* Correctly display the items array */}
                <p><strong>Items:</strong></p>
                <ul>
                  {transaction.items.map((item, index) => (
                    <li key={index}>
                      <p><strong>Item Name:</strong> {item.itemName}</p>
                      <p><strong>Quantity Borrowed:</strong> {item.quantityBorrowed}</p>
                      <p><strong>Quantity Returned:</strong> {item.quantityReturned}</p>
                    </li>
                  ))}
                </ul>

                <p><strong>Status:</strong> {transaction.returnStatus}</p>
                <p><strong>Borrowed Duration:</strong> {transaction.borrowedDuration}</p>
                <p><strong>Date and Time:</strong> {new Date(transaction.dateTime).toLocaleString()}</p>
              </li>
            ))}
          </ul>
          <button onClick={handleContinue}>Continue</button>
        </div>
      ) : (
        <p>Loading your past transactions...</p>
      )}
    </div>
  );
};

export default ReturningProcess;
