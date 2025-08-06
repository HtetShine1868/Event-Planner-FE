// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import { registerUser } from '../../services/authService';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await loginUser(form);
      navigate('/user-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side with background gradient */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-tr from-blue-600 to-purple-700 items-center justify-center p-10 text-white">
        <div>
          <h1 className="text-5xl font-extrabold mb-6">Welcome Back!</h1>
          <p className="text-lg max-w-md">
            Log in to continue exploring, managing, and registering for your favorite events with EventPlanner.
          </p>
        </div>
      </div>

      {/* Right side: login form */}
      <div className="flex w-full md:w-1/2 justify-center items-center bg-white p-8">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
              />
              <span
                className="absolute right-3 top-3 cursor-pointer text-sm text-indigo-600 font-semibold"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Don’t have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
