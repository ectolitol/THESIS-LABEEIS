import React from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code'; // Ensure the package is installed
import './NewUserInstruction.scss'; // Import the updated SCSS file

const NewUserInstruction = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const localNetworkLink = `${import.meta.env.VITE_LOCAL_NETWORK_URL}`; // Get the local network URL from Vite env

  // Handle the 'Register New User' button click
  const handleRegisterClick = () => {
    navigate('/new-user-registration'); // Redirect to new user registration page
  };

  // Handle the 'Back' button click 
  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="new-user-instructions-container">
      {/* Background image */}
      <img src="/ceaa.png" alt="Background" className="bg-only" />

      <h2>New User Instructions</h2>
      <p>Welcome! Please follow these instructions to register:</p>
      <ol>
        <li>Connect your device to 'EELMS' Wi-Fi.</li>
        <li>Scan the link below to access the registration form.</li>
        <li>Fill out the required information.</li>
        <li>Submit the form and await confirmation via email.</li>
      </ol>

      {/* <p>Access the registration form:</p> */}
      {/* <a 
        href={localNetworkLink} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="registration-link"
      >
        {localNetworkLink}
      </a> */}

      {/* QR Code for accessing the form */}
      <div className="qr-code">
        <h3>Scan the QR code to access the form or</h3>
        <h3>click the "Register New User" button below:</h3>
        <QRCode value={localNetworkLink} size={256} /> {/* Adjust size as needed */}
      </div>

      {/* Button Section */}
      <div className="button-container">
        <button onClick={handleRegisterClick} className="register-button">
          Register New User
        </button>
      </div>

      {/* Back link below the Done button */}
      <a className="back-link" onClick={handleBackClick}>
        Back
      </a>
    </div>
  );
};

export default NewUserInstruction;
