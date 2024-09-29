import "./categoryTable.scss";
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';

export const CategoryTable = () => {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [updatedCategory, setUpdatedCategory] = React.useState({});
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const navigate = useNavigate();

  // Fetch categories from the backend
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`/api/categories`);
        setRows(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleEditClick = (id) => {
    const category = rows.find(row => row._id === id);
    setSelectedCategory(id);
    setUpdatedCategory(category);
    setIsEditing(true);
  };

  const handleCloseDrawer = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    setUpdatedCategory({ ...updatedCategory, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`/api/categories/${selectedCategory}`, updatedCategory);
      setRows(rows.map(row => (row._id === selectedCategory ? updatedCategory : row)));
      handleCloseDrawer();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDelete = (id) => {
    setSelectedCategory(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/categories/${selectedCategory}`);
      setRows(rows.filter(row => row._id !== selectedCategory));
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const cancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  const columns = [
    { field: '_id', headerName: 'ID', minWidth: 250 },
    { field: 'categoryName', headerName: 'Category Name', minWidth: 250 },
    { field: 'itemCount', headerName: 'Item Count', minWidth: 150 },
    {
      field: 'action',
      headerName: 'Action',
      width: 350,
      renderCell: (params) => (
        <div>
          <Button
            className="view-button"
            variant="outlined"
            color="primary"
            onClick={() => navigate(`/categories/${params.row._id}`)}
          >
            View Details
          </Button>
          <Button
            className="edit-button"
            variant="outlined"
            color="secondary"
            onClick={() => handleEditClick(params.row._id)}
          >
            Edit
          </Button>
          <Button
            className="delete-button"
            variant="outlined"
            color="error"
            onClick={() => handleDelete(params.row._id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <Paper className="categoryTable">
      <div style={{ height: 520, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          getRowId={(row) => row._id}
          pageSize={10}
          loading={loading}
        />
      </div>

      {/* Edit Drawer */}
      <Drawer
        anchor="right"
        open={isEditing}
        onClose={handleCloseDrawer}
        PaperProps={{
          sx: { width: { xs: '100%', sm: '400px' } },
        }}
      >
        <div className="drawerContent">
          <div className="drawerHeader">
            <h2>Edit Category</h2>
            <Button className="closeButton" onClick={handleCloseDrawer}>✖</Button>
          </div>
          <form className="editForm">
            <TextField
              label="Category Name"
              name="categoryName"
              value={updatedCategory.categoryName || ''}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            
            <Button type="button" onClick={handleSave} color="primary">Save</Button>
          </form>
        </div>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={cancelDelete}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this category?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CategoryTable;
