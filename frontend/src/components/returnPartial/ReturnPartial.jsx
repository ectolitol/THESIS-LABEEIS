import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


const ReturnPartial = ({ remainingItems }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    items
  } = location.state || {};

  useEffect(() => {
    console.log('Items array:', items); // Log the items array specifically
  }, [items]);

  // Handle the 'Return Remaining Items' button click
  const handleReturnRemainingClick = () => {
    navigate('/LABEEIS'); // Redirect to the return items page or the relevant path
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Partial Return Completed!</h2>
      <p>Thank you for returning some of the items. However, your return is only partially completed.</p>
      <p>Please return the remaining items listed below:</p>
      
      <div>
      {/* Display remaining items */}
      <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
        {items && items.length > 0 ? (
          items.map((item, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>
              <strong>{item.itemName}</strong> ({item.itemBarcode}) - Quantity Left: {item.quantity}
            </li>
          ))
        ) : (
          <p>All items have been returned.</p>
        )}
      </ul>
      </div>

      {/* Button to return remaining items */}
      <button
        onClick={handleReturnRemainingClick}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#f39c12',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px',
        }}
      >
        OK
      </button>
    </div>
  );
};

export default ReturnPartial;
