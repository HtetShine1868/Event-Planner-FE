import { useState } from "react";
import { Mail, User, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const OrganizerApplicationForm = ({ user }) => {
  const [formData, setFormData] = useState({
    userId: user?.id || "",
    organizerName: "",
    email: user?.email || "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // "success" | "error"

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/organizer-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({
          userId: user?.id || "",
          organizerName: "",
          email: user?.email || "",
          description: "",
        });
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Organizer Name */}
      <div className="relative">
        <User className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          name="organizerName"
          value={formData.organizerName}
          onChange={handleChange}
          required
          placeholder="Organizer Name"
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
      </div>

      {/* Email */}
      <div className="relative">
        <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Email"
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          disabled // auto-filled
        />
      </div>

      {/* Description */}
      <div className="relative">
        <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="Tell us why you want to be an organizer..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 transition transform hover:scale-[1.02] disabled:opacity-60"
        whileTap={{ scale: 0.97 }}
      >
        {loading ? "Submitting..." : "🚀 Submit Application"}
      </motion.button>

      {/* Status Alerts */}
      {status === "success" && (
        <motion.div
          className="flex items-center gap-2 text-green-600 bg-green-100 p-3 rounded-lg mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <CheckCircle size={18} /> Application submitted successfully!
        </motion.div>
      )}
      {status === "error" && (
        <motion.div
          className="flex items-center gap-2 text-red-600 bg-red-100 p-3 rounded-lg mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AlertCircle size={18} /> Something went wrong. Try again.
        </motion.div>
      )}
    </motion.form>
  );
};

export default OrganizerApplicationForm;
