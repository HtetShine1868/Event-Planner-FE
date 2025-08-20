import React from "react";
import { motion } from "framer-motion";
import { CalendarDays, Users, Sparkles } from "lucide-react";

const About = () => {
  return (
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
  );
};

export default About;
