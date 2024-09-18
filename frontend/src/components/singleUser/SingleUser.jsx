import "./singleUser.scss";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const SingleUser = () => {
  const { userId } = useParams(); // Use 'userId' to match route parameter
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Drawer state
  const [updatedUser, setUpdatedUser] = useState({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`/api/users/${userId}`);
      setUser(response.data);
      setUpdatedUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error.response ? error.response.data : error.message);
    }
  };

  const handleEditClick = () => {
    setIsEditing((prev) => !prev); // Toggle drawer visibility
  };

  const handleInputChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`/api/users/${userId}`, updatedUser);
      if (response.status === 200) {
        setIsEditing(false);
        fetchUser();
      }
    } catch (error) {
      console.error('Error saving user:', error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/users/${userId}`);
      navigate('/users');
    } catch (error) {
      console.error('Error deleting user:', error.response ? error.response.data : error.message);
    }
  };

  if (!user) return <div>Loading...</div>;

  const formatDate = (date) => new Date(date).toLocaleDateString();

  return (
    <div className="singleUser">
      <div className="singleUserContainer">
        <div className="userShow">
          <div className="userHeader">
              <h1 className="userTitle">User Profile</h1>
              <div className="buttonGroup">
                <Button className="userEditButton" onClick={handleEditClick}>
                  {isEditing ? "Close" : "Edit"}
                </Button>
                <Button className="userDeleteButton" onClick={handleDeleteClick}>Delete</Button>
              </div>
          </div>

          <div className="userInfo">
            <PersonRoundedIcon className="userIcon" />
            <div className="userDetailsTop">
              <p>{user.fullName}</p>
              <h4>id: {user._id}</h4>
            </div>
          </div>

          <div className="userDetailsBottom">
            <p><strong>Gender:</strong> {user.gender}</p>
            <p><strong>Address:</strong> {user.address}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Year & Section:</strong> {user.yearAndSection}</p>
            <p><strong>Student No:</strong> {user.studentNo}</p>
            <p><strong>Program:</strong> {user.program}</p>
            <p><strong>Contact Number:</strong> {user.contactNumber}</p>
            <p>
              <strong>
                <a href={user.registrationCard} target="_blank" rel="noopener noreferrer" className="link">
                  Registration Card
                </a>
              </strong>
            </p>
            <p>
              <strong>
                <a href={user.updatedClassSchedule} target="_blank" rel="noopener noreferrer" className="link">
                  Updated Class Schedule
                </a>
              </strong>
            </p>
            <p><strong>Date Registered:</strong> {formatDate(user.createdAt)}</p>
            <p><strong>Date Updated:</strong> {formatDate(user.updatedAt)}</p>
          </div>
        </div>

        {/* Drawer component */}
        <Drawer
          anchor="right"
          open={isEditing}
          onClose={handleEditClick}
          PaperProps={{
            sx: { width: { xs: '100%', sm: '400px' } },  // Full width on small screens, 400px on larger
          }}>
          <div className="drawerContent">
            <div className="drawerHeader">
              <h2>Edit User</h2>
              <Button className="closeButton" onClick={handleEditClick}>✖</Button>
            </div>
            <form className="editForm">
              <TextField
                label="Gender"
                name="gender"
                value={updatedUser.gender || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Address"
                name="address"
                value={updatedUser.address || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Program"
                name="program"
                value={updatedUser.program || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Year & Section"
                name="yearAndSection"
                value={updatedUser.yearAndSection || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Student No"
                name="studentNo"
                value={updatedUser.studentNo || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                value={updatedUser.email || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Contact Number"
                name="contactNumber"
                value={updatedUser.contactNumber || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Registration Card"
                name="registrationCard"
                value={updatedUser.registrationCard || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Class Schedule"
                name="updatedClassSchedule"
                value={updatedUser.updatedClassSchedule || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <Button type="button" variant="contained" color="primary" onClick={handleSave}>
                Save
              </Button>
            </form>
          </div>
        </Drawer>

        {/* Delete confirmation modal */}
        {showDeleteConfirmation && (
          <div className="deleteConfirmation">
            <p>Are you sure you want to delete this user?</p>
            <Button className="yes" variant="contained" color="primary" onClick={handleDeleteConfirm}>Yes</Button>
            <Button className="no" variant="outlined" color="secondary" onClick={() => setShowDeleteConfirmation(false)}>No</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleUser;
