import "./singleUser.scss"
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';


const SingleUser = () => {
  const { userId } = useParams(); // Use 'userId' to match route parameter
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // New state for delete confirmation
  const navigate = useNavigate(); // Use navigate for redirecting after delete

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`/api/users/${userId}`); // Use 'userId' in URL
      setUser(response.data);
      setUpdatedUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error.response ? error.response.data : error.message);
    }
  };

  const handleEditClick = () => {
    setIsEditing((prev) => !prev);
  };

  const handleInputChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`/api/users/${userId}`, updatedUser); // Use 'userId' in URL
      if (response.status === 200) {
        setIsEditing(false);
        fetchUser(); // Refresh user details after saving
      } else {
        console.error('Error updating user:', response);
      }
    } catch (error) {
      console.error('Error saving user:', error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirmation(true); // Show confirmation dialog
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/users/${userId}`); // Send delete request
      navigate('/users'); // Redirect to user list or another page after deletion
    } catch (error) {
      console.error('Error deleting user:', error.response ? error.response.data : error.message);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="singleUser">
      <div className={`singleUserContainer ${isEditing ? "editing" : ""}`}>
        <div className="userShow">
          <div className="userHeader">
            <h1 className="userTitle">User Profile</h1>
            <div>
              <button className="userEditButton" onClick={handleEditClick}>
                {isEditing ? "Close" : "Edit"}
              </button>
              <button className="userDeleteButton" onClick={handleDeleteClick}>Delete</button>
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
            <p><strong>Program:</strong> {user.program}</p>
            <p><strong>Year & Section:</strong> {user.yearAndSection}</p>
            <p><strong>Student No:</strong> {user.studentNo}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Contact Number:</strong> {user.contactNumber}</p>
            <p>
              <strong>
                <a href={user.registrationCard} target="_blank" rel="noopener noreferrer" className="link">
                  Registration Card Link
                </a>
              </strong>
            </p>
            <p>
              <strong>
                <a href={user.updatedClassSchedule} target="_blank" rel="noopener noreferrer" className="link">
                  Updated Class Schedule Link
                </a>
              </strong>
            </p>
          </div>
        </div>

        {isEditing && (
          <div className="userUpdate show">
            {/* Form for editing */}
            <h2>Edit User Information</h2>
            <form>
              <label>
                Gender:
                <input type="text" name="gender" value={updatedUser.gender} onChange={handleInputChange} />
              </label>
              <label>
                Address:
                <input type="text" name="address" value={updatedUser.address} onChange={handleInputChange} />
              </label>
              <label>
                Program:
                <input type="text" name="program" value={updatedUser.program} onChange={handleInputChange} />
              </label>
              <label>
                Year & Section:
                <input type="text" name="yearAndSection" value={updatedUser.yearAndSection} onChange={handleInputChange} />
              </label>
              <label>
                Student No:
                <input type="text" name="studentNo" value={updatedUser.studentNo} onChange={handleInputChange} />
              </label>
              <label> 
                Email:
                <input type="email" name="email" value={updatedUser.email} onChange={handleInputChange} />
              </label>
              <label>
                Contact Number:
                <input type="text" name="contactNumber" value={updatedUser.contactNumber} onChange={handleInputChange} />
              </label>
              <label>
                Registration Card Link:
                <input type="text" name="registrationCard" value={updatedUser.registrationCard} onChange={handleInputChange} />
              </label>
              <label>
                Updated Class Schedule Link:
                <input type="text" name="updatedClassSchedule" value={updatedUser.updatedClassSchedule} onChange={handleInputChange} />
              </label>
              <button type="button" onClick={handleSave}>Save</button>
            </form>
          </div>
        )}
      </div>

      {showDeleteConfirmation && (
        <div className="deleteConfirmation">
          <p>Are you sure you want to delete this user?</p>
          <button onClick={handleDeleteConfirm}>Yes, Delete</button>
          <button onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default SingleUser;
