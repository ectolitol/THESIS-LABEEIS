import "./itemTable.scss";
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from 'xlsx';
import { Dialog, DialogActions, DialogContent, DialogTitle, Checkbox, FormControlLabel, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

import { imageBaseURL } from '../../config/axiosConfig';

export const ItemTable = () => {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedFields, setSelectedFields] = React.useState([]);  // Track selected field names (strings)
  const [selectedLocation, setSelectedLocation] = React.useState('');  // Track the selected location
  const [locations, setLocations] = React.useState([]);  // Store unique locations
  const navigate = useNavigate();

  // Define available fields for export, including barcode
  const fields = [
    { label: 'Name', field: 'itemName' },
    { label: 'Item Barcode', field: 'itemBarcode' }, 
    { label: 'Category', field: 'category' },
    { label: 'Quantity', field: 'quantity' },
    { label: 'Location', field: 'location' },
    { label: 'Status', field: 'condition' },
    { label: 'Brand', field: 'brand' },
    { label: 'Model', field: 'model' },
    { label: 'Manufacturer', field: 'manufacturer' },
    { label: 'Serial Number', field: 'serialNumber' },
    { label: 'PUP Property Number', field: 'pupPropertyNumber' },
    { label: 'Specification', field: 'specification' },
    { label: 'Barcode', field: 'barcodeImage' }, 
    { label: 'Notes/Comments', field: 'notesComments' }
  ];

  // Fetch items from the server (populating category)
  React.useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('/api/items'); // Assume backend handles population
        setRows(response.data);

        // Extract unique locations for filtering dropdown
        const uniqueLocations = [...new Set(response.data.map(item => item.location))];
        setLocations(uniqueLocations);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching items:", err);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const columns = [
    { field: 'itemName', headerName: 'Name', minWidth: 200 },
    {
      field: 'image',
      headerName: 'Image',
      minWidth: 150,
      renderCell: (params) => {
        const imageUrl = params.value 
          ? `${imageBaseURL.replace(/\/$/, '')}/${params.value.replace(/^\//, '')}`
          : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg";

        return (
          <div className="table-cell-image">
            <img src={imageUrl} alt="item" className="item-image" />
          </div>
        );
      },
    },
    {
      field: 'barcodeImage',
      headerName: 'Barcode',
      minWidth: 170,
      renderCell: (params) => {
        return params.value ? (
          <div className="table-cell-barcode">
            <img src={`data:image/png;base64,${params.value}`} alt="Barcode" className="item-barcode" />
          </div>
        ) : <p>No Barcode</p>;
      },
    },
    { field: 'category', headerName: 'Category', minWidth: 150, renderCell: (params) => params.row?.category?.categoryName || 'N/A' },
    { field: 'quantity', headerName: 'Quantity Left', minWidth: 110 },
    { field: 'location', headerName: 'Location', minWidth: 150 },
    { field: 'condition', headerName: 'Status', minWidth: 130 },
    {
      field: 'action',
      headerName: 'Action',
      width: 149,
      renderCell: (params) => (
        <Button variant="outlined" color="primary" onClick={() => navigate(`/items/${params.row._id}`)}>
          View Details
        </Button>
      ),
    },
  ];

  // Handle location change from the dropdown
  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  // Open the field selection modal
  const handleExport = () => setOpenModal(true);

  const handleModalClose = () => setOpenModal(false);

  const handleFieldChange = (fieldName) => {
    setSelectedFields(prev => prev.includes(fieldName)
      ? prev.filter(f => f !== fieldName)
      : [...prev, fieldName]
    );
  };

  // Filter rows based on selected location before exporting
  const filteredRows = selectedLocation
    ? rows.filter(row => row.location === selectedLocation)
    : rows;

 // Export to Excel based on selected fields and location
 const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(
    filteredRows.map((row) => {
      const data = {};
      selectedFields.forEach((field) => {
        if (field === 'category') {
          data['Category'] = row.category ? row.category.categoryName : 'N/A';  // Ensure categoryName is accessed
        } else if (field === 'itemBarcode') {
          data['Barcode'] = row.itemBarcode || 'No Barcode'; // Use itemBarcode instead of barcodeImage
        } else {
          data[field] = row[field] || 'N/A';
        }
      });
      return data;
    })
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Items");
  XLSX.writeFile(workbook, "ItemTableExport.xlsx");
};

  // Export to PDF based on selected fields and location
