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
import TextField from '@mui/material/TextField'; // Import TextField
import { useNavigate } from 'react-router-dom';

const UserTable = () => {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [actionType, setActionType] = React.useState('');
  const [declineReason, setDeclineReason] = React.useState('');
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  // Define table columns
  const columns = [
    { field: '_id', headerName: 'ID', minWidth: 230 },
    { field: 'fullName', headerName: 'Full Name', minWidth: 250 },
    { field: 'studentNo', headerName: 'Student No', minWidth: 180 },
    { field: 'program', headerName: 'Program', minWidth: 200 },
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
              className="view-button"
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
                  variant="contained"
                  className="decline-button"
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

  // Fetch user data from API
  const fetchData = async () => {
    try {
      const response = await axios.get('/api/users');
      setRows(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Approve or Decline action
  const handleAction = async () => {
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
    }
  };

  // Handle decline reason change
  const handleDeclineReasonChange = (event) => {
    setDeclineReason(event.target.value);
  };

  // Close the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDeclineReason('');
    setError('');
  };

  // Fetch data when component mounts
  React.useEffect(() => {
    fetchData();
  }, []);

  // Pagination settings
  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden', height: '100%' }}>
        <div style={{ height: 520, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10, 20]}
            checkboxSelection
            loading={loading}
            getRowId={(row) => row._id}
            className="user-table-grid"
          />
        </div>
      </Paper>

      {/* Dialog for Approve/Decline */}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleAction}
            color="secondary"
          >
            {actionType === 'approve' ? 'Approve' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}; 

export default UserTable;
