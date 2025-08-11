// src/features/user/components/TrendingEvents.jsx
import { useEffect, useState } from 'react';
import API from '../../../services/axiosInstance';

const TrendingEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    API.get('/event/trending')
      .then((res) => setEvents(res.data))
      .catch((err) => console.error('Failed to load trending events', err));
  }, []);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Trending Events</h3>
      {events.length === 0 ? (
        <p className="text-gray-500">No trending events available.</p>
      ) : (
        <ul className="grid gap-2">
          {events.map((event) => (
            <li key={event.id} className="p-3 border rounded shadow">
              <h4 className="font-bold">{event.title}</h4>
              <p className="text-sm text-gray-600">{event.date}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TrendingEvents;
