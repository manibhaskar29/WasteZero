import React, { useState } from "react";
import axios from "axios";
import { updateUserProfile } from "../api/user.api";
export default function EnrollPickupModal({ pickup, onClose, onSuccess }) {
  const API = import.meta.env.VITE_BACKEND_API_URL;
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    userQuantityKg: "",
    userWasteTypes: [],
    meetingPoint: "",
    emergencyPhone: "",
    note: "",
  });

  const toggleWasteType = (type) => {
    setForm((prev) => {
      const exists = prev.userWasteTypes.includes(type);
      return {
        ...prev,
        userWasteTypes: exists
          ? prev.userWasteTypes.filter((t) => t !== type)
          : [...prev.userWasteTypes, type],
      };
    });
  };

  const submit = async () => {
    try {
      const res = await axios.post(
        `${API}/pickup/${pickup._id}/enroll`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ⭐ Update user data using existing update function
      await updateUserProfile(res.data.userUpdates);

      onSuccess(res.data.pickup);
      onClose();
    } catch (err) { 
      console.log("ERROR RESPONSE:", err); 
      alert(err.response?.data?.message || "Something went wrong"); 
    } 
  };



  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl w-[400px]">

        <h2 className="text-xl font-semibold mb-3">
          Enroll in Pickup
        </h2>

        {/* Quantity */}
        <label className="block mb-2">
          <span className="text-sm">Waste Quantity (kg)</span>
          <input
            type="number"
            className="w-full p-2 mt-1 border rounded"
            value={form.userQuantityKg}
            onChange={(e) =>
              setForm({ ...form, userQuantityKg: e.target.value })
            }
          />
        </label>

        {/* Waste Types */}
        <div className="mb-3">
          <span className="text-sm">Waste Types You Will Bring</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {pickup.wasteTypes.map((type, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggleWasteType(type)}
                className={`px-2 py-1 rounded border ${
                  form.userWasteTypes.includes(type)
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Meeting Point */}
        <label className="block mb-2">
          <span className="text-sm">Your Meeting Point</span>
          <input
            type="text"
            className="w-full p-2 mt-1 border rounded"
            placeholder="e.g. Near Sector 21 Bus Stop"
            value={form.meetingPoint}
            onChange={(e) =>
              setForm({ ...form, meetingPoint: e.target.value })
            }
          />
        </label>

        {/* Emergency Contact */}
        <label className="block mb-2">
          <span className="text-sm">Emergency Contact</span>
          <input
            type="text"
            className="w-full p-2 mt-1 border rounded"
            placeholder="+91 9000000000"
            value={form.emergencyPhone}
            onChange={(e) =>
              setForm({ ...form, emergencyPhone: e.target.value })
            }
          />
        </label>

        {/* Note */}
        <label className="block mb-4">
          <span className="text-sm">Additional Note (optional)</span>
          <textarea
            className="w-full p-2 mt-1 border rounded"
            rows={2}
            value={form.note}
            onChange={(e) =>
              setForm({ ...form, note: e.target.value })
            }
          />
        </label>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button onClick={submit} className="px-4 py-2 bg-green-600 text-white rounded">
            Enroll
          </button>
        </div>

      </div>
    </div>
  );
}
