import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import ChatbotUI from "../../components/ChatbotUI";
import Footer from '../../components/Footer';

// Create axios instance with interceptors for authentication
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/admin',
});

// Add token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle authentication errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalEvents: 0,
    pendingReview: 0,
    approved: 0,
    totalAttendees: 0
  });
  
  // Profile state
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    gender: '',
    dateOfBirth: '',
    address: '',
  });
  const [user, setUser] = useState(null);

  // Check if user is admin
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'ADMIN') {
      navigate('/login');
      return;
    }
    fetchData();
    fetchUserProfile();
    fetchStatistics();
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchData = () => {
    if (activeTab === 'events') {
      fetchEvents();
    } else if (activeTab === 'applications') {
      fetchPendingApplications();
    }
  };
  useEffect(() => {
  if (activeTab === 'events') {
    fetchStatistics();
  }
}, [events]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get pending events
      const response = await axiosInstance.get('/pending');
      setEvents(response.data);
 
    } catch (error) {
      console.error("Error fetching events:", error);
      setError('Failed to fetch events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingApplications = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axiosInstance.get('/organizer-applications/pending');
      setPendingApplications(response.data);
    } catch (error) {
      console.error("Error fetching pending applications:", error);
      setError('Failed to fetch applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get user ID from token
  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.sub;
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  };

  // Fetch user profile
  const fetchUserProfile = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      console.error('User ID not found in token');
      return;
    }

    try {
      // Use your API instance to fetch user profile
      const res = await axios.get(`http://localhost:8080/api/user/${userId}/profile`);
      setUser(res.data);
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
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

  const handleApproveEvent = async (eventId) => {
    try {
      setError('');
      await axiosInstance.put(`/${eventId}/approve`);
      // Refresh events list after approval
      fetchEvents();
    } catch (error) {
      console.error("Error approving event:", error);
      setError('Failed to approve event. Please try again.');
    }
  };

  const handleRejectEvent = async (eventId) => {
    try {
      setError('');
      await axiosInstance.put(`/${eventId}/reject`);
      // Refresh events list after rejection
      fetchEvents();
    } catch (error) {
      console.error("Error rejecting event:", error);
      setError('Failed to reject event. Please try again.');
    }
  };

  const handleReviewApplication = async (applicationId, approved) => {
    try {
      setError('');
      await axiosInstance.post('/organizer-application/review', {
        applicationId,
        approved
      });
      // Refresh applications list after review
      fetchPendingApplications();
    } catch (error) {
      console.error("Error reviewing application:", error);
      setError('Failed to review application. Please try again.');
    }
  };

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
      // Use your API instance to update user profile
      await axios.put(`http://localhost:8080/api/user/${userId}/profile`, payload);
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
    localStorage.removeItem('role');
    navigate('/login');
  };

  // Filter events based on search term
  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.organizer?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (event.location?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

const fetchStatistics = async () => {
  try {
    setLoading(true);
    setError('');
    
    // Fetch all statistics from the new endpoint
    const response = await axiosInstance.get('/statistics');
    setStats({
      totalEvents: response.data.totalEvents || 0,
      pendingReview: response.data.pendingReview || 0,
      approved: response.data.approved || 0,
      totalAttendees: response.data.totalAttendees || 0
    });
    
  } catch (error) {
    console.error("Error fetching statistics:", error);
    setError('Failed to load dashboard statistics.');
    // Set default values to avoid UI breakage
    setStats({
      totalEvents: 0,
      pendingReview: 0,
      approved: 0,
      totalAttendees: 0
    });
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  const role = localStorage.getItem('role');
  if (role !== 'ADMIN') {
    navigate('/login');
    return;
  }
  fetchData();
  fetchUserProfile();
  fetchStatistics(); // Add this line
}, []);

// Also call fetchStatistics when tab changes to refresh data
useEffect(() => {
  fetchData();
  if (activeTab === 'events') {
    fetchStatistics(); // Refresh stats when switching to events tab
  }
}, [activeTab]);

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage organizer applications and events</p>
        </div>
        
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
                : user?.username?.slice(0, 2).toUpperCase()) || "AD"}
            </div>

            {/* Name + Role */}
            <div className="text-left">
              <span className="block font-semibold text-gray-800 text-sm">
                {user?.fullName || user?.username || "Admin"}
              </span>
              <span className="block text-xs text-gray-500">Administrator</span>
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
                    : user?.username?.slice(0, 2).toUpperCase()) || "AD"}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user?.fullName || user?.username || "Admin"}
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

                {/* Add other fields (gender, dateOfBirth, address) similarly */}
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
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Event Management
        </button>
        <button 
          className={`tab ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          Organizer Applications
        </button>
      </div>

      <div className="dashboard-content">
        {loading && <div className="loading">Loading...</div>}
        
        {activeTab === 'events' && (
          <>
          <section className="stats-section">
            <h2>Event Management</h2>
            <p>Review and manage event submissions</p>
            
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Events</h3>
                <p className="stat-number">{stats.totalEvents}</p>
              </div>
              <div className="stat-card">
                <h3>Pending Review</h3>
                <p className="stat-number">{stats.pendingReview}</p>
              </div>
              <div className="stat-card">
                <h3>Approved</h3>
                <p className="stat-number">{stats.approved}</p>
              </div>
              <div className="stat-card">
                <h3>Total Attendees</h3>
                <p className="stat-number">{stats.totalAttendees}</p>
              </div>
            </div>
          </section>

            <section className="search-section">
              <h3>Search Events</h3>
              <input
                type="text"
                placeholder="Search by title, organizer, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </section>

            <section className="events-table-section">
              <div className="table-container">
                <table className="events-table">
                  <thead>
                    <tr>
                      <th>Event Details</th>
                      <th>Organizer</th>
                      <th>Event Date</th>
                      <th>Location</th>
                      <th>Attendees</th>
                      <th>Status</th>
                      <th>Submitted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.length > 0 ? (
                      filteredEvents.map(event => (
                        <tr key={event.id}>
                          <td>
                            <div className="event-details">
                              <strong>{event.title}</strong>
                              <span className="event-category">{event.category}</span>
                            </div>
                          </td>
                          <td>{event.organizer?.name || 'N/A'}</td>
                          <td>
                            <span className="date-icon">☐</span> 
                            {formatDate(event.eventDate)}
                          </td>
                          <td>
                            <span className="location-icon">💷</span> 
                            {event.location || 'N/A'}
                          </td>
                          <td>
                            <span className="attendees-icon">📍</span> 
                            {event.attendees || 0}
                          </td>
                          <td>
                            <span className={`status-badge ${event.status ? event.status.toLowerCase() : 'pending'}`}>
                              {event.status || 'PENDING'}
                            </span>
                          </td>
                          <td>{formatDate(event.createdAt)}</td>
                          <td>
                            {(!event.status || event.status === 'PENDING') && (
                              <div className="action-buttons">
                                <button 
                                  className="btn-approve"
                                  onClick={() => handleApproveEvent(event.id)}
                                >
                                  ✓ Approve
                                </button>
                                <button 
                                  className="btn-reject"
                                  onClick={() => handleRejectEvent(event.id)}
                                >
                                  ✘ Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="no-data">
                          {events.length === 0 ? 'No events found' : 'No matching events found'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {activeTab === 'applications' && (
          <section className="applications-section">
            <h2>Organizer Applications</h2>
            <p>Review and manage organizer applications</p>
            
            <div className="table-container">
              <table className="applications-table">
                <thead>
                  <tr>
                    <th>Applicant Name</th>
                    <th>Email</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingApplications.length > 0 ? (
                    pendingApplications.map(application => (
                      <tr key={application.id}>
                        <td>{application.applicantName || 'N/A'}</td>
                        <td>{application.applicantEmail || 'N/A'}</td>
                        <td>{formatDate(application.submissionDate)}</td>
                        <td>
                          <span className="status-badge pending">
                            PENDING
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-approve"
                              onClick={() => handleReviewApplication(application.id, true)}
                            >
                              ✓ Approve
                            </button>
                            <button 
                              className="btn-reject"
                              onClick={() => handleReviewApplication(application.id, false)}
                            >
                              ✘ Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="no-data">
                        {loading ? 'Loading...' : 'No pending applications found'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
           <ChatbotUI />
           
               <Footer />
    </div>
  );
};

export default AdminDashboard;