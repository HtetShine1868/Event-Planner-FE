// src/features/user/UserDashboard.jsx
import React, { useEffect, useState, useRef } from 'react';
import API from '../../services/axiosInstance';
import EventCard from '../../components/common/EventCard';
import Navibar from '../../components/Navibar';
import { useNavigate } from 'react-router-dom';
import { jwtDecode }from 'jwt-decode';
import OrganizerApplicationForm from "../../organizer/OrganizerApplicationForm";
import ChatbotUI from "../../components/ChatbotUI";
import RecommendedEvents from "../../features/events/RecommendedEvent";
import Footer from '../../components/Footer';

const PAGE_SIZE = 6;

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('trending'); 

  // Events and pagination states for each tab
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [trendingCategory, setTrendingCategory] = useState('');
  const [trendingPage, setTrendingPage] = useState(0);
  const [trendingTotalPages, setTrendingTotalPages] = useState(1);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [registeredEventIds, setRegisteredEventIds] = useState(new Set());
  const [registeredPage, setRegisteredPage] = useState(0);
  const [registeredTotalPages, setRegisteredTotalPages] = useState(1);

  const [allEvents, setAllEvents] = useState([]);
  const [allPage, setAllPage] = useState(0);
  const [allTotalPages, setAllTotalPages] = useState(1);
  
  // Filters for All Events tab
  const [filterCategoryId, setFilterCategoryId] = useState('');
  const [filterLocation, setFilterLocation] = useState(''); // filtered by category
  const [category, setCategory] = useState("All");
  const [categories, setCategories] = useState([]);


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const handleUnauthorized = () => {
    alert("Session expired. Please login again.");
    localStorage.removeItem('token');
    navigate('/login');
  };
  // Edit mode states for profile
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    gender: '',
    dateOfBirth: '',
    address: '',
  });

  // Extract userId from JWT token
  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decoded = jwtDecode(token);
      return decoded.id;
    } catch {
      return null;
    }
  };

  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await API.get("/event-categories"); // or your endpoint for categories
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  fetchCategories();
}, []);

const fetchEvents = async (tab, page = 0) => {
  setLoading(true);
  try {
    let res;

    switch (tab) {
      case "trending": {
        const params = { page, size: PAGE_SIZE };
        if (trendingCategory) params.categoryId = trendingCategory;
           try {
            const res = await API.get("/event/trending", { params });
            setTrendingEvents(res.data || []);
            setTrendingPage(page);
            } catch (err) {
              console.error("Failed to fetch trending events", err);
              setTrendingEvents([]);
            }
        break;
      }
      case 'registered': {
        const registeredParams = { page, size: PAGE_SIZE };
        res = await API.get('/registrations/my', { params: registeredParams });
        setRegisteredEvents(res.data.content || []);
        setRegisteredTotalPages(res.data.totalPages || 1);
        setRegisteredPage(page);

        setRegisteredEventIds(prevSet => {
          const newSet = new Set(prevSet);
          (res.data.content || []).forEach(event => newSet.add(event.id));
          return newSet;
        });
        break;
      }

      case 'all': {
        const allParams = { page, size: PAGE_SIZE };
        if (filterCategoryId) allParams.categoryId = filterCategoryId;
        if (filterLocation) allParams.location = filterLocation;

        res = await API.get('/event/search', { params: allParams });
        setAllEvents(res.data.content || []);
        setAllTotalPages(res.data.totalPages || 1);
        setAllPage(page);
        break;
      }

      default:
        break;
    }

    setError(null);
  } catch (err) {
    console.error(`Error fetching ${tab} events:`, err);
    setError(`Failed to load ${tab} events.`);
  } finally {
    setLoading(false);
  }
};