const exportToPDF = () => {
  const doc = new jsPDF({ orientation: 'landscape' });
  doc.text("Item Table Export", 14, 10);

  const data = filteredRows.map((row) => {
    return selectedFields.map((field) => {
      if (field === 'category') {
        return row.category ? row.category.categoryName : 'N/A';  // Access category name
      } else if (field === 'barcodeImage') {
        return row.barcodeImage ? " " : "No Barcode";  // Add " " to manually insert barcode image later
      }
      return row[field] || 'N/A';
    });
  });

  doc.autoTable({
    head: [selectedFields.map(field => field.charAt(0).toUpperCase() + field.slice(1))], // Capitalize headers
    body: data,
    startY: 20,
    didDrawCell: (data) => {
      // Adjust row height to accommodate barcode
      if (selectedFields.includes('barcodeImage') && data.column.index === selectedFields.indexOf('barcodeImage')) {
        const barcode = filteredRows[data.row.index].barcodeImage;
        if (barcode) {
          const barcodeWidth = 20;  // Adjust the width here
          const barcodeHeight = 8; // Adjust the height here to maintain aspect ratio
          const cellPadding = 5; // Add padding to avoid overlap

          // Draw the barcode image at the correct position with padding
          doc.addImage(
            `data:image/png;base64,${barcode}`,
            'PNG',
            data.cell.x + cellPadding, // Add padding to x position
            data.cell.y + cellPadding, // Add padding to y position
            barcodeWidth,
            barcodeHeight
          );
        }
      }
    },
    styles: {
      cellPadding: { top: 8, bottom: 5 } // Increase cell padding to prevent overlapping
    }
  });

  doc.save("ItemTableExport.pdf");
};

  // Pagination settings
  const paginationModel = { page: 0, pageSize: 5 };
  
  return (
<Paper className="itemTable">
  <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}> {/* Container allowing dynamic height */}
    <div className="export-controls" style={{ marginBottom: '10px' }}>
      {/* Dropdown for location filtering */}
      <FormControl className="export-select">
        <InputLabel id="location-label"></InputLabel>
        <Select
          labelId="location-label"
          value={selectedLocation}
          onChange={handleLocationChange}
          displayEmpty
        >
          <MenuItem value=""><em>All Locations</em></MenuItem>
          {locations.map((loc) => (
            <MenuItem key={loc} value={loc}>{loc}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Button to customize export */}
      <Button className="export-item-button" onClick={handleExport}>
        EXPORT
      </Button>
    </div>

    {/* DataGrid */}
    <DataGrid
       rows={rows}
       columns={columns}
       initialState={{ pagination: { paginationModel } }}
       pageSizeOptions={[5, 10, 20]}
       checkboxSelection
       loading={loading}
       getRowId={(row) => row._id}
       style={{ flex: 1 }}
    />
  </div>

  {/* Modal for selecting export fields */}
  <Dialog open={openModal} onClose={handleModalClose}>
    <DialogTitle>Select Fields to Export</DialogTitle>
    <DialogContent>
      {fields.map((field) => (
        <FormControlLabel
          key={field.field}
          control={<Checkbox checked={selectedFields.includes(field.field)} onChange={() => handleFieldChange(field.field)} />}
          label={field.label}
        />
      ))}
    </DialogContent>
    <DialogActions>
      <Button onClick={() => { exportToExcel(); handleModalClose(); }} color="primary">Export to Excel</Button>
      <Button onClick={() => { exportToPDF(); handleModalClose(); }} color="secondary">Export to PDF</Button>
      <Button onClick={handleModalClose}>Cancel</Button>
    </DialogActions>
  </Dialog>
</Paper>


  );
};
