import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import API from "../../services/axiosInstance";

const EditEventModal = ({ isOpen, onClose, eventData, onEventUpdated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "",
    latitude: "",
    longitude: "",
    capacity: "",
    categoryName: ""
  });

  useEffect(() => {
    if (eventData) {
      setFormData({
        title: eventData.title || "",
        description: eventData.description || "",
        startTime: eventData.startTime ? eventData.startTime.slice(0, 16) : "",
        endTime: eventData.endTime ? eventData.endTime.slice(0, 16) : "",
        location: eventData.location || "",
        latitude: eventData.latitude || "",
        longitude: eventData.longitude || "",
        capacity: eventData.capacity || "",
        categoryName: eventData.categoryName || ""
      });
    }
  }, [eventData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await API.put(`/event/${eventData.id}`, formData);
      onEventUpdated();
      onClose();
    } catch (err) {
      console.error("Error updating event:", err);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg rounded-xl bg-white p-6">
          <Dialog.Title className="text-lg font-bold">Edit Event</Dialog.Title>

          <div className="mt-4 space-y-3">
            <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full border p-2 rounded" />
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded" />
            <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange} className="w-full border p-2 rounded" />
            <input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange} className="w-full border p-2 rounded" />
            <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="w-full border p-2 rounded" />
            <input name="latitude" value={formData.latitude} onChange={handleChange} placeholder="Latitude" className="w-full border p-2 rounded" />
            <input name="longitude" value={formData.longitude} onChange={handleChange} placeholder="Longitude" className="w-full border p-2 rounded" />
            <input name="capacity" type="number" value={formData.capacity} onChange={handleChange} placeholder="Capacity" className="w-full border p-2 rounded" />
            <input name="categoryName" value={formData.categoryName} onChange={handleChange} placeholder="Category" className="w-full border p-2 rounded" />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            <button onClick={handleUpdate} className="px-4 py-2 bg-blue-600 text-white rounded">Update</button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditEventModal;
