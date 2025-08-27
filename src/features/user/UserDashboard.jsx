// src/features/user/UserDashboard.jsx
import React, { useEffect, useState, useRef } from 'react';
import API from '../../services/axiosInstance';
import EventCard from '../../components/common/EventCard';
import Navibar from '../../components/Navibar';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import OrganizerApplicationForm from "../../organizer/OrganizerApplicationForm";
import ChatbotUI from "../../components/ChatbotUI";
import RecommendedEvents from "../../features/events/RecommendedEvent";
import Footer from '../../components/Footer';
import NotificationBell from '../../components/NotificationBell';

const PAGE_SIZE = 6;

const UserDashboard = () => {
  // ===================== STATE (UNCHANGED LOGIC) =====================
  const [activeTab, setActiveTab] = useState('trending');

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

  const [filterCategoryId, setFilterCategoryId] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [category, setCategory] = useState('All');
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleUnauthorized = () => {
    alert('Session expired. Please login again.');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    gender: '',
    dateOfBirth: '',
    address: '',
  });

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

  // ===================== EFFECTS & DATA FETCH (UNCHANGED LOGIC) =====================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get('/event-categories');
        setCategories(res.data || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const fetchEvents = async (tab, page = 0) => {
    setLoading(true);
    try {
      let res;

      switch (tab) {
      case 'trending': {
        // For trending events, use the correct parameters that your backend expects
        const params = { 
          limit: PAGE_SIZE, // Your backend expects 'limit' not 'size'
          // page parameter might not be supported by your current backend
        };
        
        if (trendingCategory) 
          params.categoryId = trendingCategory;
        
        try {
          res = await API.get('/event/trending', { params });
          
          // Since your backend doesn't support pagination for trending events,
          // you'll need to handle pagination on the frontend
          const allTrendingEvents = res.data || [];
          const startIndex = page * PAGE_SIZE;
          const paginatedEvents = allTrendingEvents.slice(startIndex, startIndex + PAGE_SIZE);
          
          setTrendingEvents(paginatedEvents);
          setTrendingPage(page);
          setTrendingTotalPages(Math.ceil(allTrendingEvents.length / PAGE_SIZE));
        } catch (err) {
          console.error('Failed to fetch trending events', err);
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

          setRegisteredEventIds((prevSet) => {
            const newSet = new Set(prevSet);
            (res.data.content || []).forEach((event) => newSet.add(event.id));
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
        events.forEach((e) => allIds.add(e.id));
        totalPages = res.data.totalPages || 1;
        page++;
      }
      setRegisteredEventIds(allIds);
    } catch (error) {
      console.error('Error fetching all registered event IDs', error);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await API.post('/register', { eventId });
      alert('Successfully registered for the event!');
      setRegisteredEventIds((prev) => new Set(prev).add(eventId));
      fetchEvents('registered', 0);
      if (activeTab === 'all') fetchEvents('all', allPage);
    } catch (err) {
      console.error('Registration failed:', err);
      alert('Failed to register for the event. Please try again.');
    }
  };

  useEffect(() => {
    fetchEvents('trending', 0);
    fetchEvents('registered', 0);
  }, []);

  useEffect(() => {
    fetchEvents(activeTab, 0);
  }, [activeTab, filterCategoryId, filterLocation]);

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

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      alert('User not found.');
      return;
    }
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  // Add this useEffect to your component
useEffect(() => {
  if (activeTab === 'trending') {
    fetchEvents('trending', trendingPage);
  }
}, [trendingCategory, trendingPage, activeTab]); // Add trendingCategory as dependency

  // ===================== VIEW MODEL (UNCHANGED LOGIC) =====================
  const tabs = [
    { id: 'trending', label: 'Trending Events' },
    { id: 'registered', label: 'Registered Events' },
    { id: 'all', label: 'All Events' },
    { id: 'organizer', label: 'Organizer Application' },
    { id: 'recommended', label: 'Recommended' },
  ];

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
    default:
      break;
  }

  const filteredEvents = eventsToShow.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const buttons = [];
    for (let i = 0; i < totalPages; i++) {
      buttons.push(
        <button
          key={i}
          className={`px-4 py-2 rounded-full font-medium transition shadow-sm ${
            i === currentPage
              ? 'bg-indigo-600 text-white shadow'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => fetchEvents(activeTab, i)}
        >
          {i + 1}
        </button>
      );
    }
    return <div className="flex justify-center gap-3 mt-8">{buttons}</div>;
  };


  // ===================== UI =====================
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 font-sans flex flex-col">
      <Navibar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Header */}
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              User Dashboard
            </h1>

              <div className="flex items-center gap-4">
    

            <NotificationBell />

            {/* Right side: search + profile */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search events by title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-5 py-2.5 rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
                />
              </div>

              {/* Profile Button */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-full shadow-md hover:shadow-lg transition"
                  aria-haspopup="true"
                  aria-expanded={profileOpen}
                >
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

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 text-gray-700 z-20 animate-fade-in">
                    <div className="flex items-center gap-4 mb-5">
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
                      {/* Full Name */}
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-600">Full Name</p>
                          {!isEditing && (
                            <button
                              onClick={() => setIsEditing(true)}
                              aria-label="Edit Full Name"
                              title="Edit Profile"
                              className="text-indigo-600 hover:text-indigo-800 focus:outline-none"
                            >
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
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-400"
                          />
                        ) : (
                          <p className="mt-1">{user?.fullName || '-'}</p>
                        )}
                      </div>

                      {/* Gender */}
                      <div>
                        <p className="font-semibold text-gray-600">Gender</p>
                        {isEditing ? (
                          <select
                            name="gender"
                            value={editForm.gender}
                            onChange={handleEditChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-400"
                          >
                            <option value="">Select Gender</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                          </select>
                        ) : (
                          <p className="mt-1">{user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1).toLowerCase() : '-'}</p>
                        )}
                      </div>

                      {/* DOB */}
                      <div>
                        <p className="font-semibold text-gray-600">Date of Birth</p>
                        {isEditing ? (
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={editForm.dateOfBirth}
                            onChange={handleEditChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-indigo-400"
                          />
                        ) : (
                          <p className="mt-1">{user?.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : '-'}</p>
                        )}
                      </div>

                      {/* Address */}
                      <div>
                        <p className="font-semibold text-gray-600">Address</p>
                        {isEditing ? (
                          <textarea
                            name="address"
                            value={editForm.address}
                            onChange={handleEditChange}
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 resize-none focus:ring-2 focus:ring-indigo-400"
                          />
                        ) : (
                          <p className="mt-1">{user?.address || '-'}</p>
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex gap-3 mb-3">
                        <button
                          onClick={handleSaveProfile}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

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
            </div>
          </header>

          {/* Tabs */}
          <nav className="flex border-b border-gray-200 bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 text-center py-3 font-semibold transition-colors duration-300 ${
                  activeTab === tab.id
                    ? 'bg-indigo-50 border-b-4 border-indigo-600 text-indigo-700'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* ===================== TRENDING TAB ===================== */}
          {activeTab === 'trending' && (
            <div className="space-y-4">
              {/* Category Filter */}
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-sm font-medium text-gray-600">Category:</label>
                <select
                  value={trendingCategory}
                  onChange={(e) => {
                    const categoryId = e.target.value;
                    setTrendingCategory(categoryId);
                    setTrendingPage(0);
                    fetchEvents("trending", 0); // 🔹 refetch with selected category
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm max-w-xs"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Horizontal Carousel */}
              <div className="relative">
                <div className="flex gap-5 overflow-x-auto py-2 px-1 scrollbar-hide snap-x snap-mandatory">
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
                        if (isRegistered) return 'Registered';
                        if (eventEnded) return 'Event Ended';
                        return 'Register';
                      };

                      const getButtonStyle = () => {
                        if (isRegistered || eventEnded)
                          return 'bg-gray-200 text-gray-600 cursor-not-allowed';
                        return 'bg-indigo-600 text-white hover:bg-indigo-700';
                      };

                      return (
                        <div
                          key={event.id}
                          className="snap-start min-w-[280px] max-w-[320px] bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-transform transform hover:-translate-y-0.5"
                        >
                          {/* Card Header / Banner */}
                          <div className="h-36 bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white text-lg font-bold text-center p-3">
                            <span className="line-clamp-2">{event.title}</span>
                          </div>

                          <div className="p-4 space-y-2">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>📅 {new Date(event.startTime).toLocaleDateString()}</span>
                              <span>👥 {event.registeredCount || 0}</span>
                            </div>
                            <p className="text-sm text-gray-600">📍 {event.location || 'Online'}</p>

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

              {/* Pagination (if applicable for trending) */}
              {renderPagination()}
            </div>
          )}

          {/* ===================== ALL TAB FILTERS ===================== */}
          {activeTab === 'all' && (
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-600">Category:</label>
                <select
                  value={filterCategoryId}
                  onChange={(e) => {
                    const category = e.target.value;
                    setFilterCategoryId(category);
                    setAllPage(0);
                    fetchEvents('all', 0);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm max-w-xs"
                >
                  <option value="">All Categories</option>
                  <option value="1">Music</option>
                  <option value="3">Sports</option>
                  <option value="2">Tech</option>
                  <option value="4">Art</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-600">Location:</label>
                <input
                  type="text"
                  placeholder="Filter by location"
                  value={filterLocation}
                  onChange={(e) => {
                    setFilterLocation(e.target.value);
                    setAllPage(0);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm max-w-xs"
                />
              </div>
            </div>
          )}

          {/* ===================== ORGANIZER TAB ===================== */}
          {activeTab === 'organizer' && (
            <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Apply to Become an Organizer 🚀</h2>
              <OrganizerApplicationForm />
              <p className="text-sm text-gray-500 mt-6 text-center">We’ll review your application and get back to you via email.</p>
            </div>
          )}

          {/* ===================== RECOMMENDED TAB ===================== */}
          {activeTab === 'recommended' && user?.id && (
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Recommended Events For You</h2>
              <RecommendedEvents userId={user.id} />
            </div>
          )}

          {/* ===================== EVENTS LIST (Registered / All) ===================== */}
          <section>
            {loading ? (
              <p className="text-center text-gray-600">Loading events...</p>
            ) : error ? (
              <p className="text-center text-red-600">{error}</p>
            ) : filteredEvents.length === 0 && activeTab !== 'trending' ? (
              <p className="text-center text-gray-500">No events found.</p>
            ) : (
              <>
                {activeTab !== 'trending' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {filteredEvents.map((event) => (
                      <EventCard key={event.id} event={event} isRegistered={registeredEventIds.has(event.id)} />
                    ))}
                  </div>
                )}
                {/* Pagination controls */}
                {renderPagination()}
              </>
            )}
          </section>
        </div>
      </main>

      {/* Fade-in animation styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease forwards;
        }
        /* hide default scrollbar on supported browsers */
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Chatbot + Footer (unchanged) */}
      <div className="max-w-7xl mx-auto w-full px-6">
        <ChatbotUI />
      </div>
      <Footer />
    </div>
  );
};

export default UserDashboard;
