// ✅ src/features/user/TrendingEvents.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';

const TrendingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axiosInstance.get('/event/trending');
        setEvents(res.data);
      } catch (error) {
        console.error('Failed to fetch trending events', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Trending Events</h2>
      {events.length === 0 ? (
        <p>No trending events found.</p>
      ) : (
        <ul className="space-y-2">
          {events.map((event) => (
            <li key={event.id} className="border p-2 rounded">
              <p>{event.title}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TrendingEvents;