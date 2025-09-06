// src/features/organizer/OrganizerDashboard.jsx
  import React, { useEffect, useState, useRef } from 'react';
import API from '../../services/axiosInstance';
import Navibar from '../../components/Navibar';
import { useNavigate } from "react-router-dom";  
import { jwtDecode } from "jwt-decode"; 
import OrganizerEventCard from '../../components/common/OrganizerEventCard';
import { getApprovedEvents } from '../../services/eventService';
import ChatbotUI from "../../components/ChatbotUI";
import Footer from '../../components/Footer';
import NotificationBell from '../../components/NotificationBell';
import './OrganizerDashboard.css'



const PAGE_SIZE = 6;

const OrganizerDashboard = () => {
  const [activeTab, setActiveTab] = useState('myEvents');
  const [myEvents, setMyEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [approvedEvents, setApprovedEvents] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData());
  const [formMode, setFormMode] = useState('create');
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    gender: '',
    dateOfBirth: '',
    address: '',
  });

  function initialFormData() {
    return {
      id: null,
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      location: '',
      latitude: '',
      longitude: '',
      capacity: '',
      categoryId: '',
    };
  }

  const getOrganizerId = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split('.')[1])).id;
    } catch {
      return null;
    }
  };

  const fetchMyEvents = async (pageNumber = 0) => {
    const organizerId = getOrganizerId();
    if (!organizerId) {
      setError('Organizer ID not found. Please login again.');
      return;
    }
    setLoading(true);
    try {
      const params = {
        page: pageNumber,
        size: PAGE_SIZE,
        organizerId,
        search: searchTerm || null,
        status: selectedStatus || null,
        categoryId: selectedCategory || null,
      };
      const res = await API.get('/event/myevent', { params });
      setMyEvents(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
      setPage(pageNumber);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load events.');
    } finally {
      setLoading(false);
    }
  };
  const [stats, setStats] = useState({
  totalEvents: 0,
  pendingEvents: 0,
  totalAttendees: 0
});
const fetchStatistics = async () => {
  const organizerId = getOrganizerId();
  if (!organizerId) return;
  
  try {
    const response = await API.get(`/admin/statistics`);
    setStats({
      totalEvents: response.data.totalEvents || 0,
      pendingEvents: response.data.pendingEvents || 0,
      totalAttendees: response.data.totalAttendees || 0
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
  }
};
useEffect(() => {
  fetchCategories();
  fetchMyEvents(0);
  fetchStatistics(); // Add this line
}, []);
      
useEffect(() => {
  const organizerId = getOrganizerId();
  if (!organizerId) return;
  
  if (activeTab === 'myEvents') {
    fetchMyEvents(page);
  } else if (activeTab === 'analysis') {
    fetchApprovedEvents(page, organizerId);
  }
}, [page, activeTab]);

const fetchApprovedEvents = async (page, organizerId) => {
  try {
    const res = await API.get(
      `/event/myevent?organizerId=${organizerId}&status=APPROVED&page=${page}&size=${PAGE_SIZE}`
    );
    setApprovedEvents(res.data.content || []);
    setTotalPages(res.data.totalPages || 1);
  } catch (error) {
    console.error("Error fetching approved events", error);
  }
};

  const fetchCategories = async () => {
    try {
      const res = await API.get('/event-categories');
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchMyEvents(0);
  }, []);

 

  useEffect(() => {
    const timer = setTimeout(() => fetchMyEvents(0), 500);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedStatus, selectedCategory]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });
    try {
      if (formMode === 'create') {
        await API.post('/event', formData);
        setFeedback({ type: 'success', message: 'Event created successfully!' });
      } else {
        await API.put(`/event/${formData.id}`, formData);
        setFeedback({ type: 'success', message: 'Event updated successfully!' });
      }
      setFormData(initialFormData());
      setFormMode('create');
      setActiveTab('myEvents');
      fetchMyEvents(page);
      fetchStatistics(); 
    }
     catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Failed to save event.' });
    }
  };


      useEffect(() => {
        if (activeTab === 'analysis') {
          const fetch = async () => {
            try {
              const organizerId = getOrganizerId();
              const events = await getApprovedEvents(organizerId);
              console.log('Approved Events:', events); // Debugging
              setApprovedEvents(events);
            } catch (err) {
              console.error('Failed to fetch approved events', err);
            }
          };
          fetch();
        }
      }, [activeTab]);


  const startEdit = (event) => {
    setFormData({
      id: event.id,
      title: event.title,
      description: event.description,
      startTime: event.startTime.slice(0, 16),
      endTime: event.endTime.slice(0, 16),
      location: event.location,
      latitude: event.latitude || '',
      longitude: event.longitude || '',
      capacity: event.capacity,
      categoryId: event.categoryId || '',
    });
    setFormMode('edit');
    setActiveTab('form');
    setFeedback({ type: '', message: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await API.delete(`/event/${id}`);
      fetchMyEvents(page);
      fetchStatistics();
    } catch (err) {
      console.error(err);
      alert('Failed to delete event.');
    }
  };
  // Add this function to get user ID from token
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




// Add this useEffect to fetch user profile
useEffect(() => {
  const fetchUserProfile = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      console.error('User ID not found in token');
      return;
    }

    try {
      const res = await API.get(`/user/${userId}/profile`);
      setUser(res.data);
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  };

  fetchUserProfile();
}, []);

