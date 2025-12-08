import React, { useState } from "react";
import axios from "axios";

import DashboardLayout from "../components/DashboardLayout";
import UserDashboard from "../components/UserDashboard";
import NgoDashboard from "../components/NgoDashboard";
import AdminDashboard from "../components/AdminDashboard";

export default function Dashboard() {
  const API_URL = import.meta.env.VITE_BACKEND_API_URL;
  const [data, setData] = useState(null);

  async function loadStats(role) {
    const token = localStorage.getItem("token");

    const res = await axios.get(`${API_URL}/dashboard/${role}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setData(res.data);
  }

  return (
    <DashboardLayout
      render={(role) => {
        if (!data) {
          loadStats(role);
          return <p>Loading summary...</p>;
        }

        return (
          <>
            <h1 className="text-3xl font-bold text-green-800 dark:text-green-300 mb-2">
              Dashboard
            </h1>

            {/* Display role */}
            <p className="text-lg text-gray-600 dark:text-gray-400 ">
              Role: <span className="font-semibold">{role.charAt(0).toUpperCase() + role.slice(1)}</span>
            </p>

            {/* Render the corresponding dashboard */}
            {role === "user" && <UserDashboard data={data} />}
            {role === "ngo" && <NgoDashboard data={data} />}
            {role === "admin" && <AdminDashboard data={data} />}
          </>
        );

      }}
    />
  );
}
