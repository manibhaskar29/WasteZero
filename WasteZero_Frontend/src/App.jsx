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

// Layout Components
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); // ✅ Wait for token check
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  // ✅ Initial auth check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAuthenticated(true);
    setAuthChecked(true); // mark auth as checked
  }, []);

  // ✅ Theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // ✅ Auth handlers
  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const authPages = ["/login", "/signup", "/forgot-password"];
  const isAuthPage = authPages.includes(location.pathname);

  const showSidebar =
    isAuthenticated &&
    !isAuthPage &&
    (location.pathname.startsWith("/dashboard") ||
      location.pathname.startsWith("/opportunities") ||
      location.pathname.startsWith("/profile"));

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen flex flex-col transition-colors duration-300">
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
        className={`flex-1 flex flex-col transition-all duration-300 ${
          showSidebar ? "ml-64" : "ml-0"
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
            <Route
              path="/oauth-redirect"
              element={<OAuthRedirect onLogin={handleLogin} />}
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? (
                  <Dashboard onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/opportunities"
              element={
                isAuthenticated ? (
                  <EcoOpportunitiesPage />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/opportunities/create"
              element={
                isAuthenticated && localStorage.getItem("role") === "ngo" ? (
                  <CreateOpportunity />
                ) : (
                  <Navigate to="/opportunities" replace />
                )
              }
            />
            <Route
              path="/opportunities/edit/:id"
              element={
                isAuthenticated && localStorage.getItem("role") === "ngo" ? (
                  <EditOpportunity />
                ) : (
                  <Navigate to="/opportunities" replace />
                )
              }
            />
            <Route
              path="/profile"
              element={
                isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />
              }
            />

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
    <Router>
      <AppContent />
    </Router>
  );
}
