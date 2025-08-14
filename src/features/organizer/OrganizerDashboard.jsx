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

  // Registrations for selected event
  const [registrations, setRegistrations] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);

  // Search/filter
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, PENDING, APPROVED
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [categories, setCategories] = useState([]);

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

  // Handle unauthorized (token expiry)
  const handleUnauthorized = () => {
    alert('Session expired. Please login again.');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Fetch categories for filter
  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  // Fetch organizer events
  const fetchMyEvents = async (page = 0) => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const params = { page, size: PAGE_SIZE };
      if (searchTerm) params.search = searchTerm;
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (categoryFilter !== 'ALL') params.category = categoryFilter;

      const res = await API.get(`/organizers/${user.id}/events`, { params });
      setMyEvents(res.data.content || []);
      setMyEventsTotalPages(res.data.totalPages || 1);
      setMyEventsPage(page);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) handleUnauthorized();
      else {
        console.error('Failed to load events', err);
        setError('Failed to load events');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch registrations for selected event
  const fetchRegistrations = async (eventId) => {
    if (!eventId) return;
    setLoading(true);
    try {
      const res = await API.get(`/organizer/events/${eventId}/registrations`);
      setRegistrations(res.data || []);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) handleUnauthorized();
      else {
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
      const res = await API.get('/user/profile');
      setUser(res.data);
      setEditForm({
        fullName: res.data.fullName || '',
        gender: res.data.gender || '',
        dateOfBirth: res.data.dateOfBirth ? res.data.dateOfBirth.slice(0, 10) : '',
        address: res.data.address || '',
      });
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) handleUnauthorized();
      else {
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
      await API.put('/user/profile', {
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

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(null);
    if (tab === 'myEvents') fetchMyEvents(0);
    else if (tab === 'registrations' && selectedEventId) fetchRegistrations(selectedEventId);
  };

  // Event selection
  const handleSelectEvent = (eventId) => {
    setSelectedEventId(eventId);
    if (activeTab === 'registrations') fetchRegistrations(eventId);
  };

  // Debounce search/filter
  useEffect(() => {
    if (activeTab === 'myEvents') {
      const timer = setTimeout(() => fetchMyEvents(0), 300);
      return () => clearTimeout(timer);
    }
  }, [searchTerm, statusFilter, categoryFilter, user]);

  // Initial fetch
  useEffect(() => {
    fetchUserProfile();
    fetchCategories();
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Tabs
  const tabs = [
    { id: 'myEvents', label: 'My Events' },
    { id: 'create', label: 'Create Event' },
    { id: 'registrations', label: 'Registrations' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto relative font-sans">
      <Navibar />

      {/* Header */}
      <header className="flex justify-between items-center mb-6 gap-4 flex-wrap">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-wide flex-shrink-0">
          Organizer Dashboard
        </h1>

        <div className="flex items-center space-x-4 flex-shrink-0 flex-wrap gap-2">
          {/* Search */}
          <input
            type="text"
            placeholder="Search my events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 w-48"
          />

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-3 py-1 rounded focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border px-3 py-1 rounded focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Profile */}
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
                <div className="flex items-center space-x-4 mb-5">
                  <div className="w-16 h-16 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-2xl select-none">
                    {(user?.fullName
                      ? user.fullName.split(' ').map((n) => n[0]).join('').toUpperCase()
                      : user?.username?.slice(0, 2).toUpperCase()) || 'OR'}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{user?.fullName || user?.username || 'Organizer'}</h3>
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
                        className="text-indigo-600 hover:text-indigo-800 focus:outline-none"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.fullName}
                      onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-1"
                    />
                  ) : (
                    <p>{user?.fullName || '-'}</p>
                  )}

                  {/* Gender, DOB, Address */}
                  {['Gender', 'Date of Birth', 'Address'].map((field) => {
                    if (field === 'Gender') {
                      return isEditing ? (
                        <select
                          value={editForm.gender}
                          onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                          className="w-full border border-gray-300 rounded px-3 py-1"
                        >
                          <option value="">Select Gender</option>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                      ) : (
                        <p>{user?.gender || '-'}</p>
                      );
                    }
                    if (field === 'Date of Birth') {
                      return isEditing ? (
                        <input
                          type="date"
                          value={editForm.dateOfBirth}
                          onChange={(e) => setEditForm({ ...editForm, dateOfBirth: e.target.value })}
                          className="w-full border border-gray-300 rounded px-3 py-1"
                        />
                      ) : (
                        <p>{user?.dateOfBirth?.slice(0, 10) || '-'}</p>
                      );
                    }
                    if (field === 'Address') {
                      return isEditing ? (
                        <input
                          type="text"
                          value={editForm.address}
                          onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                          className="w-full border border-gray-300 rounded px-3 py-1"
                        />
                      ) : (
                        <p>{user?.address || '-'}</p>
                      );
                    }
                    return null;
                  })}
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      Save
                    </button>
                  </div>
                )}

                {!isEditing && (
                  <button
                    onClick={handleLogout}
                    className="mt-3 w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Logout
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-3 mb-5 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 font-medium rounded-t ${
              activeTab === tab.id ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : activeTab === 'myEvents' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myEvents.length === 0 && <p>No events found.</p>}
            {myEvents.map((event) => (
              <div key={event.id} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
                <h3 className="font-bold text-lg">{event.title}</h3>
                <p className="text-gray-600">{event.description}</p>
                <p className="text-sm text-gray-500">
                  {new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Location: {event.location}</p>
                <p className="text-sm text-gray-500">Category: {event.categoryName}</p>
                <p className="text-sm text-gray-500">Status: {event.status}</p>
                <button
                  onClick={() => handleSelectEvent(event.id)}
                  className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  View Registrations
                </button>
              </div>
            ))}
          </div>
        ) : activeTab === 'registrations' ? (
          <div>
            {registrations.length === 0 ? (
              <p>No registrations found for this event.</p>
            ) : (
              <table className="w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">ID</th>
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((r) => (
                    <tr key={r.id}>
                      <td className="p-2 border">{r.id}</td>
                      <td className="p-2 border">{r.fullName}</td>
                      <td className="p-2 border">{r.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <div>Create Event Form Goes Here...</div>
        )}
      </div>

      {/* Pagination */}
      {activeTab === 'myEvents' && myEventsTotalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2 flex-wrap">
          {Array.from({ length: myEventsTotalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => fetchMyEvents(i)}
              className={`px-3 py-1 rounded ${
                myEventsPage === i ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
