import "./itemTable.scss";
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Define the base URL of your backend server
const BASE_URL = 'http://localhost:4000'; // Update with your actual backend URL

export const ItemTable = () => {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  // Fetch items from the backend
  React.useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`/api/items`); 
        setRows(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching items:", err);
        setLoading(false);
      }
    };

    fetchItems();
  }, []); 

  // Define columns for the DataGrid
  const columns = [
    { field: 'itemBarcode', headerName: 'Barcode', minWidth: 150 },
    { field: 'itemName', headerName: 'Item Name', minWidth: 200 },
    {
      field: 'image',
      headerName: 'Image',
      minWidth: 150,
      renderCell: (params) => (
        <img
          src={params.value ? `${BASE_URL}${params.value}` : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"}
          alt="item"
          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
        />
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      minWidth: 150,
      renderCell: (params) => {
        // Safely access the categoryName inside category object
        return params.row?.category?.categoryName || 'N/A';
      },
    },
    
    { field: 'quantity', headerName: 'Quantity Left', minWidth: 110 },
    { field: 'location', headerName: 'Location', minWidth: 150 },
    { field: 'condition', headerName: 'Condition', minWidth: 130 },
    {
      field: 'action',
      headerName: 'Action',
      width: 149,
      renderCell: (params) => (
        <Button 
          className="view-button"
          variant="outlined"
          color="primary"
          onClick={() => navigate(`/items/${params.row._id}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <Paper className="itemTable">
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
    </Paper>
  );
};
