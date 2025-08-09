import { useState } from "react";

export default function OrganizerApplicationForm() {
  const [organizationName, setOrganizationName] = useState("");
  const [touched, setTouched] = useState(false);

  const isValid = organizationName.trim().length > 0;
  const showError = touched && !isValid;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    // Static submit - do nothing (add logic later)
    alert("Form submitted (static)");
  };

  return (
    <form
      className="max-w-md mx-auto mt-10 bg-white shadow-md rounded px-8 py-6"
      onSubmit={handleSubmit}
      noValidate
    >
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Organizer Application
      </h2>
      <div className="mb-4">
        <label
          htmlFor="organizationName"
          className="block text-gray-700 font-medium mb-2"
        >
          Organization Name
        </label>
        <input
          type="text"
          id="organizationName"
          name="organizationName"
          className={`w-full px-3 py-2 border ${
            showError ? "border-red-500" : "border-gray-300"
          } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
          onBlur={() => setTouched(true)}
          required
        />
        {showError && (
          <p className="text-red-500 text-sm mt-1">
            Organization name is required.
          </p>
        )}
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors font-medium"
      >
        Submit
      </button>
    </form>
  );
}