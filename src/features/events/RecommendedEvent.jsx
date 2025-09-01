import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../services/axiosInstance";
import dayjs from "dayjs";

const RecommendedEvents = ({ userId, refreshTrigger }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const navigate = useNavigate();

  // Fetch recommended events
  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      console.log("Fetching recommendations for user:", userId);
      
      // Add cache-buster parameter to ensure fresh data
      const res = await axios.get(`/event/recommendations/${userId}?limit=20&t=${Date.now()}`);
      
      console.log("All recommendations:", res.data);
      
      if (Array.isArray(res.data)) {
        // Filter by status only (backend should filter out registered events)
        const approvedEvents = res.data.filter(event => 
          event.status === 'APPROVED'
        );
        
        console.log("Approved events:", approvedEvents);
        setEvents(approvedEvents.slice(0, 8));
        setLastUpdated(Date.now());
      } else {
        console.log("Response is not an array:", res.data);
        setEvents([]);
      }
    } catch (err) {
      console.error("Failed to fetch recommendations:", err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchRecommendations();
    }
  }, [userId, refreshTrigger]);

  const formatDate = (dt) => (dt ? dayjs(dt).format('MMM D') : '');
  const formatTime = (dt) => (dt ? dayjs(dt).format('h:mm A') : '');

  const handleViewEvent = (event) => {
    navigate(`/events/${event.id}`, { 
      state: { 
        event: {
          ...event,
          // Ensure all required properties are included
          id: event.id,
          title: event.title,
          description: event.description,
          location: event.location,
          startTime: event.startTime,
          endTime: event.endTime,
          category: event.category,
          categoryName: event.category, // Use category as categoryName
          status: event.status,
          capacity: event.capacity || 50, // Default capacity
          registeredCount: event.registeredCount || 0, // Default registered count
          organizerUsername: event.organizerUsername || "Organizer" // Default organizer
        },
        fromTab: "recommended"
      } 
    });
  };

  const handleRefresh = () => {
    fetchRecommendations();
  };

  // Loading skeleton
  if (loading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
          <div className="h-40 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );

  // Empty state with helpful message
  if (events.length === 0) return (
    <div className="text-center p-8 bg-gray-50 rounded-xl border border-gray-200">
      <div className="text-gray-400 mb-4">
        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">No recommendations available</h3>
      <p className="text-gray-500 mb-4">
        {userId 
          ? "Try registering for some events to get personalized recommendations!"
          : "User information not available"
        }
      </p>
      <button
        onClick={handleRefresh}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        Refresh Recommendations
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">
            Recommended For You ({events.length} events)
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Updated: {dayjs(lastUpdated).format('h:mm A')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
            title="Refresh recommendations"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:-translate-y-1 cursor-pointer"
            onClick={() => handleViewEvent(event)}
          >
            {/* Event Image */}
            <div className="h-40 bg-gradient-to-r from-blue-400 to-purple-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-10">
                <h3 className="text-lg font-bold text-white line-clamp-1">{event.title}</h3>
                {event.category && (
                  <span className="inline-block px-2 py-1 bg-white/20 text-white text-xs rounded-full mt-1">
                    {event.category}
                  </span>
                )}
              </div>
            </div>

            {/* Event Content */}
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
                <span className="line-clamp-1">{event.location || "Online Event"}</span>
              </div>

              <p className="text-gray-600 text-sm line-clamp-2">
                {event.description || "Join us for an exciting event!"}
              </p>

              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-indigo-600">{event.registeredCount || 0}</span> attending
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewEvent(event);
                  }}
                  className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedEvents;