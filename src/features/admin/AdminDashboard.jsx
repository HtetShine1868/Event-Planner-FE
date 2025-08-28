import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import ChatbotUI from "../../components/ChatbotUI";
import Footer from '../../components/Footer';
import ReviewModal from '../../components/ReviewModal';
import DetailsModal from './DetailsModal';

// Create axios instance with interceptors for authentication
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
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

  // Filter states
  const [timeFilter, setTimeFilter] = useState('all');
  const [applicationTimeFilter, setApplicationTimeFilter] = useState('all');

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
  const [reviewModal, setReviewModal] = useState({
  isOpen: false,
  type: '', // 'event-approve', 'event-reject', 'app-approve', 'app-reject'
  itemId: null,
  itemName: '',
  title: ''
});

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
  const [detailsModal, setDetailsModal] = useState({
  isOpen: false,
  type: '', // 'event' or 'application'
  item: null
});
  
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
      const response = await axiosInstance.get('/admin/pending');
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
      
      const response = await axiosInstance.get('/admin/organizer-applications/pending');
      setPendingApplications(response.data);
    } catch (error) {
      console.error("Error fetching pending applications:", error);
      setError('Failed to fetch applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

// Get user ID from token - ensure it returns a numeric ID
// Get user ID from token - extract the numeric ID from principal
const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Token payload:', payload); // For debugging
    
    // The user ID is in the 'sub' field or might be in a custom field
    // Based on the Spring Security principal, it should be a numeric ID
    const userId = payload.userId || payload.sub;
    
    // If it's a string that contains letters and numbers, extract just the numeric part
    if (typeof userId === 'string' && /[a-zA-Z]/.test(userId)) {
      // This handles cases like "admin1" where we need to extract "1"
      const numericPart = userId.replace(/\D/g, '');
      return numericPart ? parseInt(numericPart, 10) : null;
    }
    
    // Return as number
    return typeof userId === 'number' ? userId : parseInt(userId, 10);
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
      const res = await axios.get(`/user/${userId}/profile`);
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

 const handleApproveEvent = async (eventId, feedback = '') => {
  try {
    setError('');
    await axiosInstance.put(`/admin/${eventId}/approve`, { feedback });
    fetchEvents();
    fetchStatistics();
  } catch (error) {
    console.error("Error approving event:", error);
    setError('Failed to approve event. Please try again.');
  }
};

const handleRejectEvent = async (eventId, feedback = '') => {
  try {
    setError('');
    await axiosInstance.put(`/admin/${eventId}/reject`, { feedback });
    fetchEvents();
    fetchStatistics();
  } catch (error) {
    console.error("Error rejecting event:", error);
    setError('Failed to reject event. Please try again.');
  }
};

const handleReviewApplication = async (applicationId, approved, feedback = '') => {
  try {
    setError('');
    await axiosInstance.post('/admin/organizer-application/review', {
      applicationId,
      decision: approved ? 'APPROVED' : 'REJECTED',
      feedback
    });
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
      await axiosInstance.put(`/user/${userId}/profile`, payload);
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

  // Filter events based on search term and time filter
  const filterEventsByTime = (events) => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    return events.filter(event => {
      const eventDate = new Date(event.createdAt || event.submissionDate);
      
      switch(timeFilter) {
        case 'last7days':
          return eventDate >= sevenDaysAgo;
        case 'last30days':
          return eventDate >= thirtyDaysAgo;
        case 'older':
          return eventDate < thirtyDaysAgo;
        default:
          return true;
      }
    });
  };

  const filteredEvents = filterEventsByTime(events).filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.organizer?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (event.location?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filter applications based on time filter
  const filterApplicationsByTime = (applications) => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    return applications.filter(application => {
      const appDate = new Date(application.submissionDate || application.createdAt);
      
      switch(applicationTimeFilter) {
        case 'last7days':
          return appDate >= sevenDaysAgo;
        case 'last30days':
          return appDate >= thirtyDaysAgo;
        case 'older':
          return appDate < thirtyDaysAgo;
        default:
          return true;
      }
    });
  };

  const filteredApplications = filterApplicationsByTime(pendingApplications);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch all statistics from the new endpoint
      const response = await axiosInstance.get('/admin/statistics');
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
    fetchStatistics();
  }, []);

  // Also call fetchStatistics when tab changes to refresh data
  useEffect(() => {
    fetchData();
    if (activeTab === 'events') {
      fetchStatistics();
    }
  }, [activeTab]);

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Admin Dashboard</h1>
            <p>Manage organizer applications and events</p>
          </div>
          
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

      {/* Main Content */}
      <main className="dashboard-main">
        {error && (
          <div className="error-alert">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {error}
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="tabs-navigation">
          <button 
            className={`tab ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Event Management
          </button>
          <button 
            className={`tab ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12H15M9 16H15M21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4H8L10 2H14L16 4H19C20.1046 4 21 4.89543 21 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Organizer Applications
          </button>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading data...</p>
            </div>
          )}
          
          {activeTab === 'events' && (
            <>
              {/* Statistics Cards */}
              <section className="stats-section">
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon total-events">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="stat-content">
                      <h3>Total Events</h3>
                      <p className="stat-number">{stats.totalEvents}</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon pending">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="stat-content">
                      <h3>Pending Review</h3>
                      <p className="stat-number">{stats.pendingReview}</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon approved">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="stat-content">
                      <h3>Approved</h3>
                      <p className="stat-number">{stats.approved}</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon attendees">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="stat-content">
                      <h3>Total Attendees</h3>
                      <p className="stat-number">{stats.totalAttendees}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Search and Filter Section */}
              <section className="search-filter-section">
                <div className="search-box">
                  <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search events by title, organizer, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  {searchTerm && (
                    <button 
                      className="clear-search"
                      onClick={() => setSearchTerm('')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                </div>
                
                <div className="filter-group">
                  <select 
                    value={timeFilter} 
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Time</option>
                    <option value="last7days">Last 7 Days</option>
                    <option value="last30days">Last 30 Days</option>
                    <option value="older">Older than 30 Days</option>
                  </select>
                  
                  <button onClick={fetchEvents} className="refresh-button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 4V9H4.58152M19.9381 11C19.446 7.05369 16.0796 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9M4.58152 9H9M20 20V15H19.4185M19.4185 15C18.2317 17.9318 15.3574 20 12 20C7.92038 20 4.55399 16.9463 4.06189 13M19.4185 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Refresh
                  </button>
                </div>
              </section>

              {/* Events Table */}
              <section className="table-section">
                <div className="table-header">
                  <h3>Pending Events <span className="count-badge">{filteredEvents.length}</span></h3>
                </div>
                
                <div className="table-container">
                  {filteredEvents.length > 0 ? (
                    <table className="data-table">
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
                        {filteredEvents.map(event => (
                          <tr     
                          key={event.id} 
                          onClick={() => setDetailsModal({ isOpen: true, type: 'event', item: event })} 
                          className="clickable-row">
                            <td>
                              <div className="event-details">
                                <strong className="event-title">{event.title}</strong>
                                <span className="event-category">{event.category}</span>
                              </div>
                            </td>
                            <td>
                              <div className="organizer-info">
                                <span className="organizer-name">{event.organizer?.name || 'N/A'}</span>
                              </div>
                            </td>
                            <td>
                              <div className="date-cell">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                {formatDate(event.eventDate)}
                              </div>
                            </td>
                            <td>
                              <div className="location-cell">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M17.6569 16.6569C16.7202 17.5935 14.7616 19.5521 13.4138 20.8999C12.6327 21.681 11.3677 21.6814 10.5866 20.9003C9.26234 19.576 7.34159 17.6553 6.34315 16.6569C3.21895 13.5327 3.21895 8.46734 6.34315 5.34315C9.46734 2.21895 14.5327 2.21895 17.6569 5.34315C20.781 8.46734 20.781 13.5327 17.6569 16.6569Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  <path d="M15 11C15 12.6569 13.6569 14 12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                {event.location || 'N/A'}
                              </div>
                            </td>
                            <td>
                              <div className="attendees-cell">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                {event.attendees || 0}
                              </div>
                            </td>
                            <td>
                              <span className={`status-badge ${event.status ? event.status.toLowerCase() : 'pending'}`}>
                                {event.status || 'PENDING'}
                              </span>
                            </td>
                            <td>
                              <div className="date-cell">
                                {formatDateTime(event.createdAt)}
                              </div>
                            </td>
                            <td>
                              {(!event.status || event.status === 'PENDING') && (
                                <div className="action-buttons">
                                  <button 
                                    className="btn-approve"
                                    onClick={() => setReviewModal({
                                    isOpen: true,
                                    type: 'event-approve',
                                    itemId: event.id,
                                    itemName: event.title,
                                    title: 'Approve Event'
                                  })}
                                  title="Approve Event"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  Approve
                                </button>
                                <button 
                                  className="btn-reject"
                                  onClick={() => setReviewModal({
                                    isOpen: true,
                                    type: 'event-reject',
                                    itemId: event.id,
                                    itemName: event.title,
                                    title: 'Reject Event'
                                  })}
                                  title="Reject Event"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  Reject
                                </button>
                              </div>
                              )}
                              {event.status && event.status !== 'PENDING' && (
                                <span className="processed-text">
                                  {event.status === 'APPROVED' ? 'Approved' : 'Rejected'}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="empty-state">
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <h3>No events found</h3>
                      <p>There are currently no events to display.</p>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}

          {activeTab === 'applications' && (
            <section className="applications-section">
              <div className="section-header">
                <div>
                  <h2>Organizer Applications</h2>
                  <p>Review and manage organizer applications</p>
                </div>
                <button onClick={fetchPendingApplications} className="refresh-button">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4V9H4.58152M19.9381 11C19.446 7.05369 16.0796 4 12 4C8.64262 4 5.76829 6.06817 4.58152 9M4.58152 9H9M20 20V15H19.4185M19.4185 15C18.2317 17.9318 15.3574 20 12 20C7.92038 20 4.55399 16.9463 4.06189 13M19.4185 15H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Refresh
                </button>
              </div>
              
              <div className="search-filter-section">
                <div className="filter-group">
                  <select 
                    value={applicationTimeFilter} 
                    onChange={(e) => setApplicationTimeFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Time</option>
                    <option value="last7days">Last 7 Days</option>
                    <option value="last30days">Last 30 Days</option>
                    <option value="older">Older than 30 Days</option>
                  </select>
                </div>
              </div>
              
              <div className="table-container">
                {filteredApplications.length > 0 ? (
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Applicant Details</th>
                        <th>Email</th>
                        <th>Submitted</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApplications.map(application => (
                        <tr    
                          key={application.id} 
                          onClick={() => setDetailsModal({ isOpen: true, type: 'application', item: application })} 
                          className="clickable-row">
                          <td>
                            <div className="applicant-details">
                              <strong className="applicant-name">{application.applicantName || 'N/A'}</strong>
                              {application.organization && (
                                <span className="organization">{application.organization}</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <a href={`mailto:${application.applicantEmail}`} className="email-link">
                              {application.applicantEmail || 'N/A'}
                            </a>
                          </td>
                          <td>
                            <div className="date-cell">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              {formatDateTime(application.submissionDate)}
                            </div>
                          </td>
                          <td>
                            <span className="status-badge pending">
                              PENDING
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="btn-approve"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setReviewModal({
                                  isOpen: true,
                                  type: 'app-approve',
                                  itemId: application.id,
                                  itemName: application.applicantName,
                                  title: 'Approve Application'
                                })
                              } }
                                title="Approve Application"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Approve
                              </button>
                              <button 
                                className="btn-reject"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setReviewModal({
                                  isOpen: true,
                                  type: 'app-reject',
                                  itemId: application.id,
                                  itemName: application.applicantName,
                                  title: 'Reject Application'
                                })
                              }}
                                title="Reject Application"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12H15M9 16H15M21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4H8L10 2H14L16 4H19C20.1046 4 21 4.89543 21 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <h3>No applications found</h3>
                    <p>There are currently no pending applications to review.</p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </main>
            {/* Add the ReviewModal here */}
      <ReviewModal
        isOpen={reviewModal.isOpen}
        onClose={() => setReviewModal({ isOpen: false, type: '', itemId: null, itemName: '' })}
        onConfirm={(decision, feedback) => {
          if (reviewModal.type.includes('event')) {
            if (decision) {
              handleApproveEvent(reviewModal.itemId, feedback);
            } else {
              handleRejectEvent(reviewModal.itemId, feedback);
            }
          } else {
            handleReviewApplication(reviewModal.itemId, decision, feedback);
          }
        }}
        title={reviewModal.title}
        type={reviewModal.type.includes('approve') ? 'Approve' : 'Reject'}
        itemName={reviewModal.itemName}
      />
      <DetailsModal
        isOpen={detailsModal.isOpen}
        onClose={() => setDetailsModal({ isOpen: false, type: '', item: null })}
        type={detailsModal.type}
        item={detailsModal.item}
        onApprove={detailsModal.type === 'event' ? handleApproveEvent : (id, feedback) => handleReviewApplication(id, true, feedback)}
        onReject={detailsModal.type === 'event' ? handleRejectEvent : (id, feedback) => handleReviewApplication(id, false, feedback)}
        formatDate={formatDate}
        formatDateTime={formatDateTime}
      />
      
      <ChatbotUI />
      <Footer />
    </div>
  );
};

export default AdminDashboard;