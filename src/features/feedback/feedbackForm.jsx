// src/features/feedback/feedbackForm.jsx
import React, { useState } from "react";
import API from "../../services/axiosInstance";

const FeedbackForm = ({ eventId, onFeedbackSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Save feedback
      await API.post(`/events/${eventId}/feedback`, {
        rating,
        comment,
      });

      // 2. Call sentiment API
      const sentimentRes = await API.post(`/sentiment`, { text: comment });

      // 3. Save sentiment result with feedback (optional if backend handles it)
      await API.put(`/events/${eventId}/feedback/sentiment`, {
        rating,
        comment,
        sentiment: sentimentRes.data,
      });

      // 4. Refresh feedback summary
      onFeedbackSubmitted();
      setComment("");
      setRating(0);
    } catch (err) {
      console.error("Feedback submit failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-2">Leave Feedback</h3>
      <input
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="border p-2 rounded w-20 mb-2"
      />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your feedback..."
        className="w-full border p-2 rounded mb-2"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        {loading ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  );
};

export default FeedbackForm;
