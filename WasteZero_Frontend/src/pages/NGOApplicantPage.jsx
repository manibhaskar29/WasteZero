import React, { useEffect, useState } from "react";
import axios from "axios";

export default function NgoApplicantsPage() {
  const [apps, setApps] = useState([]);
  const API_URL = import.meta.env.VITE_BACKEND_API_URL;

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_URL}/opportunities/ngo/applications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setApps(res.data);
  }

  // Update status
  async function updateStatus(id, status) {
    const token = localStorage.getItem("token");

    await axios.patch(
      `${API_URL}/opportunities/applications/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // Update UI instantly (no reload needed)
    setApps((prev) =>
      prev.map((a) => (a._id === id ? { ...a, status } : a))
    );
  }

  return (
    <div className="p-8 pt-24 min-h-screen bg-green-100 dark:bg-zinc-900">
      <h1 className="text-3xl font-bold mb-6 text-green-700 dark:text-green-300">
        Applicant Dashboard
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((a) => (
          <div
            key={a._id}
            className="bg-white dark:bg-zinc-800 p-5 rounded-xl shadow-md border border-gray-200 dark:border-zinc-700"
          >
            {/* Applicant Header */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {a.name}
              </h2>

              {/* Status Badge */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium
                  ${
                    a.status === "accepted"
                      ? "bg-green-200 text-green-700"
                      : a.status === "rejected"
                      ? "bg-red-200 text-red-700"
                      : "bg-yellow-200 text-yellow-700"
                  }`}
              >
                {a.status || "pending"}
              </span>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Applied for:{" "}
              <span className="font-medium text-green-600 dark:text-green-300">
                {a.opportunityId?.title}
              </span>
            </p>

            <p className="mt-1 text-gray-700 dark:text-gray-300">📍 {a.location}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Email: {a.email}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Phone: {a.phone}
            </p>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mt-3">
              {a.skills.map((s, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 text-xs rounded-md"
                >
                  {s}
                </span>
              ))}
            </div>

            <p className="mt-3 text-gray-700 dark:text-gray-300 text-sm">
              <strong>Experience:</strong> {a.experience}
            </p>

            <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm">
              <strong>Availability:</strong> {a.availability}
            </p>

            <p className="mt-3 text-gray-700 dark:text-gray-300 text-sm">
              <strong>Why select me?</strong>
              <br />
              {a.motivation}
            </p>

            <p className="text-xs text-gray-500 mt-3">
              Applied on {new Date(a.createdAt).toLocaleDateString()}
            </p>

            {/* Accept / Reject Buttons */}
            {a.status === "pending" && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => updateStatus(a._id, "accepted")}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
                >
                  Accept
                </button>

                <button
                  onClick={() => updateStatus(a._id, "rejected")}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
                >
                  Reject
                </button>
              </div>
            )}

            {/* If already accepted/rejected, show disabled buttons */}
            {a.status !== "pending" && (
              <div className="mt-4 text-center text-sm text-gray-500">
                Decision already made.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
