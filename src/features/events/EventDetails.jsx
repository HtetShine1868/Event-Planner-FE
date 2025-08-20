import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { Star } from "lucide-react";
import FeedbackForm from "../../features/feedback/feedbackForm";
import FeedbackList from "../../features/feedback/feedbackList";
import { getFeedbackSummary } from "../../features/feedback/feedbackAPI";
import API from "../../services/axiosInstance";
import Modal from "react-modal";
import { toast } from "react-toastify";

const EventDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromTab = location.state?.fromTab || "all";
  const { event, isRegistered: initialIsRegistered } = location.state || {};

  const [feedbackSummary, setFeedbackSummary] = useState(null);
  const [isRegistered, setIsRegistered] = useState(initialIsRegistered || false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!event) return;
    loadFeedbackSummary();
  }, [event]);

  const loadFeedbackSummary = async () => {
    try {
      const summary = await getFeedbackSummary(event.id);
      setFeedbackSummary(summary);
    } catch (err) {
      console.error("Failed to load feedback summary:", err);
    }
  };

  if (!event) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Event data not available.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const {
    title,
    description,
    startTime,
    endTime,
    location: eventLocation,
    capacity,
    registeredCount,
    categoryName,
    status,
    organizerUsername,
  } = event;

  const availableSeats = Math.max(0, capacity - registeredCount);
  const eventEnded = dayjs().isAfter(dayjs(endTime));
  const formatDateTime = (dt) =>
    dt ? dayjs(dt).format("dddd, MMMM D, YYYY [at] h:mm A") : "";

  const handleRegister = async () => {
    setLoading(true);
    try {
      const response = await API.post("/registrations/register", { eventId: event.id });
      setIsRegistered(true);
      toast.success(response.data.message || "Registration successful!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  // Convert backend Rating enum -> numeric
  const ratingToNumber = (ratingEnum) => {
    switch (ratingEnum) {
      case "ONE":
        return 1;
      case "TWO":
        return 2;
      case "THREE":
        return 3;
      case "FOUR":
        return 4;
      case "FIVE":
        return 5;
      default:
        return 0;
    }
  };

  // Render average stars
  const renderAverageStars = () => {
    if (!feedbackSummary || !feedbackSummary.averageRating) return null;
    const avg = feedbackSummary.averageRating;
    const fullStars = Math.floor(avg);
    const halfStar = avg - fullStars >= 0.5;
    return (
      <div className="flex items-center space-x-1 mb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i <= fullStars
                ? "text-yellow-400 fill-yellow-400"
                : halfStar && i === fullStars + 1
                ? "text-yellow-300 fill-yellow-300"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-gray-700 ml-2">({avg.toFixed(1)}/5)</span>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/user-dashboard", { state: { tab: fromTab } })}
        className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 font-semibold"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
        </svg>
        Back to Events
      </button>

      {/* Title */}
      <h1 className="text-3xl font-bold mb-2 text-gray-900">{title}</h1>

      {/* Category & Status */}
      <div className="flex flex-wrap gap-3 mb-6">
        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
          {categoryName || "Uncategorized"}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Dates & Location */}
      <div className="flex flex-col md:flex-row md:justify-between text-gray-700 mb-6 space-y-2 md:space-y-0">
        <div>
          <strong className="block text-sm text-gray-600">Starts:</strong>
          <p>{formatDateTime(startTime)}</p>
        </div>
        <div>
          <strong className="block text-sm text-gray-600">Ends:</strong>
          <p>{formatDateTime(endTime)}</p>
        </div>
        <div>
          <strong className="block text-sm text-gray-600">Location:</strong>
          <p>{eventLocation || "-"}</p>
        </div>
      </div>

      {/* Description */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">About the Event</h2>
        <p className="text-gray-700 whitespace-pre-line">{description || "No description available."}</p>
      </section>

      {/* Capacity Info */}
      <div className="flex items-center space-x-4 mb-6">
        <div
          className={`px-3 py-1 rounded-full font-semibold text-sm ${
            availableSeats > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {availableSeats > 0 ? `${availableSeats} spots left` : "Full"}
        </div>
        <div className="text-sm text-gray-600">
          ({registeredCount}/{capacity || "N/A"} registered)
        </div>
      </div>

      {/* Organizer */}
      <div className="mb-8 flex items-center gap-3 text-gray-700">
        <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg select-none">
          {organizerUsername?.charAt(0).toUpperCase() || "O"}
        </div>
        <div>
          <p className="font-semibold">{organizerUsername || "Organizer"}</p>
          <p className="text-sm text-gray-500">Organizer</p>
        </div>
      </div>

      {/* Feedback Summary */}
      {feedbackSummary && (
        <div className="mb-6">
          {renderAverageStars()}
          <div className="text-sm text-gray-600">
            😊 {feedbackSummary.positivePercent?.toFixed(1)}% | 😐 {feedbackSummary.neutralPercent?.toFixed(1)}% | 😡 {feedbackSummary.negativePercent?.toFixed(1)}%
          </div>
        </div>
      )}

      {/* Register Button */}
      <div className="mb-6">
        {isRegistered ? (
          <div className="text-green-600 font-semibold">You are registered for this event.</div>
        ) : (
          <button
            disabled={loading || availableSeats === 0 || eventEnded}
            onClick={handleRegister}
            className={`w-full md:w-auto px-6 py-3 rounded-lg font-semibold text-white transition ${
              loading || availableSeats === 0 || eventEnded
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Registering..." : "Register Now"}
          </button>
        )}
      </div>

      {/* Feedback Form & List */}
      {isRegistered && (
        <div className="mt-8">
          <FeedbackForm eventId={event.id} onFeedbackSubmitted={loadFeedbackSummary} />
          <FeedbackList eventId={event.id} />
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        className="max-w-lg mx-auto mt-20 p-6 bg-white rounded-xl shadow-xl outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center"
      >
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">Registration Successful! ✅</h2>
        <p className="mb-2">You have successfully registered for:</p>
        <p className="font-semibold text-gray-800">{title}</p>
        <p className="text-gray-700 mt-2">
          Date & Time: {formatDateTime(startTime)} - {formatDateTime(endTime)}
        </p>
        <p className="text-gray-700">Location: {eventLocation || "Online"}</p>
        <p className="text-gray-600 mt-4 text-sm">
          A confirmation email has been sent to your registered email.
        </p>
        <button
          onClick={() => setShowModal(false)}
          className="mt-6 w-full py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Close
        </button>
      </Modal>
    </div>
  );
};

export default EventDetails;
