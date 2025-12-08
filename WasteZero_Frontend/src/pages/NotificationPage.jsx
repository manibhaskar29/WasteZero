// src/pages/NotificationsPage.jsx
import React, { useEffect, useState } from "react";
import { useNotifications } from "../context/NotificationContext";
import { CheckCircle, XCircle } from "lucide-react";

export default function NotificationsPage() {
  const { notifications, fetchNotifications, markAsRead, markAllAsRead } = useNotifications();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchNotifications().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-700 dark:text-gray-300">
        Loading notifications...
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
        No notifications yet.
      </div>
    );
  }

  return (
    <div className="p-6 flex-1 bg-green-100 overflow-auto pt-18 dark:bg-zinc-900">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Notifications</h2>
        <button
          onClick={markAllAsRead}
          className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-2">
        {notifications.map((notif) => (
          <div
            key={notif._id}
            className={`p-4 rounded-lg border ${
              notif.isRead
                ? "bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
                : "bg-green-50 dark:bg-green-900 border-green-400"
            } flex justify-between items-center`}
          >
            <div>
              <p className="font-medium">{notif.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{notif.message}</p>
              <small className="text-gray-400 dark:text-gray-500">
                {new Date(notif.createdAt).toLocaleString()}
              </small>
            </div>

            <div className="flex items-center gap-2">
              {!notif.isRead && (
                <button
                  onClick={() => markAsRead(notif._id)}
                  title="Mark as read"
                  className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-500 transition"
                >
                  <CheckCircle size={20} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
