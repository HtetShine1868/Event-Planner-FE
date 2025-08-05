import React, { useEffect, useState } from 'react';
import { getAllApprovedEvents, registerForEvent } from '../../services/eventService';
import { getUser } from '../../utils/auth';

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(null);
  const user = getUser();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllApprovedEvents();
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch approved events", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleRegister = async (eventId) => {
    setRegistering(eventId);
    try {
      await registerForEvent(eventId, user.id);
      alert("Successfully registered!");
      // Optionally update UI or refetch registered events
    } catch (error) {
      alert("Failed to register: " + (error.response?.data?.message || error.message));
    } finally {
      setRegistering(null);
    }
  };

  if (loading) return <p>Loading approved events...</p>;

  return (
    <div>
      <h2>All Approved Events</h2>
      {events.length === 0 ? (
        <p>No approved events available.</p>
      ) : (
        events.map(event => (
          <div key={event.id} className="border p-3 my-2 rounded shadow flex justify-between items-center">
            <div>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <small>Starts at: {new Date(event.startTime).toLocaleString()}</small>
            </div>
            <button
              disabled={registering === event.id}
              onClick={() => handleRegister(event.id)}
              className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded"
            >
              {registering === event.id ? "Registering..." : "Register"}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default AllEvents;
