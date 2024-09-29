import React from 'react';
import { useNavigate } from 'react-router-dom';
import './userSelection.scss'; // Optional: create a CSS file for styling

const UserSelection = () => {
  const navigate = useNavigate();

  const handleNewUserClick = () => {
    navigate('/registration'); // Redirect to registration page
  };

  const handleRegisteredUserClick = () => {
    navigate('/scan-qr-id'); // Redirect to QR scanning page
  };

  return (
    <div className="user-selection-container">
      <h2>Select User Type</h2>
      <div className="button-container">
        <button onClick={handleNewUserClick}>New User</button>
        <button onClick={handleRegisteredUserClick}>Registered User</button>
      </div>
    </div>
  );
};

export default UserSelection;
