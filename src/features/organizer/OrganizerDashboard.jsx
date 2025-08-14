// src/features/organizer/OrganizerDashboard.jsx
import React, { useEffect, useState } from 'react';
import API from '../../services/axiosInstance';
import Navibar from '../../components/Navibar';
import OrganizerEventCard from '../../components/common/OrganizerEventCard';

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

  const [formData, setFormData] = useState(initialFormData());
  const [formMode, setFormMode] = useState('create'); // "create" or "edit"
  const [feedback, setFeedback] = useState({ type: '', message: '' });

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
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: 'Failed to save event.' });
    }
  };

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
    } catch (err) {
      console.error(err);
      alert('Failed to delete event.');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto font-sans">
      <Navibar />
      <h1 className="text-3xl font-extrabold mb-6">Organizer Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${activeTab === 'myEvents' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          onClick={() => { setActiveTab('myEvents'); setFormMode('create'); setFormData(initialFormData()); }}
        >
          My Events
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'form' && formMode === 'create' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          onClick={() => { setActiveTab('form'); setFormMode('create'); setFormData(initialFormData()); }}
        >
          Create Event
        </button>
      </div>

      {/* My Events Tab */}
      {activeTab === 'myEvents' && (
        <>
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
                <option key={c.id} value={c.id}>{c.name}</option>
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
            <div className="space-y-4">
              {myEvents.map(event => (
                <OrganizerEventCard
                  key={event.id}
                  event={event}
                  onEdit={startEdit}
                  onDelete={handleDelete}
                />
              ))}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      className={`px-3 py-1 rounded ${i === page ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                      onClick={() => fetchMyEvents(i)}
                    >
                      {i + 1}
                    </button>
                  ))}
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
    </div>
  );
};

export default OrganizerDashboard;
