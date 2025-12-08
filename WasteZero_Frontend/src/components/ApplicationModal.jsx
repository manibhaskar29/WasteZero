// src/components/ApplicationModal.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchCurrentUser } from "../api/user.api";

export default function ApplicationModal({ item, onClose }) {
  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    experience: "",
    skills: "",
    availability: "",
    motivation: "", // why should we select you
  });

  const API_URL = import.meta.env.VITE_BACKEND_API_URL;

  useEffect(() => {
    async function loadUser() {
      const u = await fetchCurrentUser();
      setUser(u.user);
      
      setForm((prev) => ({
        ...prev,
        name: `${u.user.name}` || "",
        email: u.user.email || "",
      }));
    }
    loadUser();
  }, []);

  const updateField = (field, value) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      opportunityId: item._id,
      userId: user?._id,
      skills: form.skills.split(",").map((s) => s.trim()),
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/opportunities/${item._id}/apply`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Application submitted successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to submit application.");
    }
  };

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

    <div
      className="relative bg-white dark:bg-zinc-900 
      w-full max-w-xl max-h-[90vh]
      rounded-2xl shadow-2xl overflow-hidden 
      animate-fadeIn scale-95"
    >

      {/* HEADER */}
      <div className="px-6 py-4 border-b dark:border-zinc-700 sticky top-0 bg-white dark:bg-zinc-900 z-10">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Apply for "{item.title}"
        </h2>
      </div>

      {/* FORM BODY (scrollable) */}
      <div className="overflow-y-auto px-6 py-5 space-y-5 max-h-[70vh]">
        
        {/* field wrapper */}
        {[
          { key: "name", label: "Full Name", type: "text" },
          { key: "email", label: "Email", type: "email" },
          { key: "phone", label: "Phone Number", type: "text", placeholder: "+91 9876543210" },
          { key: "location", label: "Current Location", type: "text", placeholder: "City, Country" },
          { key: "experience", label: "Experience", type: "text", placeholder: "e.g. 2 years in volunteering" },
          { key: "skills", label: "Skills", type: "text", placeholder: "communication, planting, organizing..." },
          { key: "availability", label: "Availability", type: "text", placeholder: "Weekends / Weekdays / Evenings" }
        ].map((f) => (
          <div key={f.key} className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {f.label}
            </label>

            <input
              type={f.type}
              value={form[f.key]}
              placeholder={f.placeholder || ""}
              onChange={(e) => updateField(f.key, e.target.value)}
              className="modern-input"
              required={["experience"].includes(f.key) ? false : true}
            />
          </div>
        ))}

        {/* Motivation Textarea */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Why should we select you?
          </label>
          <textarea
            value={form.motivation}
            onChange={(e) => updateField("motivation", e.target.value)}
            className="modern-input h-28 resize-none"
            placeholder="Explain why you are a great fit..."
            required
          />
        </div>
      </div>

      {/* FOOTER */}
      <div className="px-6 py-4 border-t dark:border-zinc-700 flex gap-3 sticky bottom-0 bg-white dark:bg-zinc-900">
        <button
          type="button"
          onClick={onClose}
          className="w-1/2 border border-gray-300 dark:border-zinc-700 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          className="w-1/2 bg-green-600 hover:bg-green-700 transition text-white py-2 rounded-lg font-medium shadow"
        >
          Submit Application
        </button>
      </div>
    </div>
  </div>
);
}