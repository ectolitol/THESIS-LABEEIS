import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import "./UserRegistration.scss";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const UserRegistration = () => { 
  // State to store form data
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    address: "",
    studentNo: "",
    program: "",
    yearAndSection: "",
    email: "",
    contactNumber: "", 
    registrationCard: "",
    updatedClassSchedule: ""
  });
 
  // State for error messages
  const [errors, setErrors] = useState([]);

  // State to control success dialog visibility
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();

        // Assuming the response contains information about the user's authentication status
        if (data.isAuthenticated) {
          navigate('/users/registrationSuccessful');
        } else {
          // Show the dialog for successful registration
          setOpenDialog(true);
        }
      } else {
        const data = await response.json();
        if (data.errors) {
          // Display multiple error messages
          setErrors(data.errors);
        } else {
          setErrors(['Error registering user']);
        }
      }
    } catch (error) {
      setErrors(['Error connecting to the server.']);
    }
  };

  // Handle closing the dialog and navigating
  const handleCloseDialog = () => {
    setOpenDialog(false);
    navigate('/EELMS');
  };

  // Handle going back to the previous page
  const handleGoBack = () => {
    navigate(-1); // This will navigate to the previous page
  };

  return (
    <div className="userRegistration">
      <div className="newUserTitle">NEW USER REGISTRATION</div>

      <form className="newUserForm" onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="newUserItem">
          <label>Full Name: </label>
          <input
            type="text"
            name="fullName"
            placeholder="FN MI LN"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Gender */}
        <div className="newUserItem">
          <label>Gender: </label>
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Others">Prefer Not to Say</option>
          </select>
        </div>

        {/* Address */}
        <div className="newUserItem">
          <label>Address: </label>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        {/* Student Number */}
        <div className="newUserItem">
          <label>Student Number: </label>
          <input
            type="text"
            name="studentNo"
            placeholder="20**-*****-MN-*"
            value={formData.studentNo}
            onChange={handleChange}
            required
          />
        </div>

        {/* Program */}
        <div className="newUserItem">
          <label>Program: </label>
          <input
            type="text"
            name="program"
            placeholder="Program"
            value={formData.program}
            onChange={handleChange}
            required
          />
        </div>

        {/* Year & Section */}
        <div className="newUserItem">
          <label>Year & Section: </label>
          <input
            type="text"
            name="yearAndSection"
            placeholder="Year & Section"
            value={formData.yearAndSection}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="newUserItem">
          <label>Email: </label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Contact Number */}
        <div className="newUserItem">
          <label>Contact Number: </label>
          <input
            type="text"
            name="contactNumber"
            placeholder="639XXXXXXXXX"
            value={formData.contactNumber}
            onChange={handleChange}
            required
          />
        </div>

        {/* Registration Card */}
        <div className="newUserItem">
          <label>Registration Card: </label>
          <input
            type="text"
            name="registrationCard"
            placeholder="Link to registration card"
            value={formData.registrationCard}
            onChange={handleChange}
            required
          />
        </div>

        {/* Updated Class Schedule */}
        <div className="newUserItem">
          <label>Updated Class Schedule: </label>
          <input
            type="text"
            name="updatedClassSchedule"
            placeholder="Link to class schedule"
            value={formData.updatedClassSchedule}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="submitButton">Register</button>

        {/* Back Button */}
        <button type="button" className="backButton" onClick={handleGoBack}>Back</button>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="message">
            {errors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        )}
      </form>

      {/* Success Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Registration Successful</DialogTitle>
        <DialogContent>
          <p>Your registration was successful. You will be redirected.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div> 
  );
};

export default UserRegistration;
