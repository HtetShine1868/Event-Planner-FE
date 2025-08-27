// src/components/common/OrganizerEventCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const OrganizerEventCard = ({ event, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!event) return null;

  const {
    id,
    title,
    description,
    startTime,
    endTime,
    location,
    capacity = 0,
    registeredCount = 0,
    status,
    categoryName,
    organizerUsername,
    imageUrl
  } = event;

  const formatDate = (dt) => (dt ? dayjs(dt).format('MMM D') : '');
  const formatTime = (dt) => (dt ? dayjs(dt).format('h:mm A') : '');
  const availableSeats = Math.max(0, capacity - registeredCount);
  const registrationPercentage = capacity > 0 ? (registeredCount / capacity) * 100 : 0;

  const eventLive = dayjs().isAfter(dayjs(startTime)) && dayjs().isBefore(dayjs(endTime));

  const handleImageError = () => setImageError(true);

  // Gradient placeholder
  const titleHash = title.split('').reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
  const gradientColors = [
    ['from-blue-500 to-purple-600', 'from-green-500 to-teal-600', 'from-orange-500 to-red-600'],
    ['from-purple-500 to-pink-600', 'from-teal-500 to-blue-600', 'from-yellow-500 to-orange-600']
  ];
  const colorIndex = Math.abs(titleHash) % gradientColors.length;
  const gradient = gradientColors[colorIndex][Math.abs(titleHash) % 3];

  // Status colors
  const getStatusColors = () => {
    switch (status) {
      case 'APPROVED':
        return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' };
      case 'PENDING':
        return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' };
      case 'CANCELLED':
        return { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' };
      case 'DRAFT':
        return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
    }
  };

  const statusColors = getStatusColors();

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 w-full overflow-hidden group border border-gray-100 hover:-translate-y-0.5">
      {/* Event Image */}
      {imageUrl && !imageError ? (
        <div className="h-32 overflow-hidden relative">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
          />
          {eventLive && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold flex items-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse"></span>
              LIVE
            </div>
          )}
        </div>
      ) : (
        <div className={`h-32 bg-gradient-to-r ${gradient} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          {eventLive && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold flex items-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse"></span>
              LIVE
            </div>
          )}
        </div>
      )}

      {/* Badges */}
      <div className="absolute top-2 left-2 flex gap-1">
        <span className="bg-white text-gray-800 px-2 py-1 rounded-full text-sm font-medium shadow-sm">
          {categoryName}
        </span>
        <span className={`px-2 py-1 rounded-full text-sm font-medium shadow-sm ${statusColors.bg} ${statusColors.text} ${statusColors.border}`}>
          {status}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
          {title}
        </h2>

        {/* Time & Location */}
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(startTime)}
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatTime(startTime)}
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            {location.split(',')[0]}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Capacity Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{registeredCount}/{capacity} registered</span>
            <span className={availableSeats <= 5 ? 'text-orange-600 font-medium' : 'text-green-600 font-medium'}>
              {availableSeats} left
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                registrationPercentage > 75 ? 'bg-red-400' :
                registrationPercentage > 50 ? 'bg-orange-400' : 'bg-green-400'
              }`}
              style={{ width: `${Math.min(registrationPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Organizer */}
        <div className="flex items-center gap-2 pt-2">
          <div className="w-7 h-7 bg-gradient-to-r from-indigo-400 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
            {organizerUsername?.charAt(0)?.toUpperCase() ?? 'O'}
          </div>
          <span className="text-sm text-gray-600">@{organizerUsername}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => navigate(`/events/${id}`)}
            className="flex-1 py-1.5 px-2 rounded-lg text-sm font-medium bg-white border border-gray-300 hover:border-indigo-500 text-gray-700 hover:text-indigo-600 transition-all duration-200 flex items-center justify-center gap-1"
          >
            View
          </button>
          <button
            onClick={() => onEdit(event)}
            className="flex-1 py-1.5 px-2 rounded-lg text-sm font-medium bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-700 transition-all duration-200 flex items-center justify-center gap-1"
          >
            Edit
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex-1 py-1.5 px-2 rounded-lg text-sm font-medium bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-700 transition-all duration-200 flex items-center justify-center gap-1"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-5 max-w-md w-full space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
            <p className="text-gray-600">Are you sure you want to delete "{title}"? This action cannot be undone.</p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 px-4 rounded-lg font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(event.id);
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 py-2 px-4 rounded-lg font-medium bg-rose-600 hover:bg-rose-700 text-white text-sm"
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerEventCard;
