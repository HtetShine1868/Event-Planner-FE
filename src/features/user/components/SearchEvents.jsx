import React, { useState } from 'react';
import { searchEvents } from '../../../services/eventService';

const SearchEvents = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const data = await searchEvents(query);
      setResults(data);
    } catch (err) {
      console.error('Search failed', err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Search Events</h2>
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events by title or keyword"
          className="flex-1 border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Search
        </button>
      </form>

      {results.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul className="space-y-4">
          {results.map((event) => (
            <li key={event.id} className="border p-4 rounded shadow">
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <p>{event.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchEvents;
