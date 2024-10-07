import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './returningProcess.scss';

const ReturningProcess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userID, userName, transactionType } = location.state || {};

  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false); // Modal state
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPastTransactions = async () => {
      try {
        const response = await axios.get(`/api/users/${userID}/transactions`);
        const borrowedTransactions = response.data.filter(transaction => {
          const hasPendingItems = transaction.items.some(item => item.quantityBorrowed !== item.quantityReturned);
          return transaction.transactionType === 'Borrowed' && hasPendingItems;
        });

        if (borrowedTransactions.length > 0) {
          setTransactions(borrowedTransactions);
        } else {
          setError("No past 'Borrowed' transactions with pending returns found.");
        }
      } catch (error) {
        console.error('Error fetching past transactions:', error);
        setError('Error fetching past transactions.');
      }
    };

    fetchPastTransactions();
  }, [userID]);

  const handleSelectTransaction = (transaction) => {
    setSelectedTransaction(transaction); // Set the selected transaction
    setShowModal(true); // Show modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Close modal
  };

  const handleContinue = () => {
    if (!selectedTransaction) {
      setError('Please select a transaction to continue.');
      return;
    }

    navigate(`/item-return-scan/${selectedTransaction._id}`, {
      state: { selectedTransaction, userID, userName, transactionType: 'Returned' },
    });
  };

  const handleBackClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div className="returning-process">
      <img src="/ceaa.png" alt="Background" className="bg-only" />
     
      <h2 className="transaction-title">USER'S TRANSACTION</h2>

      {error && <p className="error">{error}</p>}

      {transactions.length > 0 ? (
        <div className="transaction-list">
          <h3>Select a transaction to continue:</h3>
          <ul>
            {transactions.map((transaction) => (
              <li
                key={transaction._id}
                onClick={() => handleSelectTransaction(transaction)}
                className="transaction-item"
              >
                <p><strong>Transaction ID:</strong> {transaction._id}</p>
                <p><strong>User:</strong> {transaction.userName}</p>
                {/* Other details */}
              </li>
            ))}
          </ul>
          
        </div>
      ) : (
        <p>Loading your past transactions...</p>
        
      )}

      <div> <button onClick={handleBackClick} className="back-button">Back</button> {/* Back button */}</div>

      {/* Modal */}
      {showModal && (
        <div className="return-modal-overlay">
          <div className="return-modal-content">
            <h3>Transaction Details</h3>
            {selectedTransaction && (
              <div>
                <p><strong>Transaction ID:</strong> {selectedTransaction._id}</p>
                <p><strong>User:</strong> {selectedTransaction.userName}</p>
                <p><strong>Contact Number:</strong> {selectedTransaction.contactNumber}</p>
                <p><strong>Course:</strong> {selectedTransaction.courseSubject}</p>
                <p><strong>Room:</strong> {selectedTransaction.roomNo}</p>
                <p><strong>Professor:</strong> {selectedTransaction.professor}</p>
                <p><strong>Status:</strong> {selectedTransaction.returnStatus}</p>
                <p><strong className='return-modal-item'>Item/s:</strong></p>
                <ul>
                  {selectedTransaction.items.map((item, index) => (
                    <li key={index}>
                      <p><strong>Item Name:</strong> {item.itemName}</p>
                      <p><strong>Quantity Borrowed:</strong> {item.quantityBorrowed}</p>
                      <p><strong>Quantity Returned:</strong> {item.quantityReturned}</p>
                    </li>
                  ))}
                </ul>

                <p><strong>Borrowed Duration:</strong> {selectedTransaction.borrowedDuration}</p>
                <p><strong>Date and Time:</strong> {new Date(selectedTransaction.dateTime).toLocaleString()}</p>

                <button onClick={handleContinue} className="continue-button">Continue</button>
                {/* Close button */}
                <p onClick={handleCloseModal} className="return-close-button">Close</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturningProcess;
