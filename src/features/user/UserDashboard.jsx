import React, { useEffect, useState, useRef } from 'react';
import API from '../../services/axiosInstance';
import EventCard from '../../components/common/EventCard';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('trending');
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const [trendingRes, registeredRes, allRes] = await Promise.all([
          API.get('/event/trending'),
          API.get('/registrations/my'),
          API.get('/event'),
        ]);

        setTrendingEvents(Array.isArray(trendingRes.data) ? trendingRes.data : []);
        setRegisteredEvents(Array.isArray(registeredRes.data) ? registeredRes.data : []);
        setAllEvents(Array.isArray(allRes.data) ? allRes.data : []);
      } catch {
        setError('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get('/user/profile');
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const tabs = [
    { id: 'trending', label: 'Trending Events' },
    { id: 'registered', label: 'Registered Events' },
    { id: 'all', label: 'All Events' },
  ];

  let eventsToShow = [];
  if (activeTab === 'trending') eventsToShow = trendingEvents;
  else if (activeTab === 'registered') eventsToShow = registeredEvents;
  else if (activeTab === 'all') eventsToShow = allEvents;

  const filteredEvents = eventsToShow.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto relative font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-wide flex-shrink-0">User Dashboard</h1>

        {/* Right side: search bar + profile */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search events by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 max-w-xs w-full"
          />

          {/* Profile Button */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 focus:outline-none"
              aria-haspopup="true"
              aria-expanded={profileOpen}
            >
              {/* Circle avatar with initials */}
              <div className="w-10 h-10 bg-white text-indigo-700 rounded-full flex items-center justify-center font-semibold text-lg select-none">
                {(user?.fullName
                  ? user.fullName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                  : user?.username?.slice(0, 2).toUpperCase()) || 'US'}
              </div>
              <span className="font-medium">{user?.fullName || user?.username || 'User'}</span>

              <svg
                className={`w-5 h-5 text-white transform transition-transform duration-300 ${
                  profileOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 p-5 text-gray-700 z-20 animate-fade-in">
                <div className="flex items-center space-x-4 mb-5">
                  <div className="w-16 h-16 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-2xl select-none">
                    {(user?.fullName
                      ? user.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                      : user?.username?.slice(0, 2).toUpperCase()) || 'US'}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{user?.fullName || user?.username || 'User'}</h3>
                    <p className="text-sm text-gray-500">{user?.email || 'No email provided'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-5">
                  <div>
                    <p className="font-semibold text-gray-600">Username</p>
                    <p>{user?.username || '-'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Gender</p>
                    <p>{user?.gender || '-'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Date of Birth</p>
                    <p>{user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : '-'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-600">Address</p>
                    <p>{user?.address || '-'}</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-2 rounded-xl font-semibold shadow-md transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Tabs */}
      <nav className="flex space-x-6 border-b border-gray-300 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 font-semibold transition-colors duration-300 ${
              activeTab === tab.id
                ? 'border-b-4 border-indigo-600 text-indigo-600'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Events */}
      <section>
        {loading ? (
          <p className="text-center text-gray-600">Loading events...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : filteredEvents.length === 0 ? (
          <p className="text-center text-gray-500">No events found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* Add fade-in animation styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;
