import React, { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  AreaChart, Area, PieChart, Pie, Tooltip, ResponsiveContainer, Cell, XAxis, YAxis, Legend
} from "recharts";
import axios from "axios";

export default function NgoDashboard() {
  const API_URL = import.meta.env.VITE_BACKEND_API_URL;
  const token = localStorage.getItem("token");

  const COLORS_Waste = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF"];
  const COLORS_Application = ["#FFC107", "#28A745", "#DC3545", "#6f42c1", "#17a2b8"];

  const [stats, setStats] = useState({
    totalApplicants: 0,
    opportunities: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    applicantChart: [],
    totalPickups: 0,
    totalWaste: 0,
    totalCO2: 0,
    wasteBreakdown: [],
    pickupTrend: [],
    recentPickups: [],
    applicationsPerOpportunity: [],
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const res = await axios.get(`${API_URL}/dashboard/ngo`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = res.data;

    setStats({
      ...data,
      wasteBreakdown: Array.isArray(data.wasteBreakdown) ? data.wasteBreakdown : [],
      pickupTrend: Array.isArray(data.pickupTrend) ? data.pickupTrend : [],
      applicantChart: Array.isArray(data.applicantChart) ? data.applicantChart : [],
      applicationsPerOpportunity: Array.isArray(data.applicationsPerOpportunity) ? data.applicationsPerOpportunity : []
    });
  }

  return (
    <DashboardLayout title="NGO Dashboard">

      {/* Top Stat Cards */}
      <div className="grid md:grid-cols-5 gap-6">
        <StatCard title="Total Applicants" value={stats.totalApplicants} icon="👤" color="blue" />
        <StatCard title="Opportunities Posted" value={stats.opportunities} icon="📢" color="purple" />
        <StatCard title="Pending" value={stats.pending} icon="⏳" color="yellow" />
        <StatCard title="Approved" value={stats.approved} icon="✅" color="green" />
        <StatCard title="Rejected" value={stats.rejected} icon="❌" color="red" />
      </div>

      {/* Pickups and Waste */}
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <StatCard title="Total Pickups" value={stats.totalPickups} icon="🚚" color="teal" />
        <StatCard title="Total Waste Collected" value={`${stats.totalWaste} kg`} icon="♻️" color="green" />
        <StatCard title="CO₂ Saved" value={`${stats.totalCO2.toFixed(2)} kg`} icon="🌱" color="lime" />
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

        {/* Applicant Activity Area Chart */}
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4">Applicant Activity</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={stats.applicantChart} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="date" stroke="#4B5563" />
              <YAxis label={{ value: "Applicants", angle: -90, position: "insideLeft", fill: "#2563EB" }} />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Area type="monotone" dataKey="count" name="Applicants" stroke="#2563EB" fill="#2563EB" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pickup Trends */}
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow mt-8">
        <h2 className="text-lg font-semibold mb-4">Monthly Pickup Trend</h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={stats.pickupTrend}>
            <XAxis dataKey="month" stroke="#4B5563" />
            <YAxis label={{ value: "Waste (kg)", angle: -90, position: "insideLeft", fill: "#16A34A" }} />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Area type="monotone" dataKey="waste" name="Waste (kg)" stroke="#16A34A" fill="#16A34A" fillOpacity={0.2} />
            <Area type="monotone" dataKey="pickups" name="Pickups" stroke="#2563EB" fill="#2563EB" fillOpacity={0.2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Pickups Table */}
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow mt-8">
        <h2 className="text-xl font-semibold mb-4 text-green-700 dark:text-green-300">Recent Pickups</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-left">
            <thead className="bg-green-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 uppercase text-sm">
              <tr>
                <th className="p-3">Waste Types</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Address</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Enrolled</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 dark:text-gray-200">
              {stats.recentPickups.map((p, i) => (
                <tr key={i} className="border-b hover:bg-green-50 dark:hover:bg-zinc-700 transition-colors duration-200">
                  <td className="p-3">{p.wasteTypes.join(", ")}</td>
                  <td className="p-3 font-medium">{p.quantityKg} kg</td>
                  <td className="p-3">{p.address}</td>
                  <td className="p-3">{new Date(p.pickupDate).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded text-sm font-medium ${
                      p.status === "Completed" ? "bg-green-200 text-green-800" :
                      p.status === "Pending" ? "bg-yellow-200 text-yellow-800" :
                      "bg-blue-200 text-blue-800"
                    }`}>{p.status}</span>
                  </td>
                  <td className="p-3">{p.enrolledCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Applications per Opportunity Table */}
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow mt-8">
        <h2 className="text-xl font-semibold mb-4 text-purple-700 dark:text-purple-300">Applications per Opportunity</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-left">
            <thead className="bg-purple-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 uppercase text-sm">
              <tr>
                <th className="p-3">Opportunity</th>
                <th className="p-3">Applicants</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 dark:text-gray-200">
              {stats.applicationsPerOpportunity.map((op, i) => (
                <tr key={i} className="border-b hover:bg-purple-50 dark:hover:bg-zinc-700 transition-colors duration-200">
                  <td className="p-3 font-medium">{op.title}</td>
                  <td className="p-3">{op.applicants}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </DashboardLayout>
  );
}

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
    <div className="bg-white dark:bg-zinc-800 p-5 rounded-xl shadow flex flex-col items-center justify-center">
      {icon && <span className={`text-3xl mb-2 ${colorMap[color] || "text-green-600"}`}>{icon}</span>}
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
