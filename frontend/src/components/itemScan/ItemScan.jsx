import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './itemScan.scss';

const ItemScan = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Destructure navigation state with default values
  const {
    userID = '',
    userName = '',
    transactionType = '',
    courseSubject = '',
    professor = '',
    roomNo = '',
    borrowedDuration = '',
  } = location.state || {};

  // State management
  const [scannedItems, setScannedItems] = useState([]);
  const [currentBarcode, setCurrentBarcode] = useState('');
  const [quantity, setQuantity] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [itemDetails, setItemDetails] = useState(null);
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [quantityExceededMessage, setQuantityExceededMessage] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  const barcodeInputRef = useRef(null);

  useEffect(() => {
    // Focus on the barcode input
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }

    // Fetch user details
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`/api/users/${userID}`);
        if (response.status === 200) {
          setContactNumber(response.data.contactNumber);
          console.log('Fetched user contact number:', response.data.contactNumber);
        } else {
          console.error('Error fetching user details.');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [userID]);

  const handleBarcodeScan = async (e) => {
    e.preventDefault();
    resetItemDetails();

    console.log('Scanning barcode:', currentBarcode);

    if (currentBarcode) {
      try {
        const response = await axios.get(`/api/items/barcode/${currentBarcode}`);
        if (response.status === 200) {
          setItemDetails(response.data);
          setAvailableQuantity(response.data.quantity);
          console.log('Item details fetched:', response.data);
        } else {
          setErrorMessage('Item not found. Please scan a valid barcode.');
          console.error('Item not found for barcode:', currentBarcode);
        }
      } catch (error) {
        setErrorMessage('Error checking barcode. Please try again.');
        console.error('Error during barcode scan:', error);
      }
    }
  };

  const resetItemDetails = () => {
    setErrorMessage('');
    setItemDetails(null);
    setAvailableQuantity(0);
    setQuantityExceededMessage('');
  };

  const handleAddItem = () => {
    if (!currentBarcode || !quantity || !itemDetails) {
      setErrorMessage('Please scan an item and enter quantity.');
      console.warn('Attempted to add item without scanning or quantity:', { currentBarcode, quantity });
      return;
    }

    const requestedQuantity = Number(quantity);

    if (requestedQuantity > availableQuantity) {
      setQuantityExceededMessage(`Cannot add item. Total quantity exceeds available stock. Available quantity: ${availableQuantity}`);
      console.warn('Requested quantity exceeds available stock:', { requestedQuantity, availableQuantity });
      return;
    }

    const existingItemIndex = scannedItems.findIndex(item => item.itemBarcode === currentBarcode);

    if (existingItemIndex >= 0) {
      const totalQuantity = scannedItems[existingItemIndex].quantity + requestedQuantity;

      if (totalQuantity > availableQuantity) {
        setQuantityExceededMessage(`Cannot add item. Total quantity exceeds available stock. Available quantity: ${availableQuantity}`);
        console.warn('Total quantity exceeds available stock during update:', { totalQuantity, availableQuantity });
        return;
      }

      // Update the existing item
      const updatedItems = [...scannedItems];
      updatedItems[existingItemIndex].quantity = totalQuantity;
      setScannedItems(updatedItems);
      console.log('Updated existing item quantity:', { itemBarcode: currentBarcode, totalQuantity });
    } else {
      // Add new item to the scannedItems
      const newItem = {
        itemBarcode: currentBarcode,
        itemName: itemDetails.itemName,
        quantity: requestedQuantity,
        image: itemDetails.image ? `/uploads/${itemDetails.image}` : '',
      };
      setScannedItems(prevItems => [...prevItems, newItem]);
      console.log('Added new item:', newItem);
    }

    resetFields();
  };

  const resetFields = () => {
    setCurrentBarcode('');
    setQuantity('');
    setItemDetails(null);
    setAvailableQuantity(0);
    setErrorMessage('');
    setQuantityExceededMessage('');

    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  };

  const handleDeleteItem = (itemBarcode) => {
    const updatedScannedItems = scannedItems.filter(item => item.itemBarcode !== itemBarcode);
    setScannedItems(updatedScannedItems);
    console.log('Deleted item:', itemBarcode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const itemsToSubmit = scannedItems.map(item => ({
      itemBarcode: item.itemBarcode,
      itemName: item.itemName,
      quantity: item.quantity,
    }));

    const transactionDetails = {
      userID,
      userName,
      contactNumber,
      items: itemsToSubmit,
      courseSubject,
      professor,
      roomNo,
      borrowedDuration,
      transactionType,
      dateTime: new Date().toISOString(),
    };

    // Log the transaction details
    console.log('Contact Number:', contactNumber);
    console.log('Transaction Details:', JSON.stringify(transactionDetails, null, 2));

    try {
      const response = await axios.post('/api/borrow-return/log', transactionDetails);
      if (response.status === 201) {
        console.log('Transaction logged successfully:', response.data);
        navigate('/borrow-success', { state: transactionDetails });
      } else {
        setErrorMessage('Error processing the transaction.');
        console.error('Transaction logging error:', response);
      }
    } catch (error) {
      setErrorMessage('Failed to log the transaction.');
      console.error('Error during transaction logging:', error);
    }
  };

  return (
    <div className="item-scan">
      <h2>Scan Items to Borrow</h2>

      <form onSubmit={handleBarcodeScan}>
        <div className="input-group">
          <label>Barcode:</label>
          <input
            type="text"
            ref={barcodeInputRef}
            value={currentBarcode}
            onChange={(e) => setCurrentBarcode(e.target.value)}
            placeholder="Scan or enter barcode"
            required
          />
          <button type="submit" disabled={!currentBarcode}>
            Scan
          </button>
        </div>

        {itemDetails && (
          <div className="item-details">
            <p>Item: {itemDetails.itemName}</p>
            {itemDetails.image && (
              <img
                src={`http://localhost:4000${itemDetails.image}`}
                alt={itemDetails.itemName}
                className="item-image"
                onError={(e) => {
                  e.target.src = '/path/to/placeholder.png';
                  e.target.onError = null; // Prevent infinite loop
                }}
              />
            )}
          </div>
        )}

        {itemDetails && (
          <>
            <div className="input-group">
              <label>Quantity:</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                placeholder="Enter quantity"
                min="1"
                required
              />
            </div>

            <div className="actions">
              <button type="button" onClick={handleAddItem} disabled={!itemDetails || !quantity}>
                Add Item
              </button>
              <button type="button" onClick={resetFields}>Cancel</button>
            </div>
          </>
        )}

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {quantityExceededMessage && <p className="error-message">{quantityExceededMessage}</p>}
      </form>

      <h3>Scanned Items</h3>
      <ul className="scanned-items-list">
        {scannedItems.map((item, index) => (
          <li key={index} className="scanned-item">
            <span>{item.itemName}</span>
            <span>x {item.quantity}</span>
            <button onClick={() => handleDeleteItem(item.itemBarcode)}>Remove</button>
          </li>
        ))}
      </ul>

      {scannedItems.length > 0 && (
        <div className="submit-section">
          <button onClick={handleSubmit}>Submit Transaction</button>
        </div>
      )}
    </div>
  );
};

export default ItemScan;
