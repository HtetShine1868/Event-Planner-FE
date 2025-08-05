import React, { useEffect, useState } from 'react';
import { getTrendingEvents } from '../../services/eventService';

const TrendingEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await getTrendingEvents();
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch trending events", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  if (loading) return <p>Loading trending events...</p>;

  return (
    <div>
      <h2>Trending Events</h2>
      {events.length === 0 ? (
        <p>No trending events right now.</p>
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

export default TrendingEvents;
