// src/components/common/OrganizerEventCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const OrganizerEventCard = ({ event, onEdit, onDelete }) => {
  const navigate = useNavigate();
  if (!event) return null;

  const {
    title,
    description,
    startTime,
    endTime,
    location,
    capacity = 0,
    registeredCount = 0,
    status,
    categoryName,
    organizerUsername
  } = event;

  const formatDateTime = (dt) => (dt ? dayjs(dt).format('MMM D, YYYY • h:mm A') : '');
  const availableSeats = Math.max(0, capacity - registeredCount);

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 w-full max-w-md mx-auto overflow-hidden relative">
      {/* Category / Status */}
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium">
        <span className="bg-white text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
          {categoryName}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {status}
        </span>
      </div>

      {/* Main content */}
      <div className="p-5 space-y-3">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>

        <div className="text-sm text-gray-600">
          <p>📅 {formatDateTime(startTime)} — {formatDateTime(endTime)}</p>
          <p>📍 {location}</p>
        </div>

        <p className="text-gray-700 text-sm line-clamp-3">{description}</p>

        <div className="text-sm mt-2">
          <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${availableSeats > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {availableSeats > 0 ? `${availableSeats} spots left` : 'Full'}
          </span>
          <span className="ml-2 text-gray-500">({registeredCount}/{capacity} registered)</span>
        </div>

        <div className="flex items-center mt-4 gap-3">
          <div className="w-9 h-9 bg-indigo-500 text-white rounded-full flex items-center justify-center font-semibold">
            {organizerUsername?.charAt(0)?.toUpperCase() ?? 'O'}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{organizerUsername}</p>
            <p className="text-xs text-gray-500">Organizer</p>
          </div>
        </div>

        {/* Organizer Actions */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => navigate(`/events/${event.id}`)}
            className="flex-1 py-2 px-4 rounded-md font-medium bg-blue-600 hover:bg-blue-700 text-white"
          >
            View Details
          </button>
          <button
            onClick={() => onEdit(event)}
            className="flex-1 py-2 px-4 rounded-md font-medium bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className="flex-1 py-2 px-4 rounded-md font-medium bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrganizerEventCard;
