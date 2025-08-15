import React from "react";

const FeedbackSummary = ({ averageRating, totalReviews }) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold mb-2">Event Feedback Summary</h2>
      {totalReviews > 0 ? (
        <>
          <p className="text-yellow-500 font-bold text-xl">
            ⭐ {averageRating.toFixed(1)} / 5
          </p>
          <p className="text-gray-600">{totalReviews} reviews</p>
        </>
      ) : (
        <p className="text-gray-500">No feedback yet.</p>
      )}
    </div>
  );
};

export default FeedbackSummary;
