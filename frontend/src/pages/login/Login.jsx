import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  // Check if user is already authenticated when the component mounts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/admin/check', { withCredentials: true });
        if (response.status === 200) {
          // If already authenticated, redirect to the home page
          navigate('/');
        }
      } catch (error) {
        // If not authenticated, stay on the login page
        console.log('User not authenticated', error);
      } finally {
        setLoading(false); // Set loading to false once the check is done
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading true while logging in
    console.log('Attempting to log in with:', { email, password }); // Log email and password (omit in production)
  
    try {
      const response = await axios.post('/api/admin/login', { email, password }, { withCredentials: true });
      console.log('Login response:', response.data);
      setMessage(response.data.message);
      navigate('/select-profile'); // Redirect to select admin profile after login
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        console.log('Error response data:', error.response.data);
        console.log('Error status:', error.response.status);
        console.log('Error headers:', error.response.headers);
      }
      setMessage(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false); // Set loading to false after login attempt
    }
  };
  

  if (loading) {
    return <div>Loading...</div>; // Show loading message or spinner
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;