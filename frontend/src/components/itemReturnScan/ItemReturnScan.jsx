import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ItemReturnScan = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Retrieve selected transaction and user info from navigation state
  const { selectedTransaction, userID, userName, transactionType } = location.state || {};

  // Handle missing selectedTransaction by showing a message
  if (!selectedTransaction) {
    return (
      <div>
        <h2>Error</h2>
        <p>No transaction selected. Please go back and select a valid transaction.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const [scannedItems, setScannedItems] = useState([...selectedTransaction.items]); // Track the updated scanned quantities
  const [barcode, setBarcode] = useState(''); // Track the barcode input value
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isReturnComplete, setIsReturnComplete] = useState(false); // Track whether the return process is complete

  // Add a function to fetch item name using the barcode
  const fetchItemName = async (barcode) => {
    try {
      const response = await axios.get(`/api/items/barcode/${barcode}`); // Adjust the API endpoint as necessary
      console.log('API response:', response.data); 
      return response.data.itemName; // Assuming the API returns an itemName field
    } catch (err) {
      console.error('Error fetching item name:', err);
      return null;
    }
  };

  // Function to handle item scanning
  const handleScan = async () => {
    if (!barcode) {
      setError('Please enter a valid barcode.');
      return;
    }

    // Find the item in the selectedTransaction that matches the barcode
    const logItemIndex = scannedItems.findIndex(item => item.itemBarcode === barcode);

    if (logItemIndex === -1) {
      setError('Item not found in this transaction.');
      return;
    }

    const logItem = scannedItems[logItemIndex];

    // Check if the item has already been fully returned
    if (logItem.quantityReturned >= logItem.quantityBorrowed) {
      setError('You have already returned all of this item.');
      return;
    }

      try {

        // Fetch the item name
      const itemName = await fetchItemName(barcode);
      console.log(`Fetched itemName: ${itemName}`);

      if (!itemName) {
        setError('Error retrieving item name.');
        return;
      }

      // Update the returned quantity locally
      const updatedItems = [...scannedItems];
      updatedItems[logItemIndex].quantityReturned++;

      // Update the scanned items state
      setScannedItems(updatedItems);
      setSuccess(`Item ${barcode} logged successfully!`);
      setError('');
    } catch (err) {
      setError('Error processing the return.');
      console.error(err);
    }

    setBarcode(''); // Clear the barcode input
  };
  const handleCompleteReturn = async () => {
    try {
      // Filter the items to be returned and calculate the remaining quantity
      const itemsReturned = scannedItems
        .filter(item => item.quantityReturned > 0 && item.quantityReturned <= item.quantityBorrowed) // Ensure only valid items are processed
        .map(item => {
          // Calculate how many items are being returned in this transaction
          const quantityToReturn = item.quantityReturned; // Directly use the returned quantity instead of calculating
  
          return {
            itemBarcode: item.itemBarcode,
            itemName: item.itemName,
            quantity: quantityToReturn, // Send the quantity being returned in this transaction
          };
        });
  
      // Add console.log to check itemsReturned data
      console.log("Items to be returned:", itemsReturned);
  
      if (itemsReturned.length === 0) {
        setError('No items to return.');
        return;
      }
  
      // Send the return request to the backend
      const response = await axios.post('/api/borrow-return/complete-return', {
        pastTransactionID: selectedTransaction._id,
        userID,
        itemsReturned
      });
  
      // Add console.log to check the response from the backend
      console.log("Return process response:", response.data);
  
      if (response.data.success) {
        setSuccess('Return process completed successfully!');
        setError('');
        setIsReturnComplete(true);
  
        // Check returnStatus and navigate accordingly
        const returnStatus = response.data.returnStatus; // Assuming returnStatus is part of the response
  
        if (returnStatus === 'Completed') {
          // If all items are returned, navigate to success page
          setTimeout(() => {
            navigate('/return-success', { state: { userID, userName, items: itemsReturned } });
          }, 2000); // Navigate after 2 seconds
        } else if (returnStatus === 'Partially Returned') {
          // If only some items are returned, navigate to partial return page
          setTimeout(() => {
            navigate('/return-partial', { state: { userID, userName, items: itemsReturned } }); // Adjust the route as needed
          }, 2000); // Navigate after 2 seconds
        }
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      // Log any errors that occur during the return process
      console.error('Error completing the return process:', err);
      setError('Error completing the return process.');
    }
  };
  
  
  

  return (
    <div>
      <h2>Item Return Scan</h2>

      {/* Display transaction details */}
      <p><strong>Transaction ID:</strong> {selectedTransaction._id}</p>
      <p><strong>User:</strong> {selectedTransaction.userName}</p>

      {/* Correctly display the items array */}
      <p><strong>Items:</strong></p>
      <ul>
        {scannedItems.map((item, index) => (
          <li key={index}>
            <p><strong>Item Name:</strong> {item.itemName}</p>
            <p><strong>Item Barcode:</strong> {item.itemBarcode}</p>
            <p><strong>Quantity Borrowed:</strong> {item.quantityBorrowed}</p>
            <p><strong>Quantity Returned:</strong> {item.quantityReturned}/{item.quantityBorrowed}</p>
          </li>
        ))}
      </ul>

      <p><strong>Status:</strong> {selectedTransaction.returnStatus}</p>
      <p><strong>Borrowed Duration:</strong> {selectedTransaction.borrowedDuration}</p>
      <p><strong>Date and Time:</strong> {new Date(selectedTransaction.dateTime).toLocaleString()}</p>

      {/* Barcode input */}
      {!isReturnComplete && (
        <div>
          <input
            type="text"
            placeholder="Scan Item Barcode"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleScan();
              }
            }}
          />
          <button onClick={handleScan}>Scan</button>
        </div>
      )}

      {/* Display error or success messages */}
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      {/* Button to complete the return */}
      {scannedItems.some(item => item.quantityReturned > 0) && !isReturnComplete && (
        <button onClick={handleCompleteReturn} disabled={scannedItems.every(item => item.quantityReturned === 0)}>
          Complete Return
        </button>
      )}

      {/* Return complete message */}
      {isReturnComplete && (
        <p>Return process completed. Redirecting...</p>
      )}
    </div>
  );
};

export default ItemReturnScan;
