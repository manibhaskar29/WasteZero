import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  AreaChart, Area, PieChart, Pie, Tooltip, ResponsiveContainer, Cell, XAxis, YAxis, Legend
} from "recharts";
import axios from "axios";

export default function AdminDashboard() {
  const API_URL = import.meta.env.VITE_BACKEND_API_URL;
  const token = localStorage.getItem("token");

  const COLORS_Waste = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF"];

  const [stats, setStats] = useState({
    users: 0,
    ngos: 0,
    pickups: 0,
    totalWaste: 0,
    co2: 0,
    pendingPickups: 0,
    wasteBreakdown: [],
    systemChart: [],
    recentPickups: [],
    topUsers: [],
    topNGOs: []
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const res = await axios.get(`${API_URL}/dashboard/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      console.log(data);
      

      setStats({
        users: data.counts?.totalUsers ?? 0,
        ngos: data.counts?.totalNGOs ?? 0,
        pickups: data.counts?.totalPickups ?? 0,
        totalWaste: data.environment?.totalWaste ?? 0,
        co2: data.environment?.totalCO2 ?? 0,

        wasteBreakdown: Array.isArray(data.environment?.wasteBreakdown)
          ? data.environment.wasteBreakdown
          : [],

        systemChart: Array.isArray(data.trends?.pickupTrends)
          ? data.trends.pickupTrends
          : [],

        recentPickups: Array.isArray(data.recentPickups)
          ? data.recentPickups
          : [],

        // ⭐ FIXED: CORRECT KEYS
        topUsers: Array.isArray(data.performance?.topUsers)
          ? data.performance.topUsers
          : [],

        topNGOs: Array.isArray(data.performance?.topNGOs)
          ? data.performance.topNGOs
          : [],
      });

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <DashboardLayout title="Admin Dashboard">

      {/* Top Stats */}
      <div className="grid md:grid-cols-5 gap-6">
        <StatCard title="Total Users" value={stats.users} icon="👥" color="blue" />
        <StatCard title="NGOs Registered" value={stats.ngos} icon="🏢" color="purple" />
        <StatCard title="Total Pickups" value={stats.pickups} icon="🚚" color="teal" />
        <StatCard title="Total Waste" value={`${stats.totalWaste} kg`} icon="♻️" color="green" />
        <StatCard title="CO₂ Saved" value={`${Number(stats.co2).toFixed(2)} kg`} icon="🌱" color="lime" />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">

        {/* Waste Breakdown Pie */}
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Waste Breakdown</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.wasteBreakdown}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              >
                {stats.wasteBreakdown.map((entry, index) => (
                  <Cell key={index} fill={COLORS_Waste[index % COLORS_Waste.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* System Activity Area Chart */}
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">System Activity</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={stats.systemChart}>
              <XAxis dataKey="month" stroke="#4B5563" />
              <YAxis stroke="#4B5563" />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#2563EB" fill="#2563EB55" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Users & Top NGOs */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">

        {/* Top Users */}
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Top Users (Most Waste Provided)</h2>
          <ul className="divide-y divide-gray-200 dark:divide-zinc-700">
            {stats.topUsers.map((u, i) => (
              <li key={i} className="py-2 flex justify-between">
                <span>{u.name}</span>
                <span className="font-semibold">{u.totalWaste} kg</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Top NGOs */}
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Top NGOs (Most Waste Collected)</h2>
          <ul className="divide-y divide-gray-200 dark:divide-zinc-700">
            {stats.topNGOs.map((ngo, i) => (
              <li key={i} className="py-2 flex justify-between">
                <span>{ngo.ngoName}</span>
                <span className="font-semibold">{ngo.waste} kg</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent Pickups Table */}
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow mt-10">
        <h2 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-300">Recent Pickups</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-green-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 uppercase text-sm">
              <tr>
                <th className="p-3">Waste Types</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Address</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentPickups.map((p, i) => (
                <tr key={i} className="border-b hover:bg-green-50 dark:hover:bg-zinc-700">
                  <td className="p-3">{p.wasteTypes.join(", ")}</td>
                  <td className="p-3">{p.quantityKg} kg</td>
                  <td className="p-3">{p.address}</td>
                  <td className="p-3">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded text-sm font-medium ${
                      p.status === "completed" ? "bg-green-200 text-green-800" :
                      p.status === "pending" ? "bg-yellow-200 text-yellow-800" :
                      "bg-blue-200 text-blue-800"
                    }`}>{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </DashboardLayout>
  );
}

// Enhanced StatCard Component
function StatCard({ title, value, icon, color }) {
  const colorMap = {
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
    yellow: "text-yellow-600",
    purple: "text-purple-600",
    teal: "text-teal-600",
    lime: "text-lime-600"
  };
  return (
    <div className="bg-white dark:bg-zinc-800 p-5 rounded-xl shadow flex flex-col items-center">
      <span className={`text-3xl ${colorMap[color]}`}>{icon}</span>
      <h2 className="text-lg font-semibold mt-1">{title}</h2>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
