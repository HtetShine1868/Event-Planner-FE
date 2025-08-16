import React, { useEffect, useState } from 'react';
import EventCard from '../../components/EventCard';
import axiosInstance from '../../services/axiosInstance';

const RegisteredEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get('/registrations/my') // ✅ Adjust this endpoint to match your backend
      .then((res) => {
        setEvents(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching registered events:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500 mt-6">Loading registered events...</p>;
  }

  if (events.length === 0) {
    return <p className="text-center text-gray-500 mt-6">You haven’t registered for any events yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          showRegister={true}
          isRegistered={true} // ✅ This makes the button show "View Details"
        />
      ))}
    </div>
  );
};

export default RegisteredEvents;