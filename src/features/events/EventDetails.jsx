import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import FeedbackSummary from '../../features/feedback/feedbackSummary';
import FeedbackForm from '../../features/feedback/feedbackForm';
import { getFeedbackSummary } from '../../features/feedback/feedbackAPI';
import API from '../../services/axiosInstance';

const EventDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { event, isRegistered: initialIsRegistered } = location.state || {};

  const [feedbackSummary, setFeedbackSummary] = useState(null);
  const [isRegistered, setIsRegistered] = useState(initialIsRegistered || false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const loadFeedbackSummary = async () => {
      if (!event) return;
      try {
        const summary = await getFeedbackSummary(event.id);
        setFeedbackSummary(summary);
      } catch (err) {
        console.error('Failed to load feedback summary:', err);
      }
    };
    loadFeedbackSummary();
  }, [event]);

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

  const formatDateTime = (dt) => (dt ? dayjs(dt).format('dddd, MMMM D, YYYY [at] h:mm A') : '');

  const availableSeats = Math.max(0, capacity - registeredCount);

  // Check if event has ended - can disable registration if needed
  const eventEnded = dayjs().isAfter(dayjs(endTime));

  // Handler for Register button
  const handleRegister = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const payload = { eventId: event.id };
      const response = await API.post('/registrations/register', payload);
      setSuccessMsg(response.data.message || 'Registration successful!');
      setIsRegistered(true);
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data.message || 'Failed to register.');
      } else {
        setErrorMsg('Failed to register. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 font-semibold"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
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
          {categoryName || 'Uncategorized'}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
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
          <p>{eventLocation || '-'}</p>
        </div>
      </div>

      {/* Description */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">About the Event</h2>
        <p className="text-gray-700 whitespace-pre-line">{description || 'No description available.'}</p>
      </section>

      {/* Capacity Info */}
      <div className="flex items-center space-x-4 mb-6">
        <div
          className={`px-3 py-1 rounded-full font-semibold text-sm ${
            availableSeats > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {availableSeats > 0 ? `${availableSeats} spots left` : 'Full'}
        </div>
        <div className="text-sm text-gray-600">
          ({registeredCount} / {capacity || 'N/A'} registered)
        </div>
      </div>

      {/* Organizer */}
      <div className="mb-8 flex items-center gap-3 text-gray-700">
        <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg select-none">
          {organizerUsername?.charAt(0).toUpperCase() || 'O'}
        </div>
        <div>
          <p className="font-semibold">{organizerUsername || 'Organizer'}</p>
          <p className="text-sm text-gray-500">Organizer</p>
        </div>
      </div>

      {/* Feedback Summary */}
      {feedbackSummary && <FeedbackSummary summary={feedbackSummary} />}

      {/* Register Button or Registered Text */}
      <div className="mb-6">
        {isRegistered ? (
          <div className="text-green-600 font-semibold">You are registered for this event.</div>
        ) : (
          <button
            disabled={loading || availableSeats === 0 || eventEnded}
            onClick={handleRegister}
            className={`px-6 py-2 rounded font-semibold text-white ${
              loading || availableSeats === 0 || eventEnded
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Registering...' : 'Register Now'}
          </button>
        )}
      </div>

      {/* Success/Error Messages */}
      {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}
      {errorMsg && <p className="text-red-600 mb-4">{errorMsg}</p>}

      {/* Feedback Form for Registered Users */}
      {isRegistered && (
        <div className="mt-8">
          <FeedbackForm
            eventId={event.id}
            onFeedbackSubmitted={() => {
              getFeedbackSummary(event.id).then(setFeedbackSummary);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EventDetails;
