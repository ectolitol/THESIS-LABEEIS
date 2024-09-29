import { useState, useEffect } from 'react';
import axios from 'axios';
import './profileDropdown.scss';

const ProfileDropdown = ({ admin, isOpen, toggleDropdown, updateAdminProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: admin?.name || '',
    email: admin?.contactInfo?.email || '',
    phone: admin?.contactInfo?.phone || '',
    role: admin?.role || '',
    image: admin?.profileImage || '',
  });
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(admin?.profileImage || '');

  // Update form data when admin prop changes
  useEffect(() => {
    setFormData({
      name: admin?.name || '',
      email: admin?.contactInfo?.email || '',
      phone: admin?.contactInfo?.phone || '',
      role: admin?.role || '',
      image: admin?.profileImage || '',
    });
    setProfileImage(admin?.profileImage ? `http://localhost:4000/uploads/${admin.profileImage}` : '');
  }, [admin]);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle profile image change
  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  // Submit form data to update admin profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('role', formData.role);
    if (formData.image) {
      formDataToSend.append('profileImage', formData.image);
    }

    try {
      const response = await axios.put(`/api/admin/profiles/${admin._id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Update the local admin object to reflect changes
      const updatedAdmin = response.data.adminProfile;
      updateAdminProfile(updatedAdmin); // Pass updated profile to parent

      // Update profile image if exists
      if (response.data.adminProfile?.profileImage) {
        const newImage = `/uploads/${response.data.adminProfile.profileImage}`;
        setProfileImage(newImage);
        admin.profileImage = newImage;
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-dropdown">
      {isOpen && (
        <div className="dropdown" onClick={(e) => e.stopPropagation()}>
          <div className="profile-info">
            {profileImage && (
              <img src={profileImage} alt="Profile" className="profile-pic"  onError={() => console.error('Failed to load image at:', profileImage)} />
            )}
            <h4>{formData.name || 'No Name'}</h4>
            <p>{formData.role || 'No Role'}</p>
            <p>Email: {formData.email || 'No Email'}</p>
            <p>Phone: {formData.phone || 'No Phone'}</p>
            <button
              className="edit-button"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(!isEditing);
              }}
            >
              {isEditing ? 'Close Edit' : 'Edit Profile'}
            </button>
          </div>

          {isEditing && (
            <form onSubmit={handleSubmit} className="edit-profile-form">

              <div>
                <label htmlFor="image-upload">Image:</label>
                <input
                  id="image-upload"
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </div>

              
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
                onClick={(e) => e.stopPropagation()}
              />
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Role"
                required
                onClick={(e) => e.stopPropagation()}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                onClick={(e) => e.stopPropagation()}
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                onClick={(e) => e.stopPropagation()}
              />
              <button type="submit" className="save-button" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
