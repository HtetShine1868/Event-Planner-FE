import React, { useEffect, useState } from 'react';
import api from '../../services/axiosInstance';
import axiosInstance from '../../services/axiosInstance';

const RegisteredEvents = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        const res = await axiosInstance.get('/registrations/my');
        setEvents(res.data);
      } catch (err) {
        setError('Failed to load registered events.');
        console.error(err);
      }
    };
    fetchRegisteredEvents();
  }, []);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!events.length) return <p>No registered events.</p>;

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Registered Events</h3>
      <ul>
        {events.map(event => (
          <li key={event.id} className="mb-2 border p-2 rounded">
            <h4 className="font-semibold">{event.title}</h4>
            <p>{event.description}</p>
            <p><small>{new Date(event.date).toLocaleDateString()}</small></p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RegisteredEvents;
