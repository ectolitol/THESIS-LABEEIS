import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './categoryRegistration.scss';
import Modal from '../modal/Modal'; 

const CategoryRegistration = () => {
  const navigate = useNavigate();

  // State to store form data
  const [formData, setFormData] = useState({
    categoryName: "",
  }); 

  const [errors, setErrors] = useState([]);
  const [showModal, setShowModal] = useState(false); // Modal state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let validationErrors = [];

    // Ensure category name is not empty
    if (!formData.categoryName || formData.categoryName.trim() === '') {
      validationErrors.push('Please enter a category name.');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch('/api/categories/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(true); // Show the modal on success
      } else {
        const data = await response.json();
        setErrors(data.errors || [data.error || 'Error creating category. Please try again later.']);
      }
    } catch (error) {
      setErrors(['Error connecting to the server. Please check your network connection or try again later.']);
    }
  };

  return (
    <div className="categoryRegistration">
      <div className="newCategoryTitle">New Category Registration</div>
      <form className="newCategoryForm" onSubmit={handleSubmit}>
        <div className="newCategoryField">
          <label>Category Name: </label>
          <input
            type="text"
            name="categoryName"
            placeholder="Category Name"
            value={formData.categoryName}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className='submitButton'>Create Category</button>
        {errors.length > 0 && (
          <div className="errorMessages">
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
      </form>
      {showModal && (
        <Modal 
          message="New category created successfully!" 
          onClose={() => {
            setShowModal(false);
            navigate('/categories'); // Navigate when modal is closed
          }} 
        />
      )}
    </div>
  );
};

export default CategoryRegistration;
