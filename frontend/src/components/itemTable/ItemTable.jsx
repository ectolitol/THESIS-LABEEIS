import "./itemTable.scss";
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { imageBaseURL } from '../../config/axiosConfig';

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
    { field: 'itemName', headerName: 'Name', minWidth: 200 },
    {
      field: 'image',
      headerName: 'Image',
      minWidth: 150,
      renderCell: (params) => {
        // Ensure there's no double slash when concatenating
        const imageUrl = params.value 
          ? `${imageBaseURL.replace(/\/$/, '')}/${params.value.replace(/^\//, '')}`
          : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg";
    
        return (
          <img
            src={imageUrl}
            alt="item"
            style={{ width: '70px', height: '70px', objectFit: 'cover' }}
          />
        );
      },
    },
    {
      field: 'barcodeImage',
      headerName: 'Barcode',
      minWidth: 170,
      renderCell: (params) => {
        // Check if barcodeImage exists and render it as an image
        if (params.value) {
          return (
            <img
              src={`data:image/png;base64,${params.value}`} // Render base64 barcode image
              alt="Barcode"
              style={{ width: '145px', height: '50px', objectFit: 'cover' }}
            />
          );
        } else {
          return <p>No Barcode</p>;
        }
      },
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
    { field: 'condition', headerName: 'Status', minWidth: 130 },
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
