import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './qrIDScan.scss'; // Assuming you have this SCSS file for styling

const QRIDScanPage = () => {
  const [qrID, setQrID] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null);

  let debounceTimeout = null;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleBarcodeScan = (e) => {
    const scannedID = e.target.value;
    setQrID(scannedID);

    if (debounceTimeout) clearTimeout(debounceTimeout);

    if (scannedID.length === 24) {
      debounceTimeout = setTimeout(() => {
        verifyUser(scannedID);
      }, 500);
    }
  };

  const verifyUser = async (scannedID) => {
    try {
      console.log('Full Scanned ID:', scannedID);
      const response = await axios.get(`/api/users/${scannedID}`);
      if (response.status === 200) {
        setUserName(response.data.fullName);
        setError('');

        localStorage.setItem('userID', scannedID);
        localStorage.setItem('userName', response.data.fullName);
      } else {
        setError('User not found');
      }
    } catch (error) {
      setError('An error occurred while verifying the user.');
    }
  };

  const handleContinue = () => {
    navigate('/borrow-return-selection');
  };

  return (
    <div className="qr-id-scan-page">
      {/* Background image */}
      <img src="/ceaa.png" alt="Background" className="bg-only" />
  
      <div className="qr-id-content-container">
        <h2>Please scan your QR ID to log in your transaction.</h2>
  
        <input
          ref={inputRef}
          type="text"
          value={qrID}
          onChange={handleBarcodeScan}
          style={{ opacity: 0, position: 'absolute', top: '-9999px' }}
        />
        {userName && <h3>Welcome, {userName}!</h3>}
        {error && <p className="error">{error}</p>}
        {userName && <button onClick={handleContinue}>Continue</button>}
      </div>
    </div>
  );
};

export default QRIDScanPage;
