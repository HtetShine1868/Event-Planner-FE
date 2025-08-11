
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
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>

        {/* Time & Location */}
        <div className="text-sm text-gray-600">
          <p>📅 {formatDateTime(startTime)} — {formatDateTime(endTime)}</p>
          <p>📍 {location}</p>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm line-clamp-3">
          {description}
        </p>

        {/* Capacity Info */}
        <div className="text-sm mt-2">
          <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${availableSeats > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {availableSeats > 0 ? `${availableSeats} spots left` : 'Full'}
          </span>
          <span className="ml-2 text-gray-500">
            ({registeredCount}/{capacity} registered)
          </span>
        </div>

        {/* Organizer */}
        <div className="flex items-center mt-4 gap-3">
          <div className="w-9 h-9 bg-indigo-500 text-white rounded-full flex items-center justify-center font-semibold">
            {organizerUsername?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">
              {organizerUsername}
            </p>
            <p className="text-xs text-gray-500">Organizer</p>
          </div>
        </div>

        {/* CTA Button */}
        {showRegister && (
          <button
            onClick={() => onRegister?.(event.id)}
            disabled={availableSeats <= 0}
            className={`w-full mt-4 py-2 px-4 rounded-md font-medium transition-colors ${
              availableSeats > 0
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            {availableSeats > 0 ? 'Register Now' : 'Registration Closed'}
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
/ src/components/common/EventCard.jsx
import dayjs from 'dayjs';

const EventCard = ({ event, onRegister, showRegister = true }) => {
  const {
    title,
    description,
    startTime,
    endTime,
    location,
    capacity,
    registeredCount,
    status,
    categoryName,
    organizerUsername
  } = event;

  const formatDateTime = (dt) => dayjs(dt).format('MMM D, YYYY • h:mm A');

  const availableSeats = capacity - registeredCount;

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 w-full max-w-md mx-auto overflow-hidden">
      {/* Category / Status */}