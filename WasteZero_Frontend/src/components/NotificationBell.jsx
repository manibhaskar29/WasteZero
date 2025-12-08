// components/NotificationBell.jsx
import { useState } from "react";
import { useNotifications } from "../context/NotificationContext";

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [showPopover, setShowPopover] = useState(false);

  const handleRead = (id) => {
    markAsRead(id);
  };

  return (
    <div className="relative">
      <button
        className="relative focus:outline-none"
        onClick={() => setShowPopover(prev => !prev)}
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {showPopover && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white shadow-lg border rounded-lg z-50">
          {notifications.length === 0 ? (
            <div className="p-2 text-gray-500">No notifications</div>
          ) : (
            notifications.slice(0, 5).map(n => (
              <div
                key={n._id}
                className={`p-2 border-b cursor-pointer ${n.isRead ? "" : "bg-gray-100"}`}
                onClick={() => handleRead(n._id)}
              >
                <strong>{n.title}</strong>
                <p className="text-sm">{n.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
