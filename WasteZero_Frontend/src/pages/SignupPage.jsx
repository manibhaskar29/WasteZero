import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, User, ShieldUser, UserCog  ,Eye, EyeOff} from "lucide-react";
import axios from "axios";


const WASTE_TYPES = [
  "Plastic Waste Management",
  "Metal Waste Handling",
  "Organic Waste Processing",
  "E-waste Recycling",
  "Glass Collection & Sorting",
  "Paper Recycling",
  "Textile Reuse & Recovery",
  "Composting Techniques",
  "Recycling Operations",
  "Waste Segregation Practices",
  "Transportation & Logistics",
  "Environmental Awareness Campaigns",
];

  
const SignupPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("user");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [tempUserData, setTempUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [otpToken, setOtpToken] = useState(null);
  

  const API_URL = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5173/api";

  const roles = [
    { name: "user", icon: User },
    { name: "ngo", icon: ShieldUser },
    { name: "admin", icon: UserCog },
  ];

  const handleSkillToggle = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError("❗ Passwords do not match"); return; }
    const form = e.target;
    console.log(form.password);
    
    const userData = {
      name: form.name.value,
      email: form.email.value,
      username: form.username.value,
      password: password,
      role: role|| "user",
      location: form.location.value,
      skills: [], // add skills if needed
    };

    setTempUserData(userData);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/send-otp`, { email: userData.email });
      setOtpToken(response.data.token); // store OTP JWT
      setShowOTP(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError("Enter valid 6-digit OTP");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/verify-otp`, {
        email: tempUserData.email,
        otp,
        token: otpToken,
        userData: tempUserData,
      });

      alert("Signup successful! Please login.");
      console.log(response.data); // token + user info
      navigate("/login"); // if using react-router
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };


  const handleOAuthLogin = (provider) => {
    window.location.href = `${API_URL}/auth/oauth/${provider}`;
  };

  if (showOTP) {
  return (
    <div className="flex min-h-screen justify-center items-center bg-green-100 dark:bg-zinc-900">
      <div className="bg-white dark:bg-zinc-800 shadow-lg p-8 rounded-xl max-w-sm w-full">
        <h2 className="text-xl font-bold text-center mb-4">Email Verification</h2>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-3">
          Enter the 6-digit OTP sent to <b>{tempUserData?.email}</b>
        </p>

        <input
          type="text"
          maxLength="6"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full text-center text-xl tracking-widest p-3 border rounded-lg bg-gray-50 dark:bg-zinc-700"
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          onClick={handleVerifyOtp}
          disabled={isLoading}
          className="w-full mt-4 bg-green-700 text-white py-2 rounded-lg hover:bg-green-800"
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
}


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

          {/* Logo */}
          <div className="flex items-center justify-center space-x-2 my-4">
            <img src="/Logo.svg" alt="Logo" className="h-8 w-8" />
            <span className="text-xl font-semibold text-green-700 dark:text-green-400">
              <span className="text-gray-900 dark:text-white">Waste</span>Zero
            </span>
          </div>

          {/* Role Selection */}
          <div className="text-center mb-7">
            <p className="mb-2 text-gray-700 dark:text-gray-300">I want to join as</p>

            <div className="flex justify-center gap-3">
              {roles.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setRole(name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-all text-sm font-medium ${
                    role === name
                      ? "bg-green-700 border-green-700 text-white"
                      : "border-green-700 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-zinc-700"
                  }`}
                >
                  <Icon size={18} className={role === name ? "text-white" : "text-green-700 dark:text-green-400"} />
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                required
                className="w-full p-2.5 mt-1 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-gray-50 dark:bg-zinc-700"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                placeholder="example@gmail.com"
                required
                className="w-full p-2.5 mt-1 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-gray-50 dark:bg-zinc-700"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
              <input
                type="text"
                name="username"
                placeholder="username123"
                required
                className="w-full p-2.5 mt-1 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-gray-50 dark:bg-zinc-700"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
              <input
                type="text"
                name="location"
                placeholder="City, Country"
                required
                className="w-full p-2.5 mt-1 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-gray-50 dark:bg-zinc-700"
              />
            </div>

            {/* Waste Type Selection for Users */}
            {role === "user" && (
              <div>
                <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 block">
                  Waste Types You Want to Help With
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-3 border rounded-lg bg-gray-50 dark:bg-zinc-700">
                  {WASTE_TYPES.map((skill, i) => (
                    <label
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(skill)}
                        onChange={() => handleSkillToggle(skill)}
                        className="h-4 w-4"
                      />
                      {skill}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 mt-1 pr-10 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-gray-50 dark:bg-zinc-700"
                />

                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-green-700 dark:text-green-400"
                  onClick={() => setShowPwd((s) => !s)}
                >
                  {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPwd ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2.5 mt-1 pr-10 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 bg-gray-50 dark:bg-zinc-700"
                />

                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-green-700 dark:text-green-400"
                  onClick={() => setShowConfirmPwd((s) => !s)}
                >
                  {showConfirmPwd ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full py-2.5 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
            >
              {isLoading ? "Loading..." : "Create Account"}
            </button>

            <div className="text-center text-gray-600 dark:text-gray-400">OR</div>

            <button
              type="button"
              onClick={() => handleOAuthLogin("google")}
              className="w-full py-2.5 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-zinc-700 flex items-center justify-center gap-2"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="20" />
              Continue with Google
            </button>

            <button
              type="button"
              onClick={() => handleOAuthLogin("github")}
              className="w-full py-2.5 border border-gray-700 dark:border-gray-400 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 flex items-center justify-center gap-2"
            >
              <img src="https://www.svgrepo.com/show/349375/github.svg" width="20" />
              Continue with GitHub
            </button>
          </form>

          <p className="text-center mt-5 text-sm text-gray-700 dark:text-gray-300">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-green-700 dark:text-green-400 font-semibold hover:underline"
            >
              Sign In
            </button>
          </p>

        </div>
      </div>
    </div>
  );
};

export default SignupPage;
