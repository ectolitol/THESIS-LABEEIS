import React from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code'; // Import from 'react-qr-code'

const ReturnSuccess = () => {
  const navigate = useNavigate();

  // Handle the 'Done' button click
  const handleDoneClick = () => {
    navigate('/LABEEIS'); // Redirect to the homepage
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Transaction Completed!</h2>
      <p>Thank you for returning the items. Your transaction has been successfully completed.</p>

      {/* QR Code for feedback */}
      <div style={{ margin: '20px 0' }}>
        <p>Please scan the QR code below using your phone to provide feedback on your experience with our system:</p>
        <div style={{ margin: '20px 0' }}>
        <QRCode 
          value="https://docs.google.com/spreadsheets/d/1z6H7wOze3kSza8lhiZTjpbs3mjyiAInrZurhePHPvdU/edit?gid=211469234#gid=211469234" // Replace with your actual survey link
          size={200} // Size of the QR code
        />
        </div>
      </div>

      {/* Done button */}
      <button
        onClick={handleDoneClick}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4CAF50',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Done
      </button>
    </div>
  );
};

export default ReturnSuccess;
