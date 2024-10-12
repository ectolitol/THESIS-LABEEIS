import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { CircularProgress, TextField, MenuItem, Select, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox } from '@mui/material';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from 'xlsx';
import './reportList.scss';

const ReportsList = ({ itemId }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedFields, setSelectedFields] = useState([]);

  const fields = [
    { label: 'Item Name', field: 'itemName' },
    { label: 'Item Barcode', field: 'itemBarcode' },
    { label: 'Issue', field: 'issue' },
    { label: 'Reported By', field: 'reportedBy' },
    { label: 'Priority', field: 'priority' },
    { label: 'Status', field: 'status' },
    { label: 'Date Reported', field: 'date' }
  ];

  // Fetch reports for a specific item
  useEffect(() => {
    const fetchReports = async () => {
      try {
        console.log('Fetching reports...');
        const response = await axios.get(`/api/reports/all-report`);
        console.log('Reports fetched:', response.data);
        setReports(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching reports:', error.message);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchReports();
  }, [itemId]);

  // Function to handle status change
  const handleStatusChange = async (event, reportId) => {
    const newStatus = event.target.value;
    try {
      await axios.put(`/api/reports/${reportId}/status`, { status: newStatus });
      const response = await axios.get(`/api/reports/all-report`);
      setReports(response.data);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Define columns for the DataGrid (including dropdown for status)
  const columns = [
    { field: 'itemName', headerName: 'Item Name', width: 200 },
    { field: 'itemBarcode', headerName: 'Item Barcode', width: 200 },
    { field: 'issue', headerName: 'Issue', width: 300 },
    { field: 'reportedBy', headerName: 'Reported By', width: 200 },
    { field: 'priority', headerName: 'Priority', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      renderCell: (params) => (
        <Select
          value={params.row.status}
          onChange={(e) => handleStatusChange(e, params.row.id)}
          className="statusSelect"
        >
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="reviewed">Reviewed</MenuItem>
          <MenuItem value="resolved">Resolved</MenuItem>
        </Select>
      ),
    },
    { field: 'date', headerName: 'Date Reported', width: 200 },
  ];

  // Transform the reports data to match the DataGrid structure
  const rows = reports.map((report) => ({
    id: report._id,
    itemName: report.itemId.itemName,
    itemBarcode: report.itemId.itemBarcode,
    issue: report.issue,
    reportedBy: report.reportedBy,
    priority: report.priority,
    status: report.status,
    date: new Date(report.date).toLocaleString(),
  }));

  // Filter the rows based on the search query
  const filteredRows = rows.filter((row) =>
    Object.values(row)
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Render loading spinner or error message
  if (loading) return <CircularProgress className="circularProgress" />;
  if (error) return <p className="errorMessage">Error fetching reports: {error}</p>;

  // Export Functions
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredRows.map((row) => {
        const data = {};
        selectedFields.forEach((field) => {
          data[field] = row[field] || 'N/A';
        });
        return data;
      })
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");
    XLSX.writeFile(workbook, "ReportsExport.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.text("Reports Export", 14, 10);

    const data = filteredRows.map((row) => {
      return selectedFields.map((field) => row[field] || 'N/A');
    });

    doc.autoTable({
      head: [selectedFields],
      body: data,
      startY: 20,
    });

    doc.save("ReportsExport.pdf");
  };

  const handleExport = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);
  const handleFieldChange = (fieldName) => {
    setSelectedFields(prev => prev.includes(fieldName)
      ? prev.filter(f => f !== fieldName)
      : [...prev, fieldName]
    );
  };

  return (
    <div className="reportsTableContainer">
    {/* Title */}
    <h3 className="reportTitlee">Submitted Report</h3>
  
    {/* Search and Export Bar */}
    <div className="searchExportContainer">
      <TextField
        label="Search Reports"
        variant="outlined"
        margin="normal"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Update search query as user types
        className="searchBar"
      />
  
      {/* Export Button */}
      <Button color="primary" onClick={handleExport} className="export-report-button">
        EXPORT
      </Button>
    </div>
  
    {/* DataGrid */}
    <DataGrid
      rows={filteredRows}
      columns={columns}
      pageSize={10}
      getRowId={(row) => row.id} // Ensure each row has a unique id
    />
  
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
  </div>
  
  );
};

export default ReportsList;
