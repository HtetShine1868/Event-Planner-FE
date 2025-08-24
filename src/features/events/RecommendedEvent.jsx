import { useEffect, useState } from "react";
import axios from "../../services/axiosInstance";

const RecommendedEvents = ({ userId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/event/recommendations/${userId}?limit=5`);
        console.log("Recommended Events:", res.data); // DEBUG
        // Make sure we have a valid array
        if (Array.isArray(res.data)) {
          setEvents(res.data);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchRecommendations();
  }, [userId]);

  if (loading) return <p className="text-gray-600">Loading recommended events...</p>;
  if (events.length === 0) return <p className="text-gray-500">No recommended events found.</p>;

  return (
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {events.map((event) => (
    <div
      key={event.id}
      className="bg-white shadow rounded-lg overflow-hidden transform transition hover:scale-105 flex flex-col"
    >
      {/* Gradient Header */}
      <div className="h-20 sm:h-24 bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold text-center px-3">
        {event.title || "Untitled Event"}
      </div>

      {/* Content */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div className="space-y-1 text-sm text-gray-600">
          <p>📅 {event.startTime ? new Date(event.startTime).toLocaleDateString() : "-"} 
             {event.endTime ? ` - ${new Date(event.endTime).toLocaleDateString()}` : ""}</p>
          <p>📍 {event.location || "Online"}</p>
          <p>👥 {event.registeredCount || 0} registered</p>
        </div>

        <p className="text-gray-800 text-sm mt-2 line-clamp-3">
          {event.description || "No description available"}
        </p>

        <button
          disabled={false} 
          className="mt-3 py-2 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          View Event
        </button>
      </div>
    </div>
  ))}
</div>

  );
};

export default RecommendedEvents;
