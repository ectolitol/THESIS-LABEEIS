import React from 'react';
import { useNavigate } from 'react-router-dom';
import './welcome.scss'; // Importing the SCSS file for styling

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
      {/* Background image */}
      <img src="/ceafinal.png" alt="Background" className="bg-only" />

      <div className="welcome-content-container">
        <div className="welcome2-container">
          <h1>EELMS</h1>
          <h3>Electrical Engineering Laboratory Management System</h3>
 
        </div>
        <div className="welcome-form-container">
          <button className="welcome-button" onClick={handleAdminClick}>Admin</button>
          <button className="welcome-button" onClick={handleUserClick}>User</button>
        </div>
        <div className="welcome-guide-container">
          <a href="/path/to/guide.pdf" className="welcome-guide-link" target="_blank" rel="noopener noreferrer">
            A User's Guide Manual on How to Use EELMS (PDF)
          </a>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
