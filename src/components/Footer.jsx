// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-6 mt-8">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        
        {/* Logo / Brand */}
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-bold">Event Planner</h2>
          <p className="text-sm text-gray-300">Plan. Organize. Celebrate.</p>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-6 mb-4 md:mb-0">
          <Link to="/" className="hover:text-gray-400">Home</Link>
          <Link to="/events" className="hover:text-gray-400">Events</Link>
          <Link to="/about" className="hover:text-gray-400">About</Link>
          <Link to="/contact" className="hover:text-gray-400">Contact</Link>
        </div>

        {/* Copyright */}
        <div className="text-sm text-gray-400">
          © {new Date().getFullYear()} Event Planner. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
