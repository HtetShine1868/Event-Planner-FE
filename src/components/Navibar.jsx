import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navibar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center relative">
      <div className="text-2xl font-bold">
        <Link to="/">Event Planner</Link>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((open) => !open)}
          className="flex items-center focus:outline-none"
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
          aria-label="Toggle menu"
          type="button"
        >
          {/* Hamburger icon */}
          <svg
            className="w-6 h-6 text-white"
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
          <ul
            className="absolute right-0 mt-2 w-48 bg-blue-900 text-white rounded-md shadow-lg ring-1 ring-black ring-opacity-30 z-50 animate-fadeIn slideDown"
            style={{ animationFillMode: 'forwards' }}
          >
            <li>
              <Link
                to="/"
                className="block px-4 py-2 hover:bg-blue-700 transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/events"
                className="block px-4 py-2 hover:bg-blue-700 transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                Event
              </Link>
            </li>
            <li>
              <Link
                to="/search"
                className="block px-4 py-2 hover:bg-blue-700 transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                Search
              </Link>
            </li>
              <li>
                <Link
                  to="/about"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 rounded-md hover:bg-indigo-600 hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>

            <li>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-4 py-2 hover:bg-red-600 hover:text-white transition-colors"
              >
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            transform: translateY(-10px);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.25s ease forwards;
        }

        .slideDown {
          animation: slideDown 0.25s ease forwards;
        }
      `}</style>
    </nav>
  );
};

export default Navibar;
