import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { Star } from "lucide-react";
import FeedbackForm from "../../features/feedback/feedbackForm";
import { getFeedbackSummary } from "../../features/feedback/feedbackAPI";
import API from "../../services/axiosInstance";
import { toast } from "react-toastify";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fromTab = location.state?.fromTab || "all";

  const [event, setEvent] = useState(location.state?.event || null);
  const [feedbackSummary, setFeedbackSummary] = useState(null);
  const [isRegistered, setIsRegistered] = useState(location.state?.isRegistered || false);
  const [loading, setLoading] = useState(true);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    if (id) {
      fetchEventData();
    }
  }, [id]);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch event details (if not passed in state)
      if (!event) {
        const eventRes = await API.get(`/event/${id}`);
        setEvent(eventRes.data);
      }
      
      // 2. Check registration status (but respect passed state)
      await checkRegistrationStatus();
      
      // 3. Load feedback summary
      await loadFeedbackSummary();
      
    } catch (error) {
      console.error('Failed to fetch event details:', error);
      toast.error('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const checkRegistrationStatus = async () => {
    try {
      // Method 1: Try to get specific registration check
      try {
        const checkRes = await API.get(`/registrations/check-event/${id}`);
        if (checkRes.data !== undefined) {
          setIsRegistered(checkRes.data.registered || checkRes.data === true);
          return;
        }
      } catch (checkError) {
        console.log('Specific check endpoint not available, using fallback');
      }

      // Method 2: Check all user registrations
      const response = await API.get('/registrations/my?size=100');
      const userRegistrations = response.data.content || [];
      
      const isUserRegistered = userRegistrations.some(registration => {
        const eventId = registration.event?.id || registration.eventId;
        return eventId && parseInt(eventId) === parseInt(id);
      });
      
      setIsRegistered(isUserRegistered);
      
    } catch (error) {
      console.warn('All registration checks failed:', error);
      
      // Final fallback: Use passed state or assume not registered
      if (location.state?.isRegistered !== undefined) {
        setIsRegistered(location.state.isRegistered);
      } else {
        setIsRegistered(false);
      }
    }
  };

  const loadFeedbackSummary = async () => {
    try {
      const summary = await getFeedbackSummary(id);
      setFeedbackSummary(summary);
    } catch (err) {
      console.error("Failed to load feedback summary:", err);
    }
  };

  const handleRegister = async () => {
    setRegisterLoading(true);
    try {
      const response = await API.post("/registrations/register", { eventId: id });
      setIsRegistered(true);
      toast.success(response.data.message || "Registration successful!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed.");
    } finally {
      setRegisterLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
        </div>
      </div>
    );
  }

  // Event not found
  if (!event) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Event not found.</p>
        <button
          onClick={() => navigate("/user-dashboard", { state: { tab: fromTab } })}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Back to Events
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
    registeredCount = 0,
    categoryName,
    status,
    organizerUsername,
  } = event;

  const availableSeats = Math.max(0, (capacity || 0) - (registeredCount || 0));
  const eventEnded = dayjs().isAfter(dayjs(endTime));
  const formatDateTime = (dt) =>
    dt ? dayjs(dt).format("dddd, MMMM D, YYYY [at] h:mm A") : "";

  const renderAverageStars = () => {
    if (!feedbackSummary || !feedbackSummary.averageRating) return null;
    const avg = feedbackSummary.averageRating;
    const fullStars = Math.floor(avg);
    const halfStar = avg - fullStars >= 0.5;
    return (
      <div className="flex items-center space-x-1 mb-2">
        {[1,2,3,4,5].map(i => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i <= fullStars ? "text-yellow-400 fill-yellow-400" :
              halfStar && i === fullStars + 1 ? "text-yellow-300 fill-yellow-300" :
              "text-gray-300"
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
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
          status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
        }`}>
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
        <div className={`px-3 py-1 rounded-full font-semibold text-sm ${
          availableSeats > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {availableSeats > 0 ? `${availableSeats} spots left` : "Full"}
        </div>
        <div className="text-sm text-gray-600">({registeredCount || 0}/{capacity || "N/A"} registered)</div>
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

      {/* Register Button or Feedback Form */}
      <div className="mb-6">
        {isRegistered ? (
          <div>
            <div className="text-green-600 font-semibold mb-4">You are registered for this event.</div>
            {!feedbackSubmitted && (
              <button
                onClick={() => setShowFeedbackForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit Feedback
              </button>
            )}
          </div>
        ) : (
          <button
            disabled={registerLoading || availableSeats === 0 || eventEnded}
            onClick={handleRegister}
            className={`w-full md:w-auto px-6 py-3 rounded-lg font-semibold text-white transition ${
              registerLoading || availableSeats === 0 || eventEnded
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {registerLoading ? "Registering..." : "Register Now"}
          </button>
        )}
      </div>

      {/* Feedback Form Modal */}
      {showFeedbackForm && (
        <FeedbackForm
          eventId={id}
          onFeedbackSubmitted={() => {
            loadFeedbackSummary();
            setFeedbackSubmitted(true);
            setShowFeedbackForm(false);
            toast.success("Thank you for your feedback!");
          }}
          onClose={() => setShowFeedbackForm(false)}
        />
      )}
    </div>
  );
};

export default EventDetails;