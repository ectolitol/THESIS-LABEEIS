import "./singleItem.scss";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, TextField, MenuItem, Select, FormControl, InputLabel, Drawer, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

const BASE_URL = 'http://localhost:4000'; // Update this based on your setup

const SingleItem = () => {
  const { itemId } = useParams(); // Match route parameter
  const [item, setItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedItem, setUpdatedItem] = useState({});
  const [categories, setCategories] = useState([]); // Add state for categories
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (itemId) { 
      fetchItem();
    }
    fetchCategories(); // Fetch categories when the component mounts
  }, [itemId]);

  const fetchItem = async () => {
    try {
      const response = await axios.get(`/api/items/${itemId}`);
      setItem(response.data);
      setUpdatedItem(response.data);
    } catch (error) {
      console.error('Error fetching item:', error.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
    }
  };

  const handleEditClick = () => {
    setIsEditing(prev => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedItem(prev => ({
      ...prev,
      [name]: typeof value === 'string' ? value.trim() : value
    }));
  };

  const handleCategoryChange = (e) => {
    setUpdatedItem(prev => ({ ...prev, category: e.target.value }));
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`/api/items/${itemId}`, updatedItem);
      if (response.status === 200) {
        setIsEditing(false);
        fetchItem();
      }
    } catch (error) {
      console.error('Error saving item:', error.message);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/items/${itemId}`);
      navigate('/items');
    } catch (error) {
      console.error('Error deleting item:', error.message);
    }
  };

  if (!item) return <div>Loading...</div>;

  return (
    <div className="singleItem">
      <div className="singleItemContainer">
        <div className="itemShow">
          <div className="itemHeader">
            <h1 className="itemTitle">Item Details</h1>
            <div className="buttonGroup">
              <Button className="itemEditButton" onClick={handleEditClick}>
                {isEditing ? "Close" : "Edit"}
              </Button>
              <Button className="itemDeleteButton" onClick={handleDeleteClick}>Delete</Button>
            </div>
          </div>

          <div className="itemInfo">
            <img
              src={item.image ? `${BASE_URL}${item.image}` : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"}
              alt={item.itemName}
              className="itemImage"
            />
            <div className="itemDetailsTop">
              <p>{item.itemName}</p>
              <h4>Barcode: {item.itemBarcode}</h4>
            </div>
          </div>

          <div className="itemDetailsBottom">
            <p><strong>Category:</strong> {item.category?.categoryName || 'N/A'}</p>
            <p><strong>Brand:</strong> {item.brand || 'N/A'}</p>
            <p><strong>Model:</strong> {item.model || 'N/A'}</p>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Condition:</strong> {item.condition}</p>
            <p><strong>Location:</strong> {item.location}</p>
            <p><strong>Calibration Needed:</strong> {item.calibrationNeeded}</p>
            <p><strong>Calibration Due Date:</strong> {item.calibrationDueDate ? new Date(item.calibrationDueDate).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Calibration Status:</strong> {item.calibrationStatus}</p>
            <p><strong>Calibration Frequency:</strong> {item.calibrationFrequency}</p>
            <p><strong>Date Added:</strong> {new Date(item.createdAt).toLocaleDateString()}</p>
            <p><strong>Date Updated:</strong> {new Date(item.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="bottom2">
          <div className="descrip">
            <p><strong>Description:</strong> {item.description}</p>
            <p><strong>Notes/Comments:</strong> {item.notesComments || 'N/A'}</p>
          </div>
        </div>

        {/* Drawer component for editing */}
        <Drawer
          anchor="right"
          open={isEditing}
          onClose={handleEditClick}
          PaperProps={{ sx: { width: { xs: '100%', sm: '400px' } } }}
        >
          <div className="drawerContent">
            <div className="drawerHeader">
              <h2>Edit Item</h2>
              <Button className="closeButton" onClick={handleEditClick}>✖</Button>
            </div>
            <form className="editForm">
              <TextField
                label="Item Name"
                name="itemName"
                value={updatedItem.itemName || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              {/* Category Select JSX */}
              <FormControl fullWidth margin="normal">
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  value={updatedItem.category || ''}
                  onChange={handleCategoryChange}
                  label="Category"
                >
                  {categories.map(category => (
                    <MenuItem key={category._id} value={category._id}>
                      {category.categoryName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Brand"
                name="brand"
                value={updatedItem.brand || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Model"
                name="model"
                value={updatedItem.model || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                name="description"
                value={updatedItem.description || ''}
                onChange={handleInputChange}
                multiline
                rows={4}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Quantity"
                name="quantity"
                type="number"
                value={updatedItem.quantity || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="condition-label">Condition</InputLabel>
                <Select
                  labelId="condition-label"
                  name="condition"
                  value={updatedItem.condition || ''}
                  onChange={handleInputChange}
                  label="Condition"
                >
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="Excellent">Excellent</MenuItem>
                  <MenuItem value="Good">Good</MenuItem>
                  <MenuItem value="Fair">Fair</MenuItem>
                  <MenuItem value="Poor">Poor</MenuItem>
                  <MenuItem value="Defective">Defective</MenuItem>
                  <MenuItem value="Missing">Missing</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Location"
                name="location"
                value={updatedItem.location || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="calibration-needed-label">Calibration Needed</InputLabel>
                <Select
                  labelId="calibration-needed-label"
                  name="calibrationNeeded"
                  value={updatedItem.calibrationNeeded || ''}
                  onChange={handleInputChange}
                  label="Calibration Needed"
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Calibration Due Date"
                name="calibrationDueDate"
                type="date"
                value={updatedItem.calibrationDueDate || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="calibration-status-label">Calibration Status</InputLabel>
                <Select
                  labelId="calibration-status-label"
                  name="calibrationStatus"
                  value={updatedItem.calibrationStatus || ''}
                  onChange={handleInputChange}
                  label="Calibration Status"
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Overdue">Overdue</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Calibration Frequency</InputLabel>
                <Select
                  label="Calibration Frequency"
                  name="calibrationFrequency"
                  value={updatedItem.calibrationFrequency || ''}
                  onChange={handleInputChange}
                >
                  <MenuItem value="Daily">Daily</MenuItem>
                  <MenuItem value="Weekly">Weekly</MenuItem>
                  <MenuItem value="Monthly">Monthly</MenuItem>
                  <MenuItem value="Quarterly">Quarterly</MenuItem>
                  <MenuItem value="Annually">Annually</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>

              <Button onClick={handleSave} fullWidth variant="contained" color="primary">
                Save Changes
              </Button>
            </form>
          </div>
        </Drawer>

        {/* Dialog for delete confirmation */}
        <Dialog open={showDeleteConfirmation} onClose={() => setShowDeleteConfirmation(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to delete this item?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDeleteConfirmation(false)}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="secondary">Delete</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default SingleItem;
