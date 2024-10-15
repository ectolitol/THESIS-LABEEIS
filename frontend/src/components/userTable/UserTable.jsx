import "./userTable.scss";
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from 'xlsx';
import { Checkbox, FormControlLabel, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const UserTable = () => {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [actionType, setActionType] = React.useState('');
  const [declineReason, setDeclineReason] = React.useState('');
  const [error, setError] = React.useState('');
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedFields, setSelectedFields] = React.useState([]);
  const [selectedStatus, setSelectedStatus] = React.useState('');
  const [statuses, setStatuses] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [actionLoading, setActionLoading] = React.useState(false);
  const navigate = useNavigate();

  const fields = [
      { label: 'ID', field: '_id' },
      { label: 'Full Name', field: 'fullName' },
      { label: 'Email', field: 'email' }, // Included email
      { label: 'Gender', field: 'gender' }, // Included gender
      { label: 'Address', field: 'address' }, // Included address
      { label: 'Student No', field: 'studentNo' },
      { label: 'Program', field: 'program' },
      { label: 'Year & Section', field: 'yearAndSection' },
      { label: 'Contact Number', field: 'contactNumber' }, // Included contact number
      { label: 'Registration Card', field: 'registrationCard' }, // Included registration card
      { label: 'Updated Class Schedule', field: 'updatedClassSchedule' }, // Included updated class schedule
      { label: 'Status', field: 'status' },
      { label: 'Notes/Comments', field: 'notesComments' } // Included notes/comments
    ];

  const columns = [
    { field: '_id', headerName: 'ID', minWidth: 230 },
    { field: 'fullName', headerName: 'Full Name', minWidth: 265 },
    { field: 'studentNo', headerName: 'Student No', minWidth: 180 },
    { field: 'program', headerName: 'Program', minWidth: 150 },
    { field: 'yearAndSection', headerName: 'Year & Section', minWidth: 120 },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 110,
      renderCell: (params) => (
        <span className={`status-cell ${params.value}`}>
          {params.value}
        </span>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 250,
      renderCell: (params) => {
        const handleOpenDialog = (action) => {
          setActionType(action);
          setSelectedUser(params.id);
          setOpenDialog(true);
        };

        const handleViewDetails = () => {
          navigate(`/users/${params.id}`);
        };

        return (
          <div className="actions-container">
            <Button
              onClick={handleViewDetails}
              variant="outlined"
              className="view-userlist-button"
            >
              View
            </Button>
            {params.row.status === 'Pending' && (
              <>
                <Button
                  onClick={() => handleOpenDialog('approve')}
                  variant="contained"
                  color="primary"
                  className="approve-button"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => handleOpenDialog('decline')}
                  variant="contained" className="decline-button"
                >
                  Decline
                </Button>
              </> 
            )}
          </div>
        );
      }
    }
  ];

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/users');
      setRows(response.data);

      // Extract unique statuses for filtering dropdown
      const uniqueStatuses = [...new Set(response.data.map(user => user.status))];
      setStatuses(uniqueStatuses);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    setActionLoading(true); // Start loading
    try {
      let response;

      if (actionType === 'approve') {
        response = await axios.put(`/api/users/approve/${selectedUser}`);
      } else if (actionType === 'decline') {
        response = await axios.put(`/api/users/decline/${selectedUser}`, { notesComments: declineReason });
      }

      if (response.status === 200) {
        console.log(`${actionType} action was successful.`);
        await fetchData();
        handleCloseDialog();
      } else {
        setError(`Error during ${actionType} action: ${response.statusText}`);
      }
    } catch (error) {
      setError(`Error during ${actionType} action: ${error.message}`);
    } finally {
      setActionLoading(false); // Stop loading after action is done
    }
  };

  const handleDeclineReasonChange = (event) => {
    setDeclineReason(event.target.value);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDeclineReason('');
    setError('');
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleLocationChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleExport = () => setOpenModal(true);

  const handleModalClose = () => setOpenModal(false);

  const handleFieldChange = (fieldName) => {
    setSelectedFields(prev => prev.includes(fieldName)
      ? prev.filter(f => f !== fieldName)
      : [...prev, fieldName]
    );
  };

  const filteredRows = rows.filter((row) => {
    const matchesStatus = selectedStatus ? row.status === selectedStatus : true;
    const matchesSearchTerm = searchTerm
      ? row.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.studentNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.program.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
  
    return matchesStatus && matchesSearchTerm;
  });
  

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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "UserTableExport.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.text("User Table Export", 14, 10);

    const data = filteredRows.map((row) => {
      return selectedFields.map((field) => row[field] || 'N/A');
    });

    doc.autoTable({
      head: [selectedFields],
      body: data,
      startY: 20,
    });

    doc.save("UserTableExport.pdf");
  };

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <Paper className="userTable" sx={{ width: '100%', overflow: 'hidden', height: '100%' }}>
      <div style={{ height: 520, width: '100%', display: 'flex', flexDirection: 'column' }}>
        <div className="export-controls" style={{ marginBottom: '10px' }}>
          
          {/* Search Bar */}
          <div className="search-user" >
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '4px 8px', fontSize: '14px', width: '200px', height: '30px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          {/* Button to customize export */}
          <Button className="export-user-button" onClick={handleExport}>
            Export
          </Button>
        </div>

         {/* DataGrid */}
        <DataGrid
          rows={filteredRows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10, 20]}
          checkboxSelection
          loading={loading}
          getRowId={(row) => row._id}
          style={{ flex: 1 }}
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#d9d9d9', // Change the background color of the header
              color: 'maroon', // Change the text color
              fontSize: '16px', // Change the font size
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 'bold',
            },
          }}
        />
      </div>

      {/* Modal for selecting export fields */}
      <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
    >
      <DialogTitle className="dialog-title">
        {actionType === 'approve' ? 'Approve User' : 'Decline User'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {actionType === 'approve'
            ? 'Are you sure you want to approve this user?'
            : 'Are you sure you want to decline this user?'}
        </DialogContentText>
        {actionType === 'decline' && (
          <TextField
            autoFocus
            margin="dense"
            id="declineReason"
            label="Reason"
            type="text"
            fullWidth 
            variant="standard"
            value={declineReason}
            onChange={handleDeclineReasonChange}
          />
        )}
        {error && <DialogContentText color="error">{error}</DialogContentText>}

        {/* Display Loading... text when action is being processed */}
        {actionLoading && (
          <DialogContentText style={{ color: 'blue', marginTop: '10px' }}>
            Loading...
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="primary" disabled={actionLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleAction}
          color="secondary"
          disabled={actionLoading} // Disable button if loading
        >
          {actionType === 'approve' ? 'Approve' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
    </Paper>
  );
};

export default UserTable;