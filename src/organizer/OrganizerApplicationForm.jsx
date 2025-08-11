import { useState } from "react";

const OrganizerApplicationForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    contactNumber: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      tempErrors.fullName = "Full name is required.";
    } else if (formData.fullName.length < 3) {
      tempErrors.fullName = "Name must be at least 3 characters.";
    }

    // Company Name validation
    if (!formData.companyName.trim()) {
      tempErrors.companyName = "Organization/Company name is required.";
    }

    // Contact Number validation
    const phoneRegex = /^[0-9]{7,15}$/;
    if (!formData.contactNumber.trim()) {
      tempErrors.contactNumber = "Contact number is required.";
    } else if (!phoneRegex.test(formData.contactNumber)) {
      tempErrors.contactNumber = "Enter a valid phone number (7-15 digits).";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      tempErrors.email = "Enter a valid email address.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("Form submitted successfully!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-blue-500 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Organizer Application Form
        </h2>

        {/* Full Name */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Full Name</label>
          <input
            type="text"
            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 ${
              errors.fullName ? "border-red-500" : "border-gray-300"
            }`}
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        {/* Organization/Company Name */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">
            Organization / Company Name
          </label>
          <input
            type="text"
            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 ${
              errors.companyName ? "border-red-500" : "border-gray-300"
            }`}
            value={formData.companyName}
            onChange={(e) =>
              setFormData({ ...formData, companyName: e.target.value })
            }
          />
          {errors.companyName && (
            <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
          )}
        </div>

        {/* Contact Number */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">Contact Number</label>
          <input
            type="text"
            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 ${
              errors.contactNumber ? "border-red-500" : "border-gray-300"
            }`}
            value={formData.contactNumber}
            onChange={(e) =>
              setFormData({ ...formData, contactNumber: e.target.value })
            }
          />
          {errors.contactNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>
          )}
        </div>

        {/* Email Address */}
        <div className="mb-6">
          <label className="block font-semibold mb-1">Email Address</label>
          <input
            type="email"
            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:opacity-90 transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default OrganizerApplicationForm;
