import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './userDetails.scss';

const UserDetails = ({ onUserDetailsSubmit, userID, userName, transactionType }) => { // Accept userName as a prop
  const navigate = useNavigate();

  const [courseSubject, setCourseSubject] = useState('');
  const [professor, setProfessor] = useState('');
  const [roomNo, setRoomNo] = useState('');
  const [borrowedDuration, setBorrowedDuration] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data to send
    const userDetails = {
      userID, // Now this should have the correct userID
      userName, // Include userName
      transactionType, // This should now have the correct transactionType
      courseSubject,
      professor,
      roomNo,
      borrowedDuration,
    };

    // Log userDetails to see if values are saved correctly
    console.log('User Details Submitted:', userDetails);

    // Pass user details to the parent component
    onUserDetailsSubmit(userDetails);

    // Navigate to item scan page
    navigate('/item-scan', { state: userDetails });
  };

  return (
    <div className="user-details">
      <h2>Enter User Details</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Course Subject:</label>
          <input
            type="text"
            value={courseSubject}
            onChange={(e) => setCourseSubject(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Professor:</label>
          <input
            type="text"
            value={professor}
            onChange={(e) => setProfessor(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Room No:</label>
          <input
            type="text"
            value={roomNo}
            onChange={(e) => setRoomNo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Borrowed Duration:</label>
          <input
            type="text"
            value={borrowedDuration}
            onChange={(e) => setBorrowedDuration(e.target.value)}
            required
          />
        </div>
        <button type="submit">Continue</button>
      </form>
    </div>
  );
};

export default UserDetails;
