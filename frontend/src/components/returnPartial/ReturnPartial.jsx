import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import './ReturnPartial.scss'; // Import the SCSS file

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
    <div className="return-partial-container">
    {/* Background image */}
    <img src="/ceaa.png" alt="Background" className="bg-only" />
 

      <h2 className="return-partial-title">Partial Return Completed!</h2>
      <p className="return-partial-description">Thank you for returning some of the items. However, your return is only partially completed.</p>
      <p className="return-partial-instruction">Please return the remaining items listed below:</p>
      
      <div className="return-partial-items">
        <ul className="items-list">
          {items && items.length > 0 ? (
            items.map((item, index) => (
              <li key={index} className="item">
                <strong>{item.itemName}</strong> ({item.itemBarcode}) - Quantity Left: {item.quantity}
              </li>
            ))
          ) : (
            <p className="all-returned-message">All items have been returned.</p>
          )}
        </ul>
      </div>

      <button
        className="return-partial-button"
        onClick={handleReturnRemainingClick}
      >
        OK
      </button>
    </div>
  );
};

export default ReturnPartial;
