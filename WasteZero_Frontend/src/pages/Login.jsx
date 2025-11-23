import React, { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import google from "../assets/google.svg";
import github from "../assets/github.svg";

export default function Login({onLogin}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Your backend (Express) base URL — fix this!
  const API_URL = import.meta.env.BACKEND_API_URL || "http://localhost:5173/api"; 
  // ^ should point to BACKEND (not frontend). You had `5173` (frontend dev server)

  /** 🔍 Validation */
  const validate = () => {
    const e = {};
    if (!email) e.email = "Enter your email";
    if (!password) e.password = "Enter your password";
    return e;
  };

  /** 🔐 Login Handler */
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    setMessage("");
    if (Object.keys(e).length > 0) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // ✅ for cookies if your backend uses them
      });

      const data = await res.json();
      // console.log(data);
      
      setLoading(false);

      if (res.ok) {
        setMessage("Login successful!");
        setErrors({});

        // Save token + user info
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.user.role);
          localStorage.setItem("userId", data.user.id);
          localStorage.setItem("name", data.user.name);
          onLogin(data.token);

          navigate("/dashboard", { replace: true });
        }

        return;
      } else {
        setErrors({ general: data.message || "Invalid credentials" });
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      setErrors({ general: "Network error, please try again." });
    }
  };

  /** 🌐 OAuth Login (Google / GitHub) */
  const handleOAuthLogin = (provider) => {
    // Redirect to your backend OAuth route
    window.location.href = `${API_URL}/auth/oauth/${provider}`;
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full font-inter bg-green-100 dark:bg-zinc-900 transition-colors duration-300">
      {/* Left Panel */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-green-100 dark:bg-zinc-800 px-6 md:px-12 py-8 relative transition-colors">
        <button
          onClick={() => navigate("/")}
          className="absolute top-6 left-6 flex items-center gap-2 text-green-800 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>

        {/* Card */}
        <div className="bg-white dark:bg-zinc-700 rounded-2xl shadow-md p-6 sm:p-8 w-full max-w-md transition-colors">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-2 my-4">
            <img src="/Logo.svg" alt="Logo" className="h-8 w-8" />
            <span className="text-xl font-semibold text-green-700 dark:text-green-400">
              <span className="text-gray-900 dark:text-white">Waste</span>Zero
            </span>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1 text-center">
            Welcome Back!
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 text-center">
            Sign in to your WasteZero account
          </p>

          {/* Alerts */}
          {errors.general && (
            <div className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 text-sm p-2 rounded mb-3">
              {errors.general}
            </div>
          )}
          {message && (
            <div className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-sm p-2 rounded mb-3">
              {message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className={`w-full p-3 rounded-lg border ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500`}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1"
              >
                Password
              </label>
              <div
                className={`flex items-center border rounded-lg ${
                  errors.password
                    ? "border-red-500 focus-within:ring-red-400"
                    : "border-gray-300 dark:border-gray-600 focus-within:ring-green-500"
                } bg-white dark:bg-zinc-800 focus-within:ring-2 transition`}
              >
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  placeholder="Enter your password"
                  className="flex-1 px-3 py-2 rounded-lg outline-none bg-transparent text-gray-900 dark:text-gray-100"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="p-2 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-zinc-700 rounded-r-lg transition"
                  onClick={() => setShowPwd((s) => !s)}
                >
                  {showPwd ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Remember + Forgot */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded text-green-600 focus:ring-green-500"
                />
                <span className="text-gray-700 dark:text-gray-300">
                  Remember me
                </span>
              </label>

              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-green-700 dark:text-green-400 font-medium hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* ✅ FIXED Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 dark:hover:bg-green-500 transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            {/* Divider */}
            <div className="text-center text-gray-500 dark:text-gray-400 text-sm my-3">
              or
            </div>

            {/* OAuth Buttons */}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleOAuthLogin("google")}
                className="flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-600 rounded-lg py-2 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 transition"
              >
                <img src={google} alt="Google" className="w-5 h-5" />
                <span className="text-gray-800 dark:text-gray-200 font-medium">
                  Continue with Google
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleOAuthLogin("github")}
                className="flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-600 rounded-lg py-2 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 transition"
              >
                <img src={github} alt="GitHub" className="w-5 h-5" />
                <span className="text-gray-800 dark:text-gray-200 font-medium">
                  Continue with GitHub
                </span>
              </button>
            </div>

            {/* Signup Link */}
            <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-4">
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-green-700 dark:text-green-400 font-semibold hover:underline"
              >
                Sign Up
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden md:flex flex-col justify-center items-center w-full md:w-1/2 bg-green-200 dark:bg-zinc-900 text-green-900 dark:text-gray-100 px-8 py-12 text-center transition-colors">
        <div className="max-w-md">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Smart Waste Management at Your Fingertips
          </h1>
          <p className="text-lg mb-8 text-gray-700 dark:text-gray-300">
            Join thousands of users making a difference in waste management and
            environmental sustainability.
          </p>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <h3 className="text-2xl font-bold text-green-900 dark:text-green-400">
                10K+
              </h3>
              <p className="text-gray-800 dark:text-gray-300 text-sm">
                Active Users
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-green-900 dark:text-green-400">
                500+
              </h3>
              <p className="text-gray-800 dark:text-gray-300 text-sm">
                Agents
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-green-900 dark:text-green-400">
                50K+
              </h3>
              <p className="text-gray-800 dark:text-gray-300 text-sm">
                Pickups
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
