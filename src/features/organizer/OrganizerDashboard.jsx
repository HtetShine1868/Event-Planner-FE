// src/features/organizer/OrganizerDashboard.jsx
import React, { useEffect, useState, useRef } from 'react';
import API from '../../services/axiosInstance';
import Navibar from '../../components/Navibar';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 6;

const OrganizerDashboard = () => {
  const [activeTab, setActiveTab] = useState('myEvents');

  // Organizer events and pagination
  const [myEvents, setMyEvents] = useState([]);
  const [myEventsPage, setMyEventsPage] = useState(0);
  const [myEventsTotalPages, setMyEventsTotalPages] = useState(1);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Registrations for selected event
  const [registrations, setRegistrations] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);

  // Profile and editing states
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    gender: '',
    dateOfBirth: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const profileRef = useRef(null);
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId'); // Assuming stored after login

  // Handle unauthorized (token expiry)
  const handleUnauthorized = () => {
    alert('Session expired. Please login again.');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Fetch organizer events
  const fetchMyEvents = async (page = 0) => {
    setLoading(true);
    try {
      const params = { page, size: PAGE_SIZE };
      if (searchTerm) params.search = searchTerm;
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (selectedCategory !== 'ALL') params.categoryId = selectedCategory;

      const res = await API.get('/event/organizers/${organizerId}/events', { params });
      setMyEvents(res.data.content || []);
      setMyEventsTotalPages(res.data.totalPages || 1);
      setMyEventsPage(page);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        handleUnauthorized();
      } else {
        console.error('Failed to load events', err);
        setError('Failed to load events');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await API.get('/event-categories');
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  // Fetch registrations for selected event
  const fetchRegistrations = async (eventId) => {
    if (!eventId) return;
    setLoading(true);
    try {
      const res = await API.get(`/organizer/my/events/${eventId}/registrations`);
      setRegistrations(res.data || []);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        handleUnauthorized();
      } else {
        console.error('Failed to load registrations', err);
        setError('Failed to load registrations');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch user profile
  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/user/${userId}/profile`);
      setUser(res.data);
      setEditForm({
        fullName: res.data.fullName || '',
        gender: res.data.gender || '',
        dateOfBirth: res.data.dateOfBirth ? res.data.dateOfBirth.slice(0, 10) : '',
        address: res.data.address || '',
      });
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        handleUnauthorized();
      } else {
        console.error('Failed to load profile', err);
        setError('Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  // Save profile edits
  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await API.put(`/user/${userId}/profile`, {
        ...editForm,
        gender: editForm.gender ? editForm.gender.toUpperCase() : '',
      });
      setUser(editForm);
      setIsEditing(false);
      setError(null);
      alert('Profile updated successfully');
    } catch (err) {
      console.error('Failed to save profile', err);
      alert('Failed to save profile. Please try again.');
      setError('Failed to save profile');
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

  // Outside click for profile dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
        setIsEditing(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(null);
    if (tab === 'myEvents') {
      fetchMyEvents(0);
    } else if (tab === 'registrations' && selectedEventId) {
      fetchRegistrations(selectedEventId);
    }
  };

  const handleSelectEvent = (eventId) => {
    setSelectedEventId(eventId);
    if (activeTab === 'registrations') {
      fetchRegistrations(eventId);
    }
  };

  // Search debounce
  useEffect(() => {
    if (activeTab === 'myEvents') {
      const timer = setTimeout(() => {
        fetchMyEvents(0);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  // Refetch when filters change
  useEffect(() => {
    if (activeTab === 'myEvents') {
      fetchMyEvents(0);
    }
  }, [statusFilter, selectedCategory]);

  // Init
  useEffect(() => {
    fetchUserProfile();
    fetchCategories();
    fetchMyEvents();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const tabs = [
    { id: 'myEvents', label: 'My Events' },
    { id: 'create', label: 'Create Event' },
    { id: 'registrations', label: 'Registrations' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto relative font-sans">
      <Navibar />

      {/* Header */}
      <header className="flex justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-wide">Organizer Dashboard</h1>

        {/* Profile */}
        <div className="flex items-center space-x-4">
          {/* Profile Button */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center space-x-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 focus:outline-none"
            >
              <div className="w-10 h-10 bg-white text-indigo-700 rounded-full flex items-center justify-center font-semibold text-lg select-none">
                {(user?.fullName
                  ? user.fullName.split(' ').map((n) => n[0]).join('').toUpperCase()
                  : user?.username?.slice(0, 2).toUpperCase()) || 'OR'}
              </div>
              <span className="font-medium">{user?.fullName || user?.username || 'Organizer'}</span>
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 p-5 text-gray-700 z-20 animate-fade-in">
                {/* Profile details omitted for brevity — keep your existing JSX */}
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
            onClick={() => handleTabChange(tab.id)}
            className={`pb-3 font-semibold ${
              activeTab === tab.id
                ? 'border-b-4 border-indigo-600 text-indigo-600'
                : 'text-gray-600 hover:text-indigo-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <section>
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : activeTab === 'myEvents' ? (
          <>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-4 items-center">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Search my events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            {myEvents.length === 0 ? (
              <p className="text-center text-gray-500">No events found.</p>
            ) : (
              <>
                <ul className="space-y-4">
                  {myEvents.map((event) => (
                    <li
                      key={event.id}
                      className="p-4 border rounded hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleSelectEvent(event.id)}
                    >
                      <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">{event.title}</h2>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            event.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-700'
                              : event.status === 'APPROVED'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {event.status}
                        </span>
                      </div>
                      <p>{event.location}</p>
                      <p>{new Date(event.startDate).toLocaleString()}</p>
                    </li>
                  ))}
                </ul>

                {/* Pagination */}
                {myEventsTotalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    {[...Array(myEventsTotalPages)].map((_, i) => (
                      <button
                        key={i}
                        className={`px-3 py-1 rounded ${
                          i === myEventsPage
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        onClick={() => fetchMyEvents(i)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        ) : activeTab === 'create' ? (
          <p>Event creation form will go here.</p>
        ) : activeTab === 'registrations' ? (
          selectedEventId ? (
            registrations.length === 0 ? (
              <p>No registrations for this event.</p>
            ) : (
              <ul className="space-y-2">
                {registrations.map((reg) => (
                  <li key={reg.id} className="p-2 border rounded">
                    <p>
                      <strong>{reg.userName}</strong> — {reg.userEmail}
                    </p>
                    <p>Registered on: {new Date(reg.registeredAt).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            )
          ) : (
            <p>Please select an event to view registrations.</p>
          )
        ) : null}
      </section>

      {/* Animation */}
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

export default OrganizerDashboard;
