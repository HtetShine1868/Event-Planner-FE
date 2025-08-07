import React, { useEffect, useState } from 'react';
import API from '../../../services/axiosInstance';

const RegisteredEvents = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get('/registrations/my')  // your actual API endpoint
      .then(res => {
        if (Array.isArray(res.data)) {
          setEvents(res.data);
        } else {
          setError('Invalid data format received');
          setEvents([]);
        }
      })
      .catch(err => {
        setError('Failed to load registered events');
        setEvents([]);
      });
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      {Array.isArray(events) && events.length > 0 ? (
        events.map(event => (
          <div key={event.id} className="p-4 border mb-2 rounded shadow">
            <h3 className="font-bold">{event.title}</h3>
            {/* render more event details as you want */}
          </div>
        ))
      ) : (
        <p>No registered events found.</p>
      )}
    </div>
  );
};

export default RegisteredEvents;
