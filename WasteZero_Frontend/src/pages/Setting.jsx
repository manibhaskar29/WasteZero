import React, { useState } from "react";
import { deleteUserAccount } from "../api/user.api"; 

export default function SettingsPage() {
  const [theme, setTheme] = useState("light");
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false); // loading state for deletion

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      await deleteUserAccount();
      setLoading(false);
      setShowConfirm(false);

      // Clear token & redirect to login page
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (error) {
      setLoading(false);
      alert("Failed to delete account. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen pt-20 p-8 bg-green-100 dark:bg-zinc-900 transition-colors">
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-green-200">Settings</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Manage your preferences</p>

      <div className="space-y-6">
        {/* Appearance Section */}
        <div className="bg-white dark:bg-zinc-800 shadow rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h5 className="text-xl font-semibold mb-4 text-gray-800 dark:text-green-200">Appearance</h5>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Choose Theme</label>
          <select
            className="w-full mt-2 p-2 border rounded-lg bg-white dark:bg-zinc-700 "
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
          </select>
        </div>

        {/* Notification Settings */}
        <div className="bg-white dark:bg-zinc-800 shadow rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h5 className="text-xl font-semibold mb-4 text-gray-800 dark:text-green-200">Notifications</h5>
          <div className="flex flex-col gap-2">
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-green-700 dark:text-green-400" />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Email alerts</span>
            </label>
            <label className="inline-flex items-center">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-green-700 dark:text-green-400" />
              <span className="ml-2 text-gray-700 dark:text-gray-300">SMS alerts</span>
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white dark:bg-zinc-800 shadow rounded-xl p-6 border border-red-500">
          <h5 className="text-xl font-semibold mb-3 text-red-600 dark:text-red-400">Danger Zone</h5>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            Deleting your account is permanent. All your data will be removed and cannot be recovered.
          </p>
          <button
            className="w-full py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-400 transition shadow-md"
            onClick={() => setShowConfirm(true)}
          >
            Delete My Account
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-opacity-50 z-50">
          <div className="bg-white dark:bg-zinc-700 rounded-xl shadow-lg p-6 w-full max-w-md">
            <h5 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
              Confirm Account Deletion
            </h5>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Are you sure you want to permanently delete your account? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="py-2 px-4 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                onClick={() => setShowConfirm(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="py-2 px-4 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-400 transition"
                onClick={handleDeleteAccount}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Yes, Delete It"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
