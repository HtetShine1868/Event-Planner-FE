// src/features/user/AllEvents.jsx

import React, { useEffect, useState } from 'react';
import API from '../../../services/axiosInstance'; // Your axios config

const AllEvents = () => {
  // 1. Initialize state as empty array
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get('/event') // Adjust endpoint accordingly
      .then((res) => {
        if (Array.isArray(res.data)) {
          setEvents(res.data);
        } else {
          console.error('Expected an array but got:', res.data);
          setEvents([]);
          setError('Unexpected response format.');
        }
      })
      .catch((err) => {
        console.error('Failed to fetch events', err);
        setError('Failed to load events.');
        setEvents([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 2. Defensive filter — only if events is array
  const filteredEvents = Array.isArray(events)
    ? events.filter((event) => event.status === 'APPROVED') // example filter condition
    : [];

  if (loading) return <p>Loading events...</p>;

  if (error) return <p className="text-red-600">{error}</p>;

  if (filteredEvents.length === 0) return <p>No events found.</p>;

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredEvents.map((event) => (
        <div
          key={event.id}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
          <p className="text-gray-600 mb-2">{event.categoryName}</p>
          <p className="text-gray-700 mb-2 line-clamp-2">{event.description}</p>
          <p className="text-sm text-gray-500 mb-1">
            Location: {event.location}
          </p>
          <p className="text-sm text-gray-500 mb-1">
            Start: {new Date(event.startTime).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mb-1">
            Organizer: {event.organizerUsername}
          </p>
          <p className="text-sm text-gray-500">
            Capacity: {event.registeredCount} / {event.capacity}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AllEvents;
