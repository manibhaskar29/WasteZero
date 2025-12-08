import React, { useEffect, useState } from "react";
import { fetchCurrentUser } from "../api/user.api";

export default function DashboardLayout({ children, render }) {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await fetchCurrentUser();
        setRole(data.user.role);
        localStorage.setItem("role", data.user.role);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading dashboard...
      </div>
    );

  return (
    <div className="p-6 pt-16 min-h-screen bg-green-100 dark:bg-zinc-900">
      {render ? render(role) : children}
    </div>
  );
}
