import React from 'react';
import { useNavigate } from 'react-router-dom';
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
        <li>Click the "Register New User" button below</li>
        <li>Fill out the required information.</li>
        <li>Submit the form and await confirmation via email.</li>
      </ol>

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
