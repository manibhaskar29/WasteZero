import React, { useState, useEffect } from "react";
import { ArrowLeft, Lock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const token = query.get("token");
  const email = query.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Backend URL
  const API_URL =
    import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5173/api";

  useEffect(() => {
    if (!token || !email) {
      setError("Invalid or missing reset link.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setMessage("✅ Password reset successful!");

        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(data.message || "❌ Failed to reset password.");
      }
    } catch (err) {
      setLoading(false);
      setError("⚠️ Network error.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full font-inter bg-green-100 dark:bg-zinc-900 transition-colors">
      {/* Left side */}
      <div className="flex justify-center items-center w-full md:w-1/2 relative p-6 md:p-10">
        <div
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-800 dark:text-gray-300 cursor-pointer hover:text-green-700 dark:hover:text-green-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Home</span>
        </div>

        <div className="w-full max-w-lg bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-8 md:p-10 transition-all">
          <div className="flex items-center justify-start gap-2 mb-6">
            <img src="/Logo.svg" alt="WasteZero Logo" className="w-10 h-10" />
            <h1 className="text-2xl font-bold text-green-700 dark:text-green-400">
              WasteZero
            </h1>
          </div>

          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-2">
            Create New Password
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Enter your new password below.
          </p>

          {message && (
            <div className="bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400 text-sm p-2 rounded mb-3">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 text-sm p-2 rounded mb-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
                New Password
              </label>
              <input
                type="password"
                className="w-full p-3 mt-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 focus:ring-2 focus:ring-green-500 outline-none text-gray-900 dark:text-white"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full p-3 mt-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 focus:ring-2 focus:ring-green-500 outline-none text-gray-900 dark:text-white"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-md font-semibold transition-all disabled:opacity-60"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>

      {/* Right side */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-green-200 dark:bg-zinc-800 text-center px-8 py-12 transition-colors">
        <div className="bg-green-100 dark:bg-zinc-700 rounded-full p-6 mb-6 flex items-center justify-center shadow-md">
          <Lock className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>

        <h2 className="text-2xl font-semibold text-black dark:text-white mb-2">
          Secure Password Reset
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-md">
          Create a strong password so your account stays protected.
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
