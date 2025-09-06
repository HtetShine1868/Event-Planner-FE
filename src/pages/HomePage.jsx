import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarDays, Users, Sparkles } from "lucide-react";

const HomePage = () => {
  useEffect(() => {
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    const toggleMenu = () => {
      mobileMenu.classList.toggle("hidden");
    };

    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener("click", toggleMenu);
    }

    const smoothLinks = document.querySelectorAll('a[href^="#"]');
    smoothLinks.forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        mobileMenu.classList.add("hidden");
      });
    });

    const handleScroll = () => {
      const nav = document.querySelector("nav");
      if (window.scrollY > 100) {
        nav.classList.add("shadow-xl");
      } else {
        nav.classList.remove("shadow-xl");
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      if (mobileMenuBtn) {
        mobileMenuBtn.removeEventListener("click", toggleMenu);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold gradient-text">Event Planner</h1>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#home" className="nav-link text-gray-900 hover:text-purple-600 px-3 py-2 text-sm font-medium">
                  Home
                </a>
                <a href="#about" className="nav-link text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium">
                  About
                </a>
                <Link to="/login" className="nav-link text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn-gradient text-white px-6 py-2 rounded-full text-sm font-medium">
                  Register
                </Link>
              </div>
            </div>

            {/* Mobile Menu Btn */}
            <div className="md:hidden">
              <button id="mobile-menu-btn" className="text-gray-700 hover:text-purple-600 focus:outline-none">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div id="mobile-menu" className="md:hidden hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#home" className="block px-3 py-2 text-gray-900 hover:text-purple-600 font-medium">
              Home
            </a>
            <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-purple-600">
              About
            </a>
            <Link to="/login" className="block px-3 py-2 text-gray-700 hover:text-purple-600">
              Login
            </Link>
            <Link to="/register" className="block px-3 py-2 text-purple-600 font-medium">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="home" className="gradient-bg py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-purple-200">
            Plan Your Perfect Event
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-purple-300 max-w-3xl mx-auto">
            From intimate gatherings to grand celebrations, we help you create unforgettable moments with seamless event planning tools.
          </p>
        </div>
      </section>




      {/* Features */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Why Choose Our Event Planner?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover the features that make event planning effortless and enjoyable</p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Feature 1 */}
            <FeatureCard title="Smart Scheduling" text="Intelligent calendar integration that helps you find the perfect date and time for your event." icon="calendar" />
            {/* Feature 2 */}
            <FeatureCard title="Guest Management" text="Effortlessly manage invitations, RSVPs, and guest communications all in one place." icon="users" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* Feature 3 */}
            <FeatureCard title="Pros for Users" text="Intuitive interface for easy event discovery, seamless RSVP process, and personalized event recommendations." icon="user" />
            {/* Feature 4 */}
            <FeatureCard title="Pros for Organizers" text="Powerful management tools, detailed analytics, and streamlined workflows for professional event organization." icon="building" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4 max-w-sm mx-auto">
            {/* Feature 5 */}
            <FeatureCard title="Secure & Safe" text="Your data is protected with JWT authentication and enterprise-grade security measures for complete peace of mind." icon="lock" />
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-12">
              {/* Hero Section */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700">
                  About <span className="text-indigo-500">Event Planner</span>
                </h1>
                <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
                  Plan, organize, and celebrate your events with ease — whether it’s a
                  small meetup or a grand conference.
                </p>
              </motion.div>
        
              {/* Features Section */}
              <div className="grid md:grid-cols-3 gap-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-6 bg-white rounded-2xl shadow-lg text-center"
                >
                  <CalendarDays className="mx-auto text-indigo-600 w-12 h-12 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800">Smart Scheduling</h3>
                  <p className="text-gray-600 mt-2">
                    Easily set event dates, times, and reminders for a seamless experience.
                  </p>
                </motion.div>
        
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-6 bg-white rounded-2xl shadow-lg text-center"
                >
                  <Users className="mx-auto text-indigo-600 w-12 h-12 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800">Collaboration</h3>
                  <p className="text-gray-600 mt-2">
                    Invite guests, manage attendees, and stay connected in real time.
                  </p>
                </motion.div>
        
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-6 bg-white rounded-2xl shadow-lg text-center"
                >
                  <Sparkles className="mx-auto text-indigo-600 w-12 h-12 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800">Beautiful Experience</h3>
                  <p className="text-gray-600 mt-2">
                    A modern and user-friendly platform built with React and Tailwind.
                  </p>
                </motion.div>
              </div>
        
              {/* Closing Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-16 text-center"
              >
                <p className="text-gray-700 text-lg">
                  Event Planner is built with ❤️ to make event management stress-free and enjoyable.
                </p>
              </motion.div>
            </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold gradient-text mb-4">Event Planner</h3>
          <p className="text-gray-400 mb-6">Making event planning simple, efficient, and enjoyable for everyone.</p>
          <p className="text-gray-400">&copy; 2024 Event Planner. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

/* FeatureCard reusable component */
const FeatureCard = ({ title, text, icon }) => {
  const icons = {
    calendar: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    ),
    users: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    ),
    user: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    ),
    building: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    ),
    lock: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    ),
  };

  return (
    <div className="card-hover bg-white p-5 rounded-xl shadow-lg border border-gray-100">
      <div className="w-12 h-12 gradient-bg rounded-full flex items-center justify-center mb-4 mx-auto">
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {icons[icon]}
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">{title}</h3>
      <p className="text-gray-600 text-center text-sm">{text}</p>
    </div>
  );
};

export default HomePage;
