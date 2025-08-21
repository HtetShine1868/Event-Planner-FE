import React, { useState } from "react";
import API from "../../services/axiosInstance";
import { toast } from "react-toastify";

const RatingOptions = [
  { value: "ONE", label: "1" },
  { value: "TWO", label: "2" },
  { value: "THREE", label: "3" },
  { value: "FOUR", label: "4" },
  { value: "FIVE", label: "5" },
];

const FeedbackForm = ({ eventId, onFeedbackSubmitted, onClose }) => {
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false); // Track submission

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      toast.warning("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.warning("Please write your feedback");
      return;
    }

    setLoading(true);
    try {
      await API.post(`/feedbacks/${eventId}/feedback`, { rating, comment });
      toast.success("Feedback submitted successfully!");
      setSubmitted(true); // Mark as submitted
      setRating("");
      setComment("");
      onFeedbackSubmitted();
      onClose(); // Close form after feedback
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  // If submitted, don’t allow resubmission
  if (submitted) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Feedback Submitted ✅
        </h3>
        <p className="text-gray-600">Thank you for your feedback!</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md space-y-4"
    >
      <h3 className="text-xl font-semibold text-gray-800">Leave Feedback</h3>

      <div>
        <label className="block mb-1 text-gray-700 font-medium">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="w-32 border-gray-300 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select rating</option>
          {RatingOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 text-gray-700 font-medium">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your feedback..."
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          rows={4}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full md:w-auto px-6 py-3 rounded-lg font-semibold text-white transition ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {loading ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  );
};

export default FeedbackForm;
