import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const QRIDScanPage = () => {
  const [qrID, setQrID] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null); // Ref for hidden input element

  // To store the timeout reference for debouncing
  let debounceTimeout = null;

  // Focus the hidden input field when the page loads
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Automatically focus the hidden input field
    }
  }, []);

  const handleBarcodeScan = (e) => {
    const scannedID = e.target.value;
    setQrID(scannedID);

    // Clear previous timeout if any
    if (debounceTimeout) clearTimeout(debounceTimeout);

    // If the scanned ID length is 24 (MongoDB ObjectId length), make the request
    if (scannedID.length === 24) {
      debounceTimeout = setTimeout(() => {
        verifyUser(scannedID);
      }, 500); // Wait 500ms to ensure scanning is complete
    }
  };

  const verifyUser = async (scannedID) => {
    try {
      console.log('Full Scanned ID:', scannedID);
      const response = await axios.get(`/api/users/${scannedID}`);
      if (response.status === 200) {
        setUserName(response.data.fullName);
        setError('');
        console.log('User found:', response.data.fullName);
  
        // Store the userID and userName in localStorage
        localStorage.setItem('userID', scannedID);
        localStorage.setItem('userName', response.data.fullName); // Save userName here
      } else {
        setError('User not found');
        console.log('User not found');
      }
    } catch (error) {
      console.error('Error verifying user:', error);
      setError('An error occurred while verifying the user.');
    }
  };
  

  const handleContinue = () => {
    navigate('/borrow-return-selection');
  };

  return (
    <div className="qr-id-scan-page">
      <h2>Scan Your QR ID</h2>

      {/* Hidden input box to capture QR scan */}
      <input
        ref={inputRef} // Attach the ref to the hidden input element
        type="text"
        placeholder="Scan QR ID"
        value={qrID}
        onChange={handleBarcodeScan}
        style={{ opacity: 0, position: 'absolute', top: '-9999px' }} // Hide the input box
      />

      {/* Display the result when user is found */}
      {userName && <h3>Welcome, {userName}!</h3>}
      {error && <p className="error">{error}</p>}
      {userName && <button onClick={handleContinue}>Continue</button>}
    </div>
  );
};

export default QRIDScanPage;
