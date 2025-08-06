import { useState } from 'react';
import './UserProfileForm.css';

const UserProfileForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{7,15}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 7-15 digits';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert('Profile saved successfully!');
      // You can later integrate this with an API call
    }
  };

  return (
    <div className="user-profile-form">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
          {errors.fullName && <span className="error">{errors.fullName}</span>}
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label>User Role</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="">Select role</option>
            <option value="organizer">Organizer</option>
            <option value="attendee">Attendee</option>
            <option value="staff">Staff</option>
          </select>
          {errors.role && <span className="error">{errors.role}</span>}
        </div>

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default UserProfileForm;
