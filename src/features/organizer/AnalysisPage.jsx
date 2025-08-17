// src/features/organizer/AnalysisPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/axiosInstance";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#4F46E5", "#F97316", "#10B981", "#F43F5E", "#3B82F6"]; // Indigo, Orange, Green, Red, Blue

const AnalysisPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    fetchAnalysis();
  }, [eventId]);

  const fetchAnalysis = async () => {
    try {
      const res = await API.get(`/event/${eventId}/simple-analysis`);
      setAnalysis(res.data);
    } catch (error) {
      console.error("Error fetching analysis", error);
    }
  };

  if (!analysis) {
    return <p className="p-6 text-gray-500">Loading analysis...</p>;
  }

  const genderData = analysis.genderDistribution.map((g) => ({
    name: g.gender,
    value: g.count,
  }));

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8 font-sans">
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg shadow-sm transition"
      >
        ← Back
      </button>

      <h2 className="text-3xl font-bold text-gray-800">Event Analysis</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-50 text-indigo-800 shadow rounded-lg p-6 text-center">
          <p className="text-sm font-medium">Total Attendees</p>
          <p className="text-2xl font-bold">{analysis.totalAttendees}</p>
        </div>
        <div className="bg-green-50 text-green-800 shadow rounded-lg p-6 text-center">
          <p className="text-sm font-medium">Most Common Age Group</p>
          <p className="text-xl font-semibold">{analysis.mostCommonAgeGroup}</p>
        </div>
        <div className="bg-orange-50 text-orange-800 shadow rounded-lg p-6 text-center">
          <p className="text-sm font-medium">Genders Recorded</p>
          <p className="text-xl font-semibold">{analysis.genderDistribution.length}</p>
        </div>
      </div>

      {/* Gender Distribution Chart */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Gender Distribution</h3>
        <div className="flex justify-center">
          <PieChart width={350} height={300}>
            <Pie
              data={genderData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={60}
              label
            >
              {genderData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: "#f9fafb", borderRadius: "8px", border: "none" }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </div>
      </div>

      {/* Gender Details Table */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Gender Details</h3>
        <table className="w-full table-auto border-collapse text-left">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 border-b text-gray-600">Gender</th>
              <th className="p-3 border-b text-gray-600">Count</th>
              <th className="p-3 border-b text-gray-600">Percentage</th>
            </tr>
          </thead>
          <tbody>
            {analysis.genderDistribution.map((g, idx) => (
              <tr
                key={idx}
                className={`transition hover:bg-gray-50 ${
                  idx % 2 === 0 ? "bg-gray-100/50" : ""
                }`}
              >
                <td className="p-3 border-b capitalize font-medium">{g.gender}</td>
                <td className="p-3 border-b">{g.count}</td>
                <td className="p-3 border-b">{g.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AnalysisPage;
