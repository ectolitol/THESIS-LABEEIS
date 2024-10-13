import React from 'react';
import { useNavigate } from 'react-router-dom';
import './adminWelcome.scss'; // Admin-specific SCSS

const AdminWelcome = () => {
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    navigate('/login'); // Redirect to admin login page
  };

  return (
    <div className="admin-welcome-container">
      <img src="/ceafinal.png" alt="Background" className="bg-only" />

      <div className="admin-welcome-content-container">
        <div className="admin-welcome2-container">
          <h1>Admin Portal</h1>
          <h3>Electrical Engineering Laboratory Management System</h3>
        </div>
        <div className="admin-welcome-form-container">
          <button className="admin-welcome-button" onClick={handleAdminLogin}>
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminWelcome;
