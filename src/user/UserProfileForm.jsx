// src/features/user/UserProfileForm.jsx
import React, { useState } from 'react';
import axiosInstance from '../services/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { jwtDecode }from 'jwt-decode';
import './UserProfileForm.css'; // keep your styling here

const UserProfileForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    dateOfBirth: '',
    address: '',
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const userId = decoded.id; // ✅ uses numeric id

      await axiosInstance.post(/user/${userId}/profile, formData);
      navigate('/user-dashboard'); // ✅ redirect after submit
    } catch (err) {
      setError('Failed to create profile');
      console.error(err);
    }
  };

  return (
    <div className="profile-form">
      <h1>Complete Your Profile</h1>
      <form onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input name="fullName" value={formData.fullName} onChange={handleChange} required />

        <label>Gender</label>
        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>

        <label>Date of Birth</label>
        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />

        <label>Address</label>
        <input name="address" value={formData.address} onChange={handleChange} required />

        {error && <div className="error">{error}</div>}
        <button type="submit">Submit Profile</button>
      </form>
    </div>
  );
};

export default UserProfileForm;