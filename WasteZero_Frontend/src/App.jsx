import "./App.css";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// Pages
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import ForgetPassword from "./pages/ForgetPassword";
import Login from "./pages/Login";
import SignupPage from "./pages/SignupPage";
import OAuthRedirect from "./authHandler/OAuthRedirecting";
import EcoOpportunitiesPage from "./pages/EcoOpportunitiesPage";
import ProfilePage from "./pages/ProfilePage";
import CreateOpportunity from "./pages/CreateOpportunity";
import EditOpportunity from "./pages/EditOpportunity";
import ResetPassword from "./pages/ResetPassword";
import ChatPage from "./pages/ChatPage";
import SettingsPage from "./pages/Setting";
import HelpPage from "./pages/HelpSupport";
import NgoApplicantsPage from "./pages/NGOApplicantPage";
import SchedulePickupPage from "./pages/SchedulePickupPage";
import AdminPanel from "./pages/AdminManagementPage";
import NotificationsPage from "./pages/NotificationPage";

// Layout Components
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

// Services
import { connectSocket } from "./services/socket";

// Notification Context
import { NotificationProvider, useNotifications } from "./context/NotificationContext";

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });
  const location = useLocation();
  const { fetchNotifications } = useNotifications();

  /** 🔐 Initial auth state check */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      connectSocket({ token });
      fetchNotifications(); // fetch initial notifications

    }
    setAuthChecked(true);
  }, []);

  /** 🌙 Dark mode toggle */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  /** 🔐 Login handler */
  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    connectSocket({ token });
    fetchNotifications();
  };

  /** 🔐 Logout handler */
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.clear();
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  /** Pages that should NOT show header/sidebar */
  const authPages = ["/login", "/signup", "/forgot-password", "/reset-password", "/oauth-redirect"];
  const isAuthPage = authPages.includes(location.pathname);

  /** Sidebar visibility */
  const showSidebar =
    isAuthenticated &&
    !isAuthPage &&
    (location.pathname.startsWith("/dashboard") ||
      location.pathname.startsWith("/opportunities") ||
      location.pathname.startsWith("/profile") ||
      location.pathname.startsWith("/chats") ||
      location.pathname.startsWith("/help") ||
      location.pathname.startsWith("/settings") ||
      location.pathname.startsWith("/applications") ||
      location.pathname.startsWith("/schedule") ||
      location.pathname.startsWith("/admin") ||
      location.pathname.startsWith("/notifications")
    );

  return (
    <div className="bg-green-100 dark:bg-zinc-900 text-gray-900 dark:text-white min-h-screen flex flex-col transition-colors duration-300">

      {/* Sidebar */}
      {showSidebar && (
        <Sidebar
          active={
            location.pathname.includes("/opportunities/create")
              ? "Create Opportunity"
              : location.pathname.includes("/opportunities/edit")
                ? "Edit Opportunity"
                : location.pathname.includes("/opportunities")
                  ? "Eco Opportunities"
                  : location.pathname.includes("/profile")
                    ? "My Profile"
                    : location.pathname.includes("/chats")
                      ? "Messages"
                      : location.pathname.includes("/help")
                        ? "Help & Support"
                        : location.pathname.includes("/settings")
                          ? "Settings"
                          : location.pathname.includes("/applications")
                            ? "Applications"
                            : location.pathname.includes("/schedule")
                              ? "Pickup Schedule"
                              : location.pathname.includes("/admin")
                                ? "Admin Panel"
                                : location.pathname.includes("/notifications")
                                  ? "Notifications"
                                  : "Dashboard"
          }
          onLogout={handleLogout}
        />
      )}

      {/* Header */}
      {!isAuthPage && (
        <Header
          isAuthenticated={isAuthenticated}
          onLogin={handleLogin}
          onLogout={handleLogout}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          hasSidebar={showSidebar}
        />
      )}

      {/* Main Content */}
      <main
        className={`flex-1 flex flex-col transition-all duration-300 ${showSidebar ? "ml-64" : "ml-0"
          }`}
      >
        {!authChecked ? (
          <div className="flex-1 flex items-center justify-center text-gray-700 dark:text-gray-300">
            Loading...
          </div>
        ) : (
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage onLogin={handleLogin} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgetPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/oauth-redirect"
              element={<OAuthRedirect onLogin={handleLogin} />}
            />

            {/* Protected Routes */}
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
            <Route path="/schedule" element={isAuthenticated ? <SchedulePickupPage onLogout={handleLogout} /> : <Navigate to="/login" replace />} />
            <Route path="/opportunities" element={isAuthenticated ? <EcoOpportunitiesPage /> : <Navigate to="/login" replace />} />
            <Route path="/chats" element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" replace />} />
            <Route path="/chats/:chatId" element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" replace />} />
            <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />} />
            <Route path="/help" element={isAuthenticated ? <HelpPage /> : <Navigate to="/login" replace />} />
            <Route path="/settings" element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" replace />} />
            <Route path="/notifications" element={isAuthenticated ? <NotificationsPage /> : <Navigate to="/login" replace />} />

            {/* NGO-only routes */}
            <Route path="/opportunities/create" element={isAuthenticated && localStorage.getItem("role") === "ngo" ? <CreateOpportunity /> : <Navigate to="/opportunities" replace />} />
            <Route path="/opportunities/edit/:id" element={isAuthenticated && localStorage.getItem("role") === "ngo" ? <EditOpportunity /> : <Navigate to="/opportunities" replace />} />
            <Route path="/applications" element={isAuthenticated && localStorage.getItem("role") === "ngo" ? <NgoApplicantsPage /> : <Navigate to="/opportunities" replace />} />

            {/* Admin-only routes */}
            <Route path="/admin" element={isAuthenticated && localStorage.getItem("role") === "admin" ? <AdminPanel /> : <Navigate to="/dashboard" replace />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <Router>
        <AppContent />
      </Router>
    </NotificationProvider>
  );
}
