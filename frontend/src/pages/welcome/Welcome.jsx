import React from 'react';
import { useNavigate } from 'react-router-dom';
import './welcome.scss'; // Optional: create a CSS file for styling

const Welcome = () => {
  const navigate = useNavigate();

  const handleUserClick = () => {
    navigate('/user-selection'); // Redirect to user selection page
  };

  const handleAdminClick = () => {
    navigate('/login'); // Redirect to admin login page
  };

  return (
    <div className="welcome-container">
      <h1>Welcome to LABEEIS</h1>
      <div className="button-container"> Select:
        <button onClick={handleAdminClick}>Admin</button>
        <button onClick={handleUserClick}>User</button>
      </div>
    </div>
  );
};

export default Welcome;
