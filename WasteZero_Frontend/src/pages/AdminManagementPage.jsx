// src/pages/AdminManagementPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminManagementPage() {
  const API = import.meta.env.VITE_BACKEND_API_URL;
  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState("users");

  const [users, setUsers] = useState([]);
  const [ngos, setNgos] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingNgos, setLoadingNgos] = useState(true);

  // -------- Load Users --------
  useEffect(() => {
    fetchUsers();
    fetchNgos();
  }, []);

  async function fetchUsers() {
    try {
      const res = await axios.get(`${API}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoadingUsers(false);
    }
  }

  async function fetchNgos() {
    try {
      const res = await axios.get(`${API}/admin/ngos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNgos(res.data);
    } catch (err) {
      console.error("Failed to load NGOs", err);
    } finally {
      setLoadingNgos(false);
    }
  }

  // -------- User Actions --------
  async function suspendUser(id) {
    await axios.patch(`${API}/admin/users/${id}/suspend`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  }

  async function deleteUser(id) {
    if (!confirm("Are you sure?")) return;
    await axios.delete(`${API}/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  }

  async function updateRole(id, role) {
    await axios.put(`${API}/admin/users/${id}`, { role }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  }

  // -------- NGO Actions --------
  async function approveNgo(id) {
    await axios.patch(`${API}/admin/ngos/${id}/approve`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchNgos();
  }

  async function rejectNgo(id) {
    await axios.patch(`${API}/admin/ngos/${id}/reject`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchNgos();
  }

  async function disableNgo(id) {
    await axios.patch(`${API}/admin/ngos/${id}/disable`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchNgos();
  }

  return (
    <div className="space-y-6 pt-18 p-7 bg-green-100 dark:bg-zinc-900">
      
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-green-700 dark:text-green-300 mb-10">
        Admin Management Panel
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b dark:border-zinc-700 pb-2">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded-t font-medium ${
            activeTab === "users"
              ? "bg-green-600 text-white"
              : "bg-gray-200 dark:bg-zinc-700"
          }`}
        >
          Users
        </button>

        <button
          onClick={() => setActiveTab("ngos")}
          className={`px-4 py-2 rounded-t font-medium ${
            activeTab === "ngos"
              ? "bg-green-600 text-white"
              : "bg-gray-200 dark:bg-zinc-700"
          }`}
        >
          NGOs
        </button>
      </div>

      {/* USERS TAB */}
      {activeTab === "users" && (
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>

          {loadingUsers ? (
            <p>Loading users...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead className="bg-gray-100 dark:bg-zinc-700 text-sm uppercase">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u._id}
                      className="border-b dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700"
                    >
                      <td className="p-3">{u.name}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">
                        <select
                          className="border px-2 py-1 rounded"
                          value={u.role}
                          onChange={(e) => updateRole(u._id, e.target.value)}
                        >
                          <option value="user">User</option>
                          <option value="ngo">NGO</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="p-3">
                        {u.isSuspended ? (
                          <span className="text-red-500 font-medium">Suspended</span>
                        ) : (
                          <span className="text-green-600 font-medium">Active</span>
                        )}
                      </td>
                      <td className="p-3 flex gap-2">
                        <button
                          className="px-3 py-1 bg-yellow-500 text-white rounded"
                          onClick={() => suspendUser(u._id)}
                        >
                          {u.isSuspended ? "Unsuspend" : "Suspend"}
                        </button>

                        <button
                          className="px-3 py-1 bg-red-600 text-white rounded"
                          onClick={() => deleteUser(u._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>
      )}

      {/* NGOS TAB */}
      {activeTab === "ngos" && (
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">NGO Management</h2>

          {loadingNgos ? (
            <p>Loading NGOs...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead className="bg-gray-100 dark:bg-zinc-700 text-sm uppercase">
                  <tr>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {ngos.map((ngo) => (
                    <tr
                      key={ngo._id}
                      className="border-b dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700"
                    >
                      <td className="p-3">{ngo.name}</td>
                      <td className="p-3">{ngo.email}</td>
                      <td className="p-3 capitalize">
                        {ngo.verificationStatus}
                        {ngo.isDisabled && <span className="text-red-500"> (Disabled)</span>}
                      </td>
                      <td className="p-3 flex gap-2">
                        {ngo.verificationStatus === "pending" && (
                          <>
                            <button
                              className="px-3 py-1 bg-green-600 text-white rounded"
                              onClick={() => approveNgo(ngo._id)}
                            >
                              Approve
                            </button>
                            <button
                              className="px-3 py-1 bg-red-600 text-white rounded"
                              onClick={() => rejectNgo(ngo._id)}
                            >
                              Reject
                            </button>
                          </>
                        )}

                        <button
                          className="px-3 py-1 bg-yellow-500 text-white rounded"
                          onClick={() => disableNgo(ngo._id)}
                        >
                          {ngo.isDisabled ? "Enable" : "Disable"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
