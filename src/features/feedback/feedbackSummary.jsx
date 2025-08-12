// src/features/feedback/FeedbackSummary.jsx
import React from 'react';

const FeedbackSummary = ({ summary }) => {
  if (!summary) return null;

  const { averageRating, totalFeedbacks, positiveCount, neutralCount, negativeCount } = summary;

  return (
    <div className="p-4 bg-white rounded shadow mb-6">
      <h3 className="text-xl font-semibold mb-2">Feedback Summary</h3>
      <p><strong>Average Rating:</strong> {averageRating?.toFixed(1) ?? '-'} / 5</p>
      <p><strong>Total Feedbacks:</strong> {totalFeedbacks ?? 0}</p>
      <p><strong>Positive:</strong> {positiveCount ?? 0}</p>
      <p><strong>Neutral:</strong> {neutralCount ?? 0}</p>
      <p><strong>Negative:</strong> {negativeCount ?? 0}</p>
    </div>
  );
};

export default FeedbackSummary;
