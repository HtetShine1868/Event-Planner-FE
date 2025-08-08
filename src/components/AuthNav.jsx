// src/components/AuthNav.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const AuthNav = () => (
  <div className="text-center mt-4 space-x-4">
    <Link to="/login" className="text-blue-600 hover:underline">
      Login
    </Link>
    <Link to="/register" className="text-green-600 hover:underline">
      Register
    </Link>
  </div>
);

export default AuthNav;
