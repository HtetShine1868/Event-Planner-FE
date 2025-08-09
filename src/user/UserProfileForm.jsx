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

  const eventOptions = [
    "Wedding", "Conference", "Concert", "Birthday",
    "Corporate", "Festival", "Seminar", "Workshop"
  ];

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }

    const phoneRegex = /^\d{7,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Enter a valid phone number (7-15 digits).";
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Password must be 8+ characters, include uppercase, lowercase, number, and special character.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.role) {
      newErrors.role = "Select a role.";
    }

    if (formData.preferences.length === 0) {
      newErrors.preferences = "Select at least one event type.";
    }

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
      <h2>Edit Profile</h2>

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
        <option value="">-- Select Role --</option>
        <option value="attendee">Attendee</option>
        <option value="organizer">Organizer</option>
        <option value="vendor">Vendor</option>
      </select>
      {errors.role && <span className="error">{errors.role}</span>}

      <label>Preferred Event Types:</label>
      <div className="preferences-container">
        {eventOptions.map((event) => (
          <label
            key={event}
            className={`preference-option ${formData.preferences.includes(event) ? "selected" : ""}`}
          >
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
