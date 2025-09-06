import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navibar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 text-white px-6 py-2 shadow-md sticky top-0 z-50 mb-4">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold tracking-wide">
          <Link to="/" className="hover:opacity-90 transition">
            Event Planner
          </Link>
        </div>

        {/* Dropdown (mobile / profile) */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((open) => !open)}
            className="p-2 rounded-full bg-white text-indigo-700 hover:bg-indigo-100 transition flex items-center justify-center focus:outline-none"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
            aria-label="Toggle menu"
            type="button"
          >
            {/* Hamburger icon */}
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {dropdownOpen && (
            <ul className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-10 z-50 animate-fadeIn">
              <li>
                <Link
                  to="/"
                  className="block px-4 py-2 hover:bg-indigo-50 transition rounded-t-lg"
                  onClick={() => setDropdownOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/user-prf"
                  className="block px-4 py-2 hover:bg-indigo-50 transition"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/chatbot"
                  className="block px-4 py-2 hover:bg-indigo-50 transition"
                  onClick={() => setDropdownOpen(false)}
                >
                  Chatbot
                </Link>
              </li>
              <li>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 transition rounded-b-lg"
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease forwards;
        }
      `}</style>
    </nav>
  );
};

export default Navibar;