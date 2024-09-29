import React from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code'; // Make sure this package is installed
import './NewUserInstruction.scss'; // CSS for styling

const NewUserInstruction = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const localNetworkLink = `${import.meta.env.VITE_LOCAL_NETWORK_URL}`; // Get the local network URL from Vite env

  // Handle the 'Done' button click
  const handleDoneClick = () => {
    navigate('/user-selection'); // Redirect back to user selection page
  };

  // Handle the 'Register New User' button click
  const handleRegisterClick = () => {
    navigate('/new-user-registration'); // Redirect to new user registration page
  };

  return (
    <div className="new-user-instructions-container">
      <h2>New User Instructions</h2>
      <p>Welcome! Please follow these instructions to register:</p>
      <ol>
        <li>Click on the link below to access the registration form.</li>
        <li>Fill out the required information.</li>
        <li>Submit the form and await confirmation via email.</li>
      </ol>

      <p>Access the registration form:</p>
      <a 
        href={localNetworkLink} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="registration-link"
      >
        {localNetworkLink}
      </a>

      {/* QR Code for accessing the form */}
      <div className="qr-code">
        <h3>Scan the QR code to access the form:</h3>
        <QRCode value={localNetworkLink} size={256} /> {/* Adjust size as needed */}
      </div>

        {/* Register New User button */}
        <button onClick={handleRegisterClick} className="register-button">
          Register New User
        </button>

        {/* Button Section */}
        <div className="button-container">
        {/* Done button */}
        <button onClick={handleDoneClick} className="done-button">
          Done
        </button>

        
      </div>
    </div>
  );
};

export default NewUserInstruction;
