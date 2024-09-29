import "./borrowReturnSelection.scss";
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BorrowReturnSelection = () => {
  const navigate = useNavigate();

  // Retrieve userID and userName from localStorage
  const userID = localStorage.getItem('userID');
  const userName = localStorage.getItem('userName'); // Retrieve userName from localStorage

  const handleBorrowClick = () => {
    // Navigate to borrowing page with userID, userName, and transactionType
    navigate('/borrowing', { state: { userID, userName, transactionType: 'Borrowed' } });
  };

  const handleReturnClick = () => {
    // Navigate to returning page with userID, userName, and transactionType
    navigate('/returning', { state: { userID, userName, transactionType: 'Returned' } });
  };

  return (
    <div className="borrow-return-selection">
      <h2>Choose Action</h2>
      {userName && <h3>Welcome, {userName}!</h3>} {/* Display userName if available */}
      <button onClick={handleBorrowClick}>Borrow Items</button>
      <button onClick={handleReturnClick}>Return Items</button>
    </div>
  );
};

export default BorrowReturnSelection;
