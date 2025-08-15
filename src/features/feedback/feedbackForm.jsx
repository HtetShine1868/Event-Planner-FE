import React, { useState } from 'react';
import { submitFeedback } from './feedbackAPI';

const FeedbackForm = ({ eventId, onFeedbackSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError('Please select a rating.');
      return;
    }

    try {
      setSubmitting(true);
      await submitFeedback(eventId, { rating, comment });
      setRating(0);
      setComment('');
      onFeedbackSubmitted();  // notify parent
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError(
        err.response?.data?.message || 
        'Failed to submit feedback. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Submit Your Feedback</h3>

      {/* Rating selector */}
      <label className="block mb-2 font-medium">Rating:</label>
      <select
        className="border p-2 rounded w-full mb-4"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
      >
        <option value={0}>Select rating</option>
        {[1, 2, 3, 4, 5].map((r) => (
          <option key={r} value={r}>
            {r} {r === 1 ? 'star' : 'stars'}
          </option>
        ))}
      </select>

      {/* Comment */}
      <label className="block mb-2 font-medium">Comment:</label>
      <textarea
        className="border p-2 rounded w-full mb-4"
        rows="4"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your feedback here (optional)"
      />

      {/* Error */}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Submit button */}
      <button
        type="submit"
        disabled={submitting}
        className={`w-full py-2 rounded text-white font-semibold ${
          submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {submitting ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
};

export default FeedbackForm;
