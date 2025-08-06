import { useState } from "react";
import "./UserProfileForm.css";

const UserProfileForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
    preferences: [],
  });

  const [errors, setErrors] = useState({});

  const eventOptions = ["Wedding", "Conference", "Concert", "Birthday", "Corporate"];

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!formData.email.includes("@")) newErrors.email = "Enter a valid email.";
    if (!/^\d{7,15}$/.test(formData.phone)) newErrors.phone = "Enter a valid phone number.";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    if (!formData.role) newErrors.role = "Please select a role.";
    if (formData.preferences.length === 0) newErrors.preferences = "Choose at least one event type.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        preferences: checked
          ? [...prev.preferences, value]
          : prev.preferences.filter((item) => item !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("Profile submitted successfully ✅");
      console.log(formData);
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <h2>User Profile Form</h2>

      <label>Full Name:</label>
      <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
      {errors.fullName && <span className="error">{errors.fullName}</span>}

      <label>Email:</label>
      <input type="email" name="email" value={formData.email} onChange={handleChange} />
      {errors.email && <span className="error">{errors.email}</span>}

      <label>Phone Number:</label>
      <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
      {errors.phone && <span className="error">{errors.phone}</span>}

      <label>Password:</label>
      <input type="password" name="password" value={formData.password} onChange={handleChange} />
      {errors.password && <span className="error">{errors.password}</span>}

      <label>Confirm Password:</label>
      <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
      {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}

      <label>Role:</label>
      <select name="role" value={formData.role} onChange={handleChange}>
        <option value="">Select Role</option>
        <option value="attendee">Attendee</option>
        <option value="organizer">Organizer</option>
        <option value="vendor">Vendor</option>
      </select>
      {errors.role && <span className="error">{errors.role}</span>}

      <label>Preferred Event Types:</label>
      <div className="checkbox-group">
        {eventOptions.map((event) => (
          <label key={event}>
            <input
              type="checkbox"
              value={event}
              checked={formData.preferences.includes(event)}
              onChange={handleChange}
            />
            {event}
          </label>
        ))}
      </div>
      {errors.preferences && <span className="error">{errors.preferences}</span>}

      <button type="submit">Submit</button>
    </form>
  );
};

export default UserProfileForm;
