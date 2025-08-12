// src/features/feedback/FeedbackForm.jsx
import React, { useState } from 'react';
import { submitFeedback } from './feedbackAPI';

const FeedbackForm = ({ eventId, onFeedbackSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await submitFeedback({ eventId, rating, comment });
      setRating(0);
      setComment('');
      onFeedbackSubmitted();
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow mb-6">
      <h3 className="text-xl font-semibold mb-2">Leave Your Feedback</h3>

      <label className="block mb-2">
        Rating:
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="ml-2 border rounded p-1"
          disabled={loading}
        >
          <option value={0}>Select Rating</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </label>

      <label className="block mb-4">
        Comment:
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border rounded p-2 mt-1"
          rows={4}
          disabled={loading}
          placeholder="Write your feedback here (optional)"
        />
      </label>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
};

export default FeedbackForm;
