import { useState } from "react";

const OrganizerApplicationForm = () => {
  const [form, setForm] = useState({
    organizationName: "",
    email: "",
    description: "",
  });

  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Validation rules
  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const errors = {
    organizationName:
      !form.organizationName.trim()
        ? "Organization name is required."
        : "",
    email:
      !form.email.trim()
        ? "Email is required."
        : !isValidEmail(form.email)
        ? "Invalid email format."
        : "",
    description:
      !form.description.trim()
        ? "Description is required."
        : "",
  };

  const isValid = !Object.values(errors).some(Boolean);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({
      ...prev,
      [e.target.name]: true,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      organizationName: true,
      email: true,
      description: true,
    });
    setSubmitted(true);
    if (!isValid) return;
    alert("Application submitted successfully!");
    setForm({
      organizationName: "",
      email: "",
      description: "",
    });
    setTouched({});
    setSubmitted(false);
  };

  // Utility for field styling
  const fieldClass = (field) =>
    `w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 ${
      touched[field] && errors[field]
        ? "border-red-500 focus:ring-red-300"
        : "border-gray-300 focus:ring-blue-300"
    } bg-white`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500">
      <form
        className="w-full max-w-md bg-white/90 shadow-xl rounded-2xl px-8 py-10 backdrop-blur-md"
        onSubmit={handleSubmit}
        noValidate
      >
        <h2 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Organizer Application
        </h2>

        {/* Organization Name */}
        <div className="mb-6">
          <label
            htmlFor="organizationName"
            className="block text-gray-700 font-semibold mb-2"
          >
            Organization Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="organizationName"
            name="organizationName"
            className={fieldClass("organizationName")}
            value={form.organizationName}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            autoComplete="organization"
          />
          {touched.organizationName && errors.organizationName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.organizationName}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-gray-700 font-semibold mb-2"
          >
            Email<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={fieldClass("email")}
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            autoComplete="email"
          />
          {touched.email && errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="mb-8">
          <label
            htmlFor="description"
            className="block text-gray-700 font-semibold mb-2"
          >
            Organization Description<span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            className={`${fieldClass("description")} min-h-[80px] resize-y`}
            value={form.description}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {touched.description && errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description}
            </p>
          )}
        </div>

        <button
          type="submit"
          className={`w-full py-3 rounded-lg font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 shadow-md transition-all duration-200 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
            submitted && !isValid ? "opacity-70 cursor-not-allowed" : ""
          }`}
          disabled={submitted && !isValid}
        >
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default OrganizerApplicationForm;