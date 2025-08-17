import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEventAnalysis } from '../../services/eventService';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const EventAnalysisPage = () => {
  const { eventId } = useParams();
  const [analysis, setAnalysis] = useState({
    totalAttendees: 0,
    genderStats: [],
    ageStats: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      try {
        const res = await getEventAnalysis(eventId);
        setAnalysis(res);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load analysis.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [eventId]);

  if (loading) return <p className="text-center mt-8">Loading analysis...</p>;
  if (error) return <p className="text-center mt-8 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Event Analysis</h1>
        <Link
          to="/organizer/dashboard"
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Total Attendees */}
      <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
        <h2 className="font-semibold text-lg mb-2">Total Attendees</h2>
        <p className="text-4xl font-bold text-indigo-600">{analysis.totalAttendees}</p>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gender Distribution */}
        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <h2 className="font-semibold text-lg mb-2">Gender Distribution</h2>
          {analysis.genderStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={analysis.genderStats}
                  dataKey="count"
                  nameKey="gender"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {analysis.genderStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>

        {/* Age Distribution */}
        <div className="bg-white p-4 rounded-2xl shadow-lg">
          <h2 className="font-semibold text-lg mb-2">Age Distribution</h2>
          {analysis.ageStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={analysis.ageStats}
                  dataKey="count"
                  nameKey="ageGroup"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {analysis.ageStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventAnalysisPage;
