import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/axiosInstance";
import dayjs from "dayjs";

const RecommendedEvents = ({ userId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/event/recommendations/${userId}?limit=10`);
        
        if (Array.isArray(res.data)) {
          // Filter to show only APPROVED events
          const approvedEvents = res.data.filter(event => 
            event.status === 'APPROVED'
          );
          setEvents(approvedEvents.slice(0, 5));
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

  const formatDate = (dt) => (dt ? dayjs(dt).format('MMM D') : '');
  const formatTime = (dt) => (dt ? dayjs(dt).format('h:mm A') : '');

  const handleViewEvent = (event) => {
    navigate(`/events/${event.id}`, { state: { event } });
  };

  if (loading) return <p className="text-gray-600 p-4">Loading recommended events...</p>;
  if (events.length === 0) return <p className="text-gray-500 p-4">No recommended events available.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {events.map((event) => (
        <div
          key={event.id}
          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:-translate-y-1"
        >
          {/* Image placeholder */}
          <div className="h-40 bg-gradient-to-r from-blue-400 to-purple-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10">
              <h3 className="text-lg font-bold text-white line-clamp-1">{event.title}</h3>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(event.startTime)} • {formatTime(event.startTime)}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <span className="line-clamp-1">{event.location || "Online"}</span>
            </div>

            <p className="text-gray-600 text-sm line-clamp-2">
              {event.description || "No description available"}
            </p>

            <div className="flex justify-between items-center pt-2">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">{event.registeredCount || 0}</span> registered
              </div>
              
              <button
                onClick={() => handleViewEvent(event)}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecommendedEvents;