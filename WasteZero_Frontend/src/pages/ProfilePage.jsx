import React, { useState, useEffect } from "react";
import { fetchCurrentUser, updateUserProfile, changeUserPassword } from "../api/user.api";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState([]);
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

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await fetchCurrentUser(); // API call to get current user
        setUser(data.user);    
        setAddress(data.user.location || "");
        setPhone(data.phone || "");
        setSkills(data.user.skills || []);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const handleProfileSave = async () => {
    try {
      const updated = { address, phone, skills };
      const data = await updateUserProfile(updated); // API call to update profile
      setUser(data.user);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating profile.");
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await changeUserPassword({ currentPassword, newPassword }); // API call to change password
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      alert("Password updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error changing password.");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!user) return <div className="p-8 text-red-600">User not found.</div>;

  return (
    <div className="min-h-screen pt-20 p-8 bg-green-100 dark:bg-zinc-900 transition-colors">
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-green-200">My Profile</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">Manage your account preferences</p>

      <div className="space-y-6">
        {/* Profile Information */}
        <div className="bg-white dark:bg-zinc-800 shadow rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-green-200">Profile Information</h2>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 bg-green-700 dark:bg-green-500 text-white flex items-center justify-center rounded-full text-2xl font-semibold">
              {(user?.name?.[0] || "U").toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-green-100">{user.name}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
              <input
                className="w-full mt-1 p-2 border rounded-lg cursor-not-allowed bg-gray-100 dark:bg-zinc-700 "
                value={user.name?.split(" ")[0] || ""}
                disabled
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
              <input
                className="w-full mt-1 p-2 border rounded-lg cursor-not-allowed bg-gray-100 dark:bg-zinc-700 "
                value={user.name?.split(" ")[1] || ""}
                disabled
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
              <input
                className="w-full mt-1 p-2 border rounded-lg cursor-not-allowed bg-gray-100 dark:bg-zinc-700 "
                value={user.username || ""}
                disabled
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              className="w-full mt-1 p-2 border rounded-lg cursor-not-allowed bg-gray-100 dark:bg-zinc-700 "
              value={user.email || ""}
              disabled
            />
          </div>
        </div>

        


        {/* Location Section - visible for all */}
        <div className="bg-white dark:bg-zinc-800 shadow rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          {/* Location Section (visible for all roles) */}
          <div className="mb-5">
            <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-green-200">Default Location</h4>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
            <input
              className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-zinc-700"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* Skills Section (only for normal users) */}
          {user.role === "user" && (
            <div className="mb-5">
              <h4 className="text-lg font-semibold mb-2 text-gray-800 dark:text-green-200">Waste Types You Can Help With</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-3 border rounded-lg bg-gray-50 dark:bg-zinc-700">
                {WASTE_TYPES.map((type, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={skills.includes(type)}
                      onChange={() => {
                        if (skills.includes(type)) {
                          setSkills(skills.filter((s) => s !== type));
                        } else {
                          setSkills([...skills, type]);
                        }
                      }}
                    />
                    {type}
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Select all areas where you want to volunteer.
              </p>
            </div>
          )}

          {/* Save Changes button */}
          <button
            onClick={handleProfileSave}
            className="w-full mt-4 py-2 bg-green-700 dark:bg-green-600 text-white rounded-lg hover:bg-green-800 dark:hover:bg-green-400 transition shadow-md"
          >
            Save Changes
          </button>
        </div>



        {/* Change Password */}
        <div className="bg-white dark:bg-zinc-800 shadow rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-green-200">Change Password</h2>

          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
          <input type="password" className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-zinc-700 " value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />

          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-4 block">New Password</label>
          <input type="password" className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-zinc-700 " value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-4 block">Confirm New Password</label>
          <input type="password" className="w-full mt-1 p-2 border rounded-lg bg-white dark:bg-zinc-700 " value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

          <button onClick={handlePasswordChange} className="w-full mt-4 py-2 bg-green-700 dark:bg-green-600 text-white rounded-lg hover:bg-green-800 dark:hover:bg-green-400 transition shadow-md">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
}
