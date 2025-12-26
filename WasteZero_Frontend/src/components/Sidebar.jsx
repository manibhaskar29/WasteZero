import React from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Leaf,
  CalendarDays,
  MessageSquare,
  User,
  Settings,
  HelpCircle,
  Pencil,
  PlusCircle,
  LogOut,
  FileText,
  Shield,
  Bell
} from "lucide-react";
import { useNotifications } from "../context/NotificationContext"; // Notification context

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Eco Opportunities", icon: Leaf, path: "/opportunities" },
  { name: "Pickup Schedule", icon: CalendarDays, path: "/schedule" },
  { name: "Messages", icon: MessageSquare, path: "/chats" },
  { name: "My Profile", icon: User, path: "/profile" },
  { name: "Settings", icon: Settings, path: "/settings" },
  { name: "Help & Support", icon: HelpCircle, path: "/help" },
];

export default function Sidebar({ active, onLogout }) {
  const nav = useNavigate();
  const role = localStorage.getItem("role"); // "ngo" | "user" | "admin"
  const { unreadCount } = useNotifications();
location.pathname.includes("/opportunities/create")
              ? "Create Opportunity"
              : location.pathname.includes("/opportunities/edit")
              ? "Edit Opportunity"
              : location.pathname.includes("/opportunities")
              ? "Eco Opportunities"
              : location.pathname.includes("/profile")
              ? "My Profile"
              : location.pathname.includes("/chats")
              ? "Chat"
              : location.pathname.includes("/help")
              ? "Help"
              : location.pathname.includes("/settings")
              ? "Settings"
              : location.pathname.includes("/applications")
              ? "Applications"
              : location.pathname.includes("/schedule")
              ? "Schedule"
              : location.pathname.includes("/admin")
              ? "Admin Panel"
              : location.pathname.includes("/notifications")
              ? "Notifications"
              : "Dashboard"
  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-zinc-800 shadow-lg border-r border-gray-200 dark:border-zinc-700 flex flex-col justify-between transition-all duration-300">
      <div>
        {/* Logo */}
        <div className="flex flex-col items-center pt-4">
          <span className="text-3xl font-semibold text-green-700 dark:text-green-400">
            <span className="text-gray-900 dark:text-white">Waste</span>Zero
          </span>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Eco-friendly Waste Management
          </span>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 mt-6">

          {/* Normal Nav Items */}
          {navItems.map(({ name, icon: Icon, path }) => (
            <button
              key={name}
              onClick={() => nav(path)}
              className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                active === name
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <Icon size={18} />
              {name}
            </button>
          ))}

          {/* Notification Nav Item - Role Based */}
          {role && (
            <div className="pt-4 border-t border-gray-300 dark:border-zinc-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 px-2 mb-1">
                Notifications
              </p>
              <button
                onClick={() => nav("/notifications")}
                className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  active === "Notifications"
                    ? "bg-green-600 text-white shadow-md"
                    : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Bell size={18} />
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* NGO-only options */}
          {role === "ngo" && (
            <div className="pt-4 border-t border-gray-300 dark:border-zinc-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 px-2 mb-1">
                NGO Tools
              </p>

              <button
                onClick={() => nav("/opportunities/create")}
                className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  active === "Create Opportunity"
                    ? "bg-green-600 text-white shadow-md"
                    : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <PlusCircle size={18} />
                Create Opportunity
              </button>

              <button
                onClick={() => nav("/opportunities/edit")}
                className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  active === "Edit Opportunity"
                    ? "bg-green-600 text-white shadow-md"
                    : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                disabled={true}
              >
                <Pencil size={18} />
                Edit Opportunity
              </button>

              <button
                onClick={() => nav("/applications")}
                className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  active === "Applications"
                    ? "bg-green-600 text-white shadow-md"
                    : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <FileText size={18} />
                View Applications
              </button>
            </div>
          )}

          {/* Admin-only options */}
          {role === "admin" && (
            <div className="pt-4 border-t border-gray-300 dark:border-zinc-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 px-2 mb-1">
                Admin Controls
              </p>

              <button
                onClick={() => nav("/admin")}
                className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  active === "Admin Panel"
                    ? "bg-green-600 text-white shadow-md"
                    : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Shield size={18} />
                Admin Panel
              </button>
            </div>
          )}
        </nav>
      </div>
    </aside>
  );
}
