import React, { useEffect, useState, useRef } from "react";
import { Bell, X, CheckCircle, Settings } from "lucide-react";
import API from "../services/axiosInstance";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className={`relative p-2 rounded-full transition-all duration-300 ${
          open ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100 text-gray-600"
        }`}
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1 min-w-[18px] h-[18px] flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-xl overflow-hidden z-50 border border-gray-100 animate-scaleIn">
          <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 text-lg">Notifications</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                  title="Mark all as read"
                >
                  <CheckCircle size={14} className="mr-1" />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="p-6 flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell size={48} className="mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500 font-medium">No notifications yet</p>
              <p className="text-sm text-gray-400 mt-1">We'll notify you when something arrives</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 border-b border-gray-100 transition-all duration-200 ${
                    n.read ? "bg-white" : "bg-blue-50 border-l-4 border-l-blue-500"
                  } hover:bg-gray-50 cursor-pointer`}
                  onClick={() => !n.read && markAsRead(n.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className={`text-sm ${n.read ? "text-gray-700" : "text-gray-900 font-medium"}`}>
                        {n.message}
                      </div>
                      <div className="text-xs text-gray-400 mt-2 flex items-center">
                        <span>{new Date(n.createdAt).toLocaleString()}</span>
                        {!n.read && (
                          <span className="ml-2 inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                        )}
                      </div>
                    </div>
                    {!n.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(n.id);
                        }}
                        className="text-gray-400 hover:text-blue-600 ml-2"
                        title="Mark as read"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
            <button 
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              onClick={fetchNotifications}
            >
              Refresh notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;