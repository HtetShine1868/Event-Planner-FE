// src/features/auth/LoginPage.jsx
import { jwtDecode } from 'jwt-decode';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axiosInstance.post('/auth/login', form);
      const token = res.data.token;

      // Decode the token to get the role
      const decoded = jwtDecode(token);
      const role = decoded.role;

      // Store token and role in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);

      // Redirect user to dashboard based on role
      if (role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else if (role === 'ORGANIZER') {
        navigate('/organizer-dashboard');
      } else if (role === 'USER') {
        navigate('/user-dashboard');
      } else {
        // fallback redirect
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-tr from-blue-600 to-purple-700 items-center justify-center p-10 text-white">
        <div>
          <h1 className="text-5xl font-extrabold mb-6">Welcome Back!</h1>
          <p className="text-lg max-w-md">
            Log in to access your personalized event dashboard and explore exciting events tailored for you.
          </p>
        </div>
      </div>

      {/* Right side */}
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
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{' '}
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
