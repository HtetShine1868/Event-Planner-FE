import React, { useEffect, useState } from 'react';
import { getMyRegisteredEvents } from '../../services/eventService';
import { getUser } from '../../utils/auth';

const RegisteredEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getMyRegisteredEvents(user.id);
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch registered events", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [user.id]);

  if (loading) return <p>Loading your registered events...</p>;

  return (
    <div>
      <h2>My Registered Events</h2>
      {events.length === 0 ? (
        <p>You have not registered for any events yet.</p>
      ) : (
        events.map(event => (
          <div key={event.id} className="border p-3 my-2 rounded shadow">
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <small>Starts at: {new Date(event.startTime).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default RegisteredEvents;