// Add these handler functions
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
    await API.put(`/user/${userId}/profile`, payload);
    setUser(payload);
    setIsEditing(false);
  } catch (err) {
    console.error('Failed to save profile', err);
    alert('Failed to save profile. Please try again.');
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

// Initialize edit form when user data loads
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
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
        >
          Previous
        </button>
        
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`px-4 py-2 rounded-lg ${
              i === page 
                ? "bg-indigo-600 text-white" 
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setPage(i)}
          >
            {i + 1}
          </button>
        ))}
        
        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
        >
          Next
        </button>
      </div>
    );
  };

  return (
 <div className="min-h-screen bg-gray-50 font-sans">
  <Navibar />
  {/* Header Container */}
  <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center bg-white rounded-xl shadow-md border border-gray-100">
    <h1 className="text-3xl font-extrabold text-gray-900">Organizer Dashboard</h1>
  <div className="flex items-center gap-4">
    <NotificationBell />
    {/* Profile Button */}
    <div className="relative" ref={profileRef}>
      <button
        onClick={() => setProfileOpen(!profileOpen)}
        className="flex items-center space-x-3 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition"
      >
        {/* Avatar */}
        <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
          {(user?.fullName
            ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase()
            : user?.username?.slice(0, 2).toUpperCase()) || "OR"}
        </div>

        {/* Name + Role */}
        <div className="text-left">
          <span className="block font-semibold text-gray-800 text-sm">
            {user?.fullName || user?.username || "Organizer"}
          </span>
          <span className="block text-xs text-gray-500">Event Organizer</span>
        </div>
      </button>

      {/* Dropdown */}
      {profileOpen && (
        <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 z-20">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold text-2xl">
              {(user?.fullName
                ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase()
                : user?.username?.slice(0, 2).toUpperCase()) || "OR"}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {user?.fullName || user?.username || "Organizer"}
              </h3>
              <p className="text-sm text-gray-500">{user?.email || "No email provided"}</p>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="space-y-4 text-sm mb-6">
            <div className="flex justify-between items-center">
              <p className="font-semibold text-gray-700">Full Name</p>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-indigo-600 hover:text-indigo-800 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            ) : (
              <p className="text-gray-600">{user?.fullName || "-"}</p>
            )}

            {/* Add gender, dateOfBirth, address fields similarly */}
      
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

          {/* Edit Buttons */}
          {isEditing && (
            <div className="flex space-x-3 mb-5">
              <button
                onClick={handleSaveProfile}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg font-medium transition"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-2 rounded-xl font-semibold transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  </div>
  </div>



<div className="max-w-7xl mx-auto px-6 mt-6 bg-white rounded-xl shadow-sm border border-gray-100">

    {/* Tabs */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex border-b border-gray-200">
        {[
          { key: "myEvents", label: "My Events", color: "purple" },
          { key: "form", label: "Create Event", color: "indigo" },
          { key: "analysis", label: "Analytics", color: "blue" },
        ].map((tab) => (
          <button
            key={tab.key}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors duration-200 ${
              activeTab === tab.key
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-indigo-600"
            }`}
            onClick={() => {
              if (tab.key === "form") {
                setFormMode("create");
                setFormData(initialFormData());
              }
              setActiveTab(tab.key);
              setPage(0);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-6">


      {/* My Events Tab */}
      {activeTab === "myEvents" && (
        <>
          {/* Statistics Cards - Add this section right here */}
          <section className="stats-section mb-6">
            <div className="stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Events Card */}
              <div className="stat-card bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center">
                <div className="stat-icon total-events w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-600">
                    <path d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3 className="text-xs font-medium text-gray-600">Total Events</h3>
                  <p className="stat-number text-xl font-bold text-gray-900">{stats.totalEvents}</p>
                </div>
              </div>

              {/* Pending Events Card */}
              <div className="stat-card bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center">
                <div className="stat-icon pending w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-yellow-600">
                    <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3 className="text-xs font-medium text-gray-600">Pending</h3>
                  <p className="stat-number text-xl font-bold text-gray-900">{stats.pendingEvents}</p>
                </div>
              </div>


              {/* Total Attendees Card */}
              <div className="stat-card bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center">
                <div className="stat-icon attendees w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3 className="text-xs font-medium text-gray-600">Attendees</h3>
                  <p className="stat-number text-xl font-bold text-gray-900">{stats.totalAttendees}</p>
                </div>
              </div>
            </div>
          </section>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border rounded w-64"
            />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border rounded"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border rounded"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Event Cards */}
          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : myEvents.length === 0 ? (
            <p className="text-center text-gray-500">No events found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myEvents.map((event) => (
                <OrganizerEventCard
                  key={event.id}
                  event={event}
                  onEdit={startEdit}
                  onDelete={handleDelete}
                />
              ))}

          {/* My Events Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 rounded ${
                    i === page ? "bg-indigo-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => setPage(i)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
              >
                Next
              </button>
            </div>
          )}
            </div>
          )}
        </>
      )}

      {/* Create/Edit Form */}
      {activeTab === 'form' && (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">{formMode === 'create' ? 'Create New Event' : 'Edit Event'}</h2>
          {feedback.message && (
            <div className={`mb-4 p-3 rounded ${feedback.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {feedback.message}
            </div>
          )}
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Title & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Category</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="px-3 py-2 border rounded"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col">
              <label className="mb-1 font-medium">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="px-3 py-2 border rounded"
                rows={3}
                required
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Start Time</label>
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium">End Time</label>
                <input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="px-3 py-2 border rounded"
                  required
                />
              </div>
            </div>

            {/* Location & Capacity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col md:col-span-2">
                <label className="mb-1 font-medium">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Capacity</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  className="px-3 py-2 border rounded"
                  required
                />
              </div>
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Latitude</label>
                <input
                  type="number"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                  className="px-3 py-2 border rounded"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Longitude</label>
                <input
                  type="number"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                  className="px-3 py-2 border rounded"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              {formMode === 'create' ? 'Create Event' : 'Update Event'}
            </button>
          </form>
        </div>
      )}
      
          {activeTab === "analysis" && (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {approvedEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-5 border border-gray-100"
              >
                <h2 className="text-xl font-bold text-gray-800 mb-3">{event.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">📍 Location</p>
                    <p className="font-medium">{event.location}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">👥 Total Attendees</p>
                    <p className="font-medium">{event.totalAttendees}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">🎯 Most Common Age Group</p>
                    <p className="font-medium">{event.mostCommonAgeGroup}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">⚧ Gender Distribution</p>
                    <div className="space-y-2">
                      {event.genderDistribution?.map((g, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2"
                        >
                          <span className="capitalize">{g.gender}</span>
                          <span className="text-sm text-gray-600">
                            {g.count} ({g.percentage}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/organizer/analysis/${event.id}`)}
                  className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  View Full Analysis
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 rounded ${
                    i === page ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => setPage(i)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
         </div>
     </div>
      </div>
        <ChatbotUI />
          <Footer />
    </div>
  );
};

export default OrganizerDashboard;