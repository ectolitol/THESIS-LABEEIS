import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SelectAdmin = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        console.log('Fetching admin profiles...');
        const response = await axios.get('/api/admin/profiles'); // Adjust the endpoint as necessary
        console.log('Fetched profiles:', response.data);
        setProfiles(response.data);
      } catch (err) {
        setError('Error fetching admin profiles');
        console.error('Error fetching admin profiles:', err);
      } finally {
        setLoading(false);
        console.log('Loading completed');
      }
    };
    fetchProfiles();
  }, []);

  const handleSelectProfile = async (profileId) => {
    try {
      console.log('Selecting profile with ID:', profileId);
      const response = await axios.post('/api/admin/select-profile', { profileId });
      console.log('Profile selected:', response.data.profile);
      // Optionally store the profile info in context or global state
      // Use navigate to redirect to the admin dashboard
      navigate('/'); // Adjust as necessary
    } catch (err) {
      console.error('Error selecting admin profile:', err);
      alert('Error selecting profile. Please try again.');
    }
  };

  if (loading) {
    console.log('Loading profiles...');
    return <div>Loading...</div>;
  }
  if (error) {
    console.error('Error state:', error);
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Select Admin Profile</h1>
      <ul>
        {profiles.map((profile) => (
          <li key={profile._id}>
            <button onClick={() => handleSelectProfile(profile._id)}>
              {profile.name} - {profile.role}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectAdmin;
