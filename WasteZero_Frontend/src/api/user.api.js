// api/users.api.js
import axios from "axios";

const API_URL = import.meta.env.BACKEND_API_URL || "http://localhost:5173/api/auth";

// ✅ Get current user info
export const fetchCurrentUser = async () => {
  try {
    // Get JWT from localStorage
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found. Please login first.");

    // Make request to /me
    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`, // <-- required for protected route
      },
    });

    // response.data will contain user info
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// ✅ Update user profile (address, phone, etc.)
export const updateUserProfile = async (data) => {
  const token = localStorage.getItem("token");
  const res = await axios.put(`${API_URL}/me`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// ✅ Change user password
export const changeUserPassword = async ({ currentPassword, newPassword }) => {
  const token = localStorage.getItem("token");
  const res = await axios.put(
    `${API_URL}/me/password`,
    { currentPassword, newPassword },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};