const fetchAllRegisteredEventIds = async () => {
  try {
    let page = 0;
    let totalPages = 1;
    let allIds = new Set();

    while (page < totalPages) {
      const res = await API.get(`/registrations/my?page=${page}&size=10`);
      const events = res.data.content || [];
      events.forEach(e => allIds.add(e.id));
      totalPages = res.data.totalPages || 1;
      page++;
    }
    setRegisteredEventIds(allIds);
  } catch (error) {
    console.error("Error fetching all registered event IDs", error);
  }
};

    const handleRegister = async (eventId) => {
    try {
      await API.post('/register', { eventId });  // Adjust endpoint & payload if needed
      alert('Successfully registered for the event!');
      // Update registeredEventIds to include the new event immediately
      setRegisteredEventIds(prev => new Set(prev).add(eventId));

      // Optionally: refetch registered events to keep data fresh
      fetchEvents('registered', 0);

      // If on "all" tab, refresh that too to reflect button state
      if (activeTab === 'all') fetchEvents('all', allPage);
    } catch (err) {
      console.error('Registration failed:', err);
      alert('Failed to register for the event. Please try again.');
    }
  };

  // Fetch initial data on mount for trending and registered tabs
  useEffect(() => {
    fetchEvents('trending', 0);
    fetchEvents('registered', 0);
  }, []);

  useEffect(() => {
  fetchEvents(activeTab, 0);
}, [activeTab, filterCategoryId, filterLocation]);

  // Fetch all events when tab, page or filters change
  useEffect(() => {
    if (activeTab === 'all') {
      fetchEvents('all', allPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, allPage, filterCategoryId, filterLocation]);
    useEffect(() => {
      if (activeTab === 'registered') {
        setRegisteredEventIds(new Set());
        fetchEvents('registered', 0);
      }
    }, [activeTab]);

  
  useEffect(() => {
  fetchAllRegisteredEventIds();
}, []);
  // Fetch user prcd eventplofile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = getUserIdFromToken();
      if (!userId) {
        console.error('User ID not found in token');
        setError('User not authenticated.');
        return;
      }

      setLoading(true);
        try {
          const res = await API.get(`/user/${userId}/profile`);
          setUser(res.data);
          setError(null);
        } catch (err) {
          if (err.response && err.response.status === 401) {
            handleUnauthorized();
          } else {
            setError('Failed to fetch profile. Please refresh.');
          }
        } finally {
          setLoading(false);
        }
    };

    fetchUserProfile();
  }, []);

  // Initialize edit form when user data loads or changes
  useEffect(() => {
    if (user) {
      setEditForm({
        fullName: user.fullName || '',
        gender: user.gender || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : '',
        address: user.address || '',
      });
    }
  }, [user]);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
        setIsEditing(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle profile edit input change
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      alert('User not found.');
      return;
    }

    // Prepare payload with gender uppercased
    const payload = {
      ...editForm,
      gender: editForm.gender ? editForm.gender.toUpperCase() : null,
    };

    try {
      setLoading(true);
      await API.put(`/user/${userId}/profile`, payload);
      setUser(payload);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error('Failed to save profile', err);
      setError('Failed to save profile. Please try again.');
      alert('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Cancel profile edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    if (user) {
      setEditForm({
        fullName: user.fullName || '',
        gender: user.gender || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : '',
        address: user.address || '',
      });
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Tabs config
  const tabs = [
    { id: 'trending', label: 'Trending Events' },
    { id: 'registered', label: 'Registered Events' },
    { id: 'all', label: 'All Events' },
    { id: 'organizer', label: 'Organizer Application' },
    { id: "recommended", label: "Recommended" }
  ];

  // Select events and pagination info for active tab
  let eventsToShow = [];
  let currentPage = 0;
  let totalPages = 1;
  switch (activeTab) {
    case 'trending':
      eventsToShow = trendingEvents;
      currentPage = trendingPage;
      totalPages = trendingTotalPages;
      break;
    case 'registered':
      eventsToShow = registeredEvents;
      currentPage = registeredPage;
      totalPages = registeredTotalPages;
      break;
    case 'all':
      eventsToShow = allEvents;
      currentPage = allPage;
      totalPages = allTotalPages;
      break;
  }

  // Filter events by search term (client-side)
  const filteredEvents = eventsToShow.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination buttons for events
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const buttons = [];
    for (let i = 0; i < totalPages; i++) {
      buttons.push(
        <button
          key={i}
          className={`px-3 py-1 rounded ${
            i === currentPage ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => fetchEvents(activeTab, i)}
        >
          {i + 1}
        </button>
      );
    }
    return (
      <div className="flex justify-center gap-2 mt-4">
        {buttons}
      </div>
    );
  };

  return (
        <div className="min-h-screen bg-gray-50 font-sans">  
      <Navibar />
      {/* Header */}
      <header className="flex justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-wide flex-shrink-0">
          User Dashboard
        </h1>

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

                {/* Editable profile fields */}
                <div className="mb-5 space-y-4 text-sm">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-600">Full Name</p>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        aria-label="Edit Full Name"
                        title="Edit Profile"
                        className="text-indigo-600 hover:text-indigo-800 focus:outline-none"
                      >
                        {/* Pencil SVG icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-7-7l6 6"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      name="fullName"
                      value={editForm.fullName}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded px-3 py-1"
                    />
                  ) : (
                    <p>{user?.fullName || '-'}</p>
                  )}

                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-600">Gender</p>
                  </div>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={editForm.gender}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded px-3 py-1"
                    >
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  ) : (
                    <p>{user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1).toLowerCase() : '-'}</p>
                  )}

                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-600">Date of Birth</p>
                  </div>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={editForm.dateOfBirth}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded px-3 py-1"
                    />
                  ) : (
                    <p>{user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : '-'}</p>
                  )}

                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-600">Address</p>
                  </div>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={editForm.address}
                      onChange={handleEditChange}
                      className="w-full border border-gray-300 rounded px-3 py-1 resize-none"
                      rows={3}
                    />
                  ) : (
                    <p>{user?.address || '-'}</p>
                  )}
                </div>

                {/* Save and Cancel buttons */}
                {isEditing && (
                  <div className="flex space-x-3 mb-4">
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-semibold"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {/* Logout */}
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
        <nav className="flex border-b border-gray-300 mb- w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 text-center pb-3 font-semibold transition-colors duration-300 ${
              activeTab === tab.id
                ? 'border-b-4 border-indigo-600 text-indigo-600'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
{/* Filters only for "Trending Events" tab */}

        {/* Trending Events Tab */}
        {activeTab === "trending" && (
          <div>
            {/* Category Filter */}
            <div className="flex flex-wrap gap-4 mb-6">
              <select
                value={trendingCategory}
                onChange={(e) => {
                  const categoryId = e.target.value;
                  setTrendingCategory(categoryId);
                  setTrendingPage(0); // reset page
                  fetchEvents("trending", 0); // fetch filtered events
                }}
                className="border border-gray-300 rounded px-3 py-2 max-w-xs"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

    {/* Horizontal Carousel / Event Cards */}
    <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2">
      {trendingEvents.length === 0 ? (
        <p className="text-gray-500 ml-3">No trending events found.</p>
      ) : (
        trendingEvents.map((event) => {
          const isRegistered = registeredEventIds.has(event.id);
          const eventEnded = new Date(event.endTime) < new Date();

          const handleClick = () => {
            if (!isRegistered && eventEnded) return;
            navigate(`/events/${event.id}`, { state: { event, isRegistered } });
          };

          const getButtonLabel = () => {
            if (isRegistered) return "Registered";
            if (eventEnded) return "Event Ended";
            return "Register";
          };

          const getButtonStyle = () => {
            if (isRegistered || eventEnded)
              return "bg-gray-300 text-gray-600 cursor-not-allowed";
            return "bg-indigo-600 text-white hover:bg-indigo-700";
          };

          return (
            <div
              key={event.id}
              className="min-w-[260px] bg-white shadow-lg rounded-lg overflow-hidden transform transition hover:scale-105"
            >
              {/* Gradient Header */}
              <div className="h-32 bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white text-lg font-bold text-center p-3">
                {event.title}
              </div>

              <div className="p-3 space-y-1">
                <p className="text-sm text-gray-500">
                  📅 {new Date(event.startTime).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  📍 {event.location || "Online"}
                </p>
                <p className="text-sm text-gray-500">
                  👥 {event.registeredCount || 0} registered
                </p>

                {/* CTA Button */}
                <button
                  onClick={handleClick}
                  disabled={!isRegistered && eventEnded}
                  className={`mt-3 w-full py-2 rounded-lg font-semibold transition ${getButtonStyle()}`}
                >
                  {getButtonLabel()}
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  </div>
)}


      {/* Filters only for "All Events" tab */}
      {activeTab === 'all' && (
        <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={filterCategoryId}
          onChange={(e) => {
            const category = e.target.value;
            setFilterCategoryId(category);
            setAllPage(0);
            fetchEvents('all', 0); // fetch immediately with updated filter
          }}
          className="border border-gray-300 rounded px-3 py-2 max-w-xs"
        >
          <option value="">All Categories</option>
          <option value="1">Music</option>
          <option value="3">Sports</option>
          <option value="2">Tech</option>
          <option value="4">Art</option>
        </select>
          <input
            type="text"
            placeholder="Filter by location"
            value={filterLocation}
            onChange={(e) => {
              setFilterLocation(e.target.value);
              setAllPage(0);
            }}
            className="border border-gray-300 rounded px-3 py-2 max-w-xs"
          />
        </div>
      )}

      {activeTab === 'organizer' && (
        <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
           Apply to Become an Organizer 🚀
          </h2>

    {/* Organizer Application Form */}
    <OrganizerApplicationForm />

    <p className="text-sm text-gray-500 mt-6 text-center">
      We’ll review your application and get back to you via email.
    </p>
  </div>
)}
{activeTab === "recommended" && user?.id && (
  <div className="p-4">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">
      Recommended Events For You
    </h2>
    <RecommendedEvents userId={user.id} />
  </div>
)}


      {/* Events */}
      <section>
        {loading ? (
          <p className="text-center text-gray-600">Loading events...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : filteredEvents.length === 0 ? (
          <p className="text-center text-gray-500">No events found.</p>
        ) : (
          <>
         {activeTab !== 'trending' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isRegistered={registeredEventIds.has(event.id)}
              />
            ))}
          </div>
)}
            {/* Pagination controls */}
            {renderPagination()}
          </>
        )}
      </section>

      {/* Fade-in animation styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease forwards;
        }
      `}</style>
     <ChatbotUI />
           
               <Footer />
    </div>
  );
};

export default UserDashboard;
