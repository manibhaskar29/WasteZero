import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, User, ShieldUser, UserCog } from "lucide-react";
import axios from "axios";

const SignupPage = () => {
  const [role, setRole] = useState("user");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_URL = import.meta.env.BACKEND_API_URL || "http://localhost:5173/api";

  const roles = [
    { name: "user", icon: User },
    { name: "ngo", icon: ShieldUser },
    { name: "admin", icon: UserCog },
  ];

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("❗ Passwords do not match");
      return;
    }

    const formDataObj = new FormData(e.target); // use FormData
    const formData = {
      name: formDataObj.get("name"),
      email: formDataObj.get("email"),
      username: formDataObj.get("username"),
      password,
      role,
      location: formDataObj.get("location"),
    };

    try {
      await axios.post(`${API_URL}/auth/signup`, formData);
      alert("✅ Account created successfully!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  // OAuth
  const handleOAuthLogin = (provider) => {
    window.location.href = `${API_URL}/auth/oauth/${provider}`;
  };

  return (
    <div className="flex min-h-screen w-full bg-green-100 dark:bg-zinc-900 transition-colors">
      {/* Left Section */}
      <div className="hidden md:flex flex-col justify-center items-center text-center p-10 bg-green-200 dark:bg-zinc-800 w-1/2 transition-colors">
        <div className="max-w-md">
          <h2 className="font-bold text-5xl mb-8 py-5 text-gray-900 dark:text-white">
            Start Your Journey to{" "}
            <span className="text-green-700 dark:text-green-400">Zero Waste</span>
          </h2>

          {[
            { title: "Easy Waste Scheduling", desc: "Schedule pickups at your convenience with just a few clicks." },
            { title: "Track Your Impact", desc: "Monitor your waste statistics and environmental contribution." },
            { title: "Smart Agent Matching", desc: "Get paired with nearby agents for efficient pickups." },
          ].map((item, i) => (
            <div key={i} className="mb-6">
              <h5 className="flex items-center justify-center gap-2 text-2xl font-semibold mb-1 text-gray-900 dark:text-white">
                <ShieldCheck size={48} className="text-green-700 dark:text-green-400" />
                {item.title}
              </h5>
              <p className="text-m text-gray-700 dark:text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex justify-center items-center p-6 md:p-10 w-full md:w-1/2 relative">
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 text-green-700 dark:text-green-400 font-medium text-sm hover:underline"
        >
          ← Back to Home
        </button>

        <div className="w-full max-w-md bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-8 md:p-10 transition-colors">
          <div className="flex items-center justify-center space-x-2 my-4">
            <img src="/Logo.svg" alt="Logo" className="h-8 w-8" />
            <span className="text-xl font-semibold text-green-700 dark:text-green-400">
              <span className="text-gray-900 dark:text-white">Waste</span>Zero
            </span>
          </div>

          {/* Role Selection */}
          <div className="text-center mb-5">
            <p className="mb-2 text-gray-700 dark:text-gray-300">I want to join as</p>
            <div className="flex justify-center gap-3">
              {roles.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setRole(name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-all ${
                    role === name
                      ? "bg-green-700 border-green-700 text-white"
                      : "border-green-700 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-zinc-700"
                  }`}
                >
                  <Icon size={20} className={role === name ? "text-white" : "text-green-700 dark:text-green-400"} />
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="text" name="name" placeholder="Full Name" required className="w-full p-2 border rounded-md" />
            <input type="email" name="email" placeholder="Email" required className="w-full p-2 border rounded-md" />
            <input type="text" name="username" placeholder="Username" required className="w-full p-2 border rounded-md" />
            <input type="text" name="location" placeholder="Location" required className="w-full p-2 border rounded-md" />

            <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded-md" />
            <input type="password" placeholder="Confirm Password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-2 border rounded-md" />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button type="submit" className="w-full py-2 bg-green-700 text-white rounded-md hover:bg-green-800">
              Create Account
            </button>

            <div className="text-center text-gray-600 dark:text-gray-400">OR</div>

            <button type="button" onClick={() => handleOAuthLogin("google")} className="w-full py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 flex items-center justify-center gap-2">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="20" />
              Continue with Google
            </button>

            <button type="button" onClick={() => handleOAuthLogin("github")} className="w-full py-2 border border-gray-700 text-gray-700 rounded-md hover:bg-gray-50 dark:border-gray-400 dark:text-gray-300 dark:hover:bg-zinc-700 flex items-center justify-center gap-2">
              <img src="https://www.svgrepo.com/show/349375/github.svg" alt="GitHub" width="20" />
              Continue with GitHub
            </button>
          </form>

          <p className="text-center mt-4 text-sm text-gray-700 dark:text-gray-300">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="text-green-700 dark:text-green-400 font-semibold hover:underline">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
