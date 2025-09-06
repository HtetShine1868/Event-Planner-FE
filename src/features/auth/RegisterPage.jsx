// src/features/auth/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = registration, 2 = OTP
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setError('');
  };

  const extractErrorMessage = (err, fallback = 'Something went wrong.') => {
    if (err.response) {
      const data = err.response.data;
      if (data?.error && data?.details) return `${data.error}: ${data.details}`;
      if (data?.message) return data.message;
      if (typeof data === 'string') return data;
      return JSON.stringify(data);
    } else if (err.request) {
      return 'No response from server. Please check your network.';
    } else {
      return err.message || fallback;
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axiosInstance.post('/auth/register-request', form);
      setStep(2);
    } catch (err) {
      console.error(err);
      setError(extractErrorMessage(err, 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.post('/auth/verify-email', {
        email: form.email,
        code: otp,
      });
      const token = res.data.token;
      localStorage.setItem('token', token);
      navigate('/user-profile-form');
    } catch (err) {
      console.error(err);
      setError(extractErrorMessage(err, 'OTP verification failed.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-tr from-blue-600 to-purple-700 items-center justify-center p-10 text-white">
        <div>
          <h1 className="text-5xl font-extrabold mb-6">Join EventPlanner Today!</h1>
          <p className="text-lg max-w-md">
            Discover and manage events seamlessly with our easy-to-use platform. Create your account and start exploring!
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex w-full md:w-1/2 justify-center items-center bg-white p-8">
        <div className="max-w-md w-full">
          {step === 1 && (
            <>
              <h2 className="text-3xl font-bold mb-6 text-center">Create Account</h2>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded flex items-start gap-2 break-words">
                  <span className="text-xl">❌</span>
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-5">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
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
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition"
                >
                  {loading ? 'Sending OTP...' : 'Register'}
                </button>
              </form>
              <p className="mt-6 text-center text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                  Login
                </Link>
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-3xl font-bold mb-6 text-center">Verify Email</h2>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded flex items-start gap-2 break-words">
                  <span className="text-xl">❌</span>
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={handleOtpChange}
                  required
                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
