// src/features/feedback/feedbackList.jsx
import React, { useEffect, useState } from "react";
import API from "../../services/axiosInstance";
import { Star } from "lucide-react";

const FeedbackList = ({ eventId }) => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    API.get(`/events/${eventId}/feedback`)
      .then(res => setFeedbacks(res.data))
      .catch(err => console.error("Load feedback failed:", err));
  }, [eventId]);

  // Map backend enum -> numeric rating
  const ratingToNumber = (ratingEnum) => {
    switch (ratingEnum) {
      case "ONE": return 1;
      case "TWO": return 2;
      case "THREE": return 3;
      case "FOUR": return 4;
      case "FIVE": return 5;
      default: return 0;
    }
  };

  const renderStars = (ratingEnum) => {
    const numeric = ratingToNumber(ratingEnum);
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              numeric >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-2">All Feedback</h3>
      {feedbacks.length === 0 ? (
        <p className="text-gray-500">No feedback yet.</p>
      ) : (
        feedbacks.map((fb, idx) => (
          <div key={idx} className="border-b py-3">
            {/* ⭐ Render stars from enum */}
            {renderStars(fb.rating)}

            <p className="text-gray-800 mt-1">{fb.comment}</p>

            {fb.sentiment && (
              <small className="text-gray-500">
                😊 {fb.sentiment.positive}% | 😐 {fb.sentiment.neutral}% | 😡 {fb.sentiment.negative}%
              </small>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default FeedbackList;
