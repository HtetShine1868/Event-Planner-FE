// ✅ src/features/user/AllEvents.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axiosInstance.get('/event');
        setEvents(res.data);
      } catch (error) {
        console.error('Failed to fetch approved events', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleRegister = (eventId) => {
    // Your register API logic here
    console.log('Registering for event:', eventId);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Approved Events</h2>
      {events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event.id} className="border p-4 rounded shadow">
              <h3 className="font-bold text-lg">{event.title}</h3>
              <p>{event.description}</p>
              <button
                onClick={() => handleRegister(event.id)}
                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
              >
                Register
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllEvents;