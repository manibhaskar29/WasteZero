import React, { useState } from "react";
import { ArrowLeft, Lock, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ✅ API base URL
  const API_URL = import.meta.env.BACKEND_API_URL || "http://localhost:5173/api";

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setMessage("✅ Reset link sent! Check your email inbox.");
        setEmail("");
      } else {
        setError(data.message || "❌ Failed to send reset link.");
      }
    } catch (err) {
      setLoading(false);
      setError("⚠️ Network error, please try again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full font-inter bg-green-100 dark:bg-zinc-900 transition-colors">
      {/* 🌿 Left Section (Form Side) */}
      <div className="flex justify-center items-center w-full md:w-1/2 relative p-6 md:p-10">
        {/* 🔙 Back Link */}
        <div
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-800 dark:text-gray-300 cursor-pointer hover:text-green-700 dark:hover:text-green-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Home</span>
        </div>

        {/* 🧩 Main Card */}
        <div className="w-full max-w-lg bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-8 md:p-10 transition-all">
          {/* Logo */}
          <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
            <img src="/Logo.svg" alt="WasteZero Logo" className="w-10 h-10" />
            <h1 className="text-2xl font-bold text-green-700 dark:text-green-400">
              WasteZero
            </h1>
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-2">
            Reset Your Password
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Enter your email address and we’ll send you a link to reset your password.
          </p>

          {/* ✅ Success or Error Message */}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
            <label className="text-sm font-medium text-gray-800 dark:text-gray-200 text-left">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-md font-semibold transition-all disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {/* 💡 Help Section */}
          <div className="bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm p-4 mb-6 text-left transition-all">
            <div className="flex items-center font-semibold mb-2 text-gray-900 dark:text-white">
              <span className="mr-2">💡</span> Need Help?
            </div>
            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>Use the email you signed up with</li>
              <li>Check your spam folder if you don’t see the email</li>
              <li>The reset link expires in 1 hour</li>
            </ul>
          </div>

          {/* 🧭 Signup Link */}
          <p className="text-sm text-center text-gray-800 dark:text-gray-300">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-green-700 dark:text-green-400 font-semibold cursor-pointer hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* 🌱 Right Section (Info Side) */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-green-200 dark:bg-zinc-800 text-center px-8 py-12 transition-colors">
        <div className="bg-green-100 dark:bg-zinc-700 rounded-full p-6 mb-6 flex items-center justify-center shadow-md">
          <Lock className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>

        <h2 className="text-2xl font-semibold text-black dark:text-white mb-2">
          Secure Account Recovery
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-md">
          We'll help you get back to managing waste responsibly in no time.
          Your account security is our top priority.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <div className="bg-green-100 dark:bg-zinc-700 rounded-xl p-4 w-40 flex flex-col items-center shadow-sm hover:shadow-md transition-all">
            <Lock className="w-6 h-6 mb-2 text-green-600 dark:text-green-400" />
            <p className="font-medium text-gray-900 dark:text-white">Secure Process</p>
          </div>
          <div className="bg-green-100 dark:bg-zinc-700 rounded-xl p-4 w-40 flex flex-col items-center shadow-sm hover:shadow-md transition-all">
            <Zap className="w-6 h-6 mb-2 text-green-600 dark:text-green-400" />
            <p className="font-medium text-gray-900 dark:text-white">Quick Reset</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
