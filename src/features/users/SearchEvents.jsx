import React, { useState } from 'react';
import { searchEvents } from '../../services/eventService';

const SearchEvents = () => {
  const [query, setQuery] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    try {
      const data = await searchEvents({ keyword: query });
      setEvents(data);
    } catch (error) {
      console.error("Failed to search events", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Search Events</h2>
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          placeholder="Enter keyword"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Search
        </button>
      </form>

      {loading && <p>Searching...</p>}

      {!loading && events.length === 0 && <p>No events found.</p>}

      <div>
        {events.map(event => (
          <div key={event.id} className="border p-3 my-2 rounded shadow">
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <small>Starts at: {new Date(event.startTime).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchEvents;
