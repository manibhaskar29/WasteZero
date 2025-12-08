import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  AreaChart, Area, PieChart, Pie, Cell, Tooltip, ResponsiveContainer , XAxis , YAxis ,Legend
} from "recharts";
import axios from "axios";

export default function UserDashboard() {
  const API_URL = import.meta.env.VITE_BACKEND_API_URL;
  const token = localStorage.getItem("token");
  const COLORS_Waste = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF"];
  const COLORS_Application = ["#FFC107", "#28A745", "#DC3545"];
  
  const [stats, setStats] = useState({
  totalPickups: 0,
  totalWaste: 0,
  co2: 0,

  totalApplications: 0,
  applicationStats: {},

  totalEnrollments: 0,
  enrolledPickups: [],

  wasteBreakdown: [],
  nextPickup: null,
  historyChart: [],
  recentActivity: []
});

const applicationData = [
  { name: "Pending", value: stats.applicationStats.pending || 0 },
  { name: "Accepted", value: stats.applicationStats.accepted || 0 },
  { name: "Rejected", value: stats.applicationStats.rejected || 0 },
];
  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
  const res = await axios.get(`${API_URL}/dashboard/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = res.data;

  
  setStats({
    ...data,
    wasteBreakdown: Array.isArray(data.wasteBreakdown)
      ? data.wasteBreakdown
      : Object.entries(data.wasteBreakdown || {}).map(([name, value]) => ({
          name,
          value,
        })),
    historyChart: Array.isArray(data.historyChart)
      ? data.historyChart
      : [],
  });
}


  return (
    <DashboardLayout title="My Dashboard">

        {/* Stat Cards */}
        <div className="grid md:grid-cols-3 gap-6">
            <StatCard title="Total Pickups" value={stats.totalPickups} icon="🚚" color="green" />
            <StatCard title="Waste Recycled" value={`${stats.totalWaste} kg`} icon="♻️" color="teal" />
            <StatCard title="CO₂ Saved" value={`${stats.co2.toFixed(2)} Kg`} icon="🌱" color="lime" />
            <StatCard title="Applications" value={stats.totalApplications} icon="📝" color="blue" />
            <StatCard title="Enrolled Pickups" value={stats.totalEnrollments} icon="👥" color="purple" />
        </div>


      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">

        {/* Waste Breakdown */}
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Waste Breakdown</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={stats.wasteBreakdown} 
                dataKey="value" outerRadius={90} 
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}>
                {stats.wasteBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS_Waste[i % COLORS_Waste.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* History Chart */}
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-4">Pickup Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={stats.historyChart} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                {/* X Axis - Month */}
                <XAxis dataKey="month" stroke="#4B5563" />

                {/* Y Axis for Waste */}
                <YAxis
                    yAxisId="left"
                    label={{ value: "Waste (kg)", angle: -90, position: "insideLeft", fill: "#28A745" }}
                    stroke="#28A745"
                />

                {/* Y Axis for Pickups */}
                <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{ value: "Pickups", angle: 90, position: "insideRight", fill: "#007BFF" }}
                    stroke="#007BFF"
                />

                <Tooltip />

                <Legend verticalAlign="top" height={36} />

                {/* Area for Waste */}
                <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="waste"
                    name="Waste (kg)"
                    stroke="#28A745"
                    fill="#28A745"
                    fillOpacity={0.2}
                />

                {/* Area for Pickups */}
                <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="pickups"
                    name="Pickups"
                    stroke="#007BFF"
                    fill="#007BFF"
                    fillOpacity={0.2}
                />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>

      {/* Next Pickup */}
      {stats.nextPickup && (
        <div className="mt-8 bg-green-300 dark:bg-zinc-700 p-5 rounded-xl shadow mb-8">
          <h2 className="text-lg font-semibold">Next Pickup</h2>
          <p className="mt-1">{stats.nextPickup.date} — {stats.nextPickup.time}</p>
          <p className="text-sm text-gray-600">{stats.nextPickup.address}</p>
          <p className="text-sm">Waste: {stats.nextPickup.waste} kg</p>

        </div>
      )}

      {/* Applications */}
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">Applications Breakdown</h2>

        <ResponsiveContainer width="100%" height={250}>
            <PieChart>
            

            <Pie data={applicationData} dataKey="value" outerRadius={90}>
                {applicationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_Application[index % COLORS_Application.length]} />
                ))}
            </Pie>
            <Tooltip />
            </PieChart>
        </ResponsiveContainer>
      </div>

    {/* Enrolled Pickups */}
    <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-lg mt-8">
    <h2 className="text-xl font-semibold mb-6 text-green-700 dark:text-green-300">Your Enrolled Pickups</h2>

    <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
        <thead className="bg-green-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 uppercase text-sm">
            <tr>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Waste</th>
            <th className="p-3 text-left">Location</th>
            <th className="p-3 text-left">Types</th>
            <th className="p-3 text-left">Meeting Point</th>
            <th className="p-3 text-left">Note</th>
            </tr>
        </thead>
        <tbody className="text-gray-800 dark:text-gray-200">
            {stats.enrolledPickups.map((p, i) => (
            <tr
                key={i}
                className="border-b hover:bg-green-50 dark:hover:bg-zinc-700 transition-colors duration-200"
            >
                <td className="p-3">{new Date(p.date).toLocaleDateString()}</td>
                <td className="p-3 font-medium">{p.waste} kg</td>
                <td className="p-3">{p.location}</td>
                <td className="p-3">
                {p.wasteTypes.map((type, idx) => (
                    <span
                    key={idx}
                    className="inline-block bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full mr-1 mb-1"
                    >
                    {type}
                    </span>
                ))}
                </td>
                <td className="p-3">{p.meetingPoint || "-"}</td>
                <td className="p-3">{p.note || "-"}</td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
    </div>

    {/* Recent Activity */}
    <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-lg mt-8">
    <h2 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-300">Recent Activity</h2>

    <ul className="space-y-4">
        {stats.recentActivity.map((a, i) => (
        <li
            key={i}
            className="flex flex-col md:flex-row md:justify-between items-start md:items-center p-3 bg-green-50 dark:bg-zinc-700 rounded-lg hover:bg-green-100 dark:hover:bg-zinc-600 transition-colors duration-200"
        >
            <div className="flex items-center gap-2 mb-2 md:mb-0">
            <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
                a.type === "pickup"
                    ? "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200"
                    : "bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-200"
                }`}
            >
                {a.type.toUpperCase()}
            </span>
            <span className="font-medium">{a.status}</span>
            </div>
            <span className="text-gray-500 text-sm">{new Date(a.date).toLocaleString()}</span>
        </li>
        ))}
    </ul>
    </div>

      
    </DashboardLayout>
  );
}


function StatCard({ title, value, icon, color = "green" }) {
  const colorMap = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    teal: "text-teal-600",
    lime: "text-lime-600",
    red: "text-red-600",
    yellow: "text-yellow-600",
  };

  return (
    <div className="bg-white dark:bg-zinc-800 p-5 rounded-xl shadow text-center flex flex-col items-center justify-center">
      {icon && <span className={`text-3xl mb-2 ${colorMap[color]}`}>{icon}</span>}
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
