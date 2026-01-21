import React, { useState, useEffect } from "react";
import axios from "axios";
import EnrollPickupModal from "../components/EnrollPickupModal";
export default function SchedulePickupPage() {
  const API_URL = import.meta.env.VITE_BACKEND_API_URL;
  const role = localStorage.getItem("role"); // "user", "ngo", "admin"
  const userId = localStorage.getItem("userId"); // logged-in user ID

  const [activeTab, setActiveTab] = useState(role === "user" ? "history" : "schedule");
  const [history, setHistory] = useState([]);
  const [step, setStep] = useState(1);

  const [opportunities, setOpportunities] = useState([]);
  const [ngos, setNgos] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState(null);

  const [form, setForm] = useState({
    opportunityId: "",
    ngoId: role === "ngo" ? userId : "", // NGO users default to their own ID
    address: "",
    pickupDate: "",
    timeslot: "",
    wasteTypes: [],
    quantityKg: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (activeTab === "history") loadHistory();
    if (activeTab === "schedule") {
      loadOpportunities();
      if (role === "admin") loadNgos(); // Only admin needs to load NGOs
    }
  }, [activeTab]);



  async function loadHistory() {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${API_URL}/pickup/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(res.data);

      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadOpportunities() {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${API_URL}/opportunities`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOpportunities(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadNgos() {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${API_URL}/users?role=ngo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filter only users with role 'ngo'
      const ngos = res.data.filter(user => user.role === "ngo");
      console.log(ngos); // Debug: check that only NGOs are returned

      setNgos(ngos); // <-- use filtered array
    } catch (err) {
      console.error(err);
    }
  }


  function toggleWasteType(type) {
    setForm((prev) => ({
      ...prev,
      wasteTypes: prev.wasteTypes.includes(type)
        ? prev.wasteTypes.filter((t) => t !== type)
        : [...prev.wasteTypes, type],
    }));
  }

  async function schedulePickup(e) {
    e.preventDefault();
    setError("");

    // Detailed validation with specific error messages
    const missingFields = [];
    if (!form.opportunityId) missingFields.push("Opportunity");
    if (!form.ngoId) missingFields.push("NGO");
    if (!form.address) missingFields.push("Address");
    if (!form.pickupDate) missingFields.push("Pickup Date");
    if (form.wasteTypes.length === 0) missingFields.push("Waste Types");
    if (!form.quantityKg) missingFields.push("Quantity");

    if (missingFields.length > 0) {
      setError(`Please fill in: ${missingFields.join(", ")}`);
      // console.log("Missing fields:", missingFields);
      // console.log("Current form:", form);
      return;
    }

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `${API_URL}/pickup`,
        {
          opportunityId: form.opportunityId,
          ngoId: form.ngoId,
          createdBy: userId,
          address: form.address,
          pickupDate: form.pickupDate,
          timeslot: form.timeslot,
          wasteTypes: form.wasteTypes,
          quantityKg: Number(form.quantityKg),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setForm({
        opportunityId: "",
        ngoId: role === "ngo" ? userId : "",
        address: "",
        pickupDate: "",
        timeslot: "",
        wasteTypes: [],
        quantityKg: "",
      });
      setStep(1);
      setActiveTab("history");
      loadHistory();
    } catch (err) {
      console.error(err);
      setError("Failed to schedule pickup. Please try again.");
    }
  }
  useEffect(() => {
    if (role === "admin" && form.opportunityId) {
      const selectedOpportunity = opportunities.find(op => op._id === form.opportunityId);
      if (selectedOpportunity?.ngoId) {
        setForm(prev => ({ ...prev, ngoId: selectedOpportunity.ngoId }));
      }
    }
  }, [form.opportunityId]);

  async function updatePickupStatus(pickupId, status) {
    const token = localStorage.getItem("token");
    try {
      await axios.patch(
        `${API_URL}/pickup/${pickupId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadHistory(); // Refresh table
    } catch (err) {
      console.error(err);
    }
  }



  return (
    <div className="min-h-screen pt-20 p-6 bg-green-100 dark:bg-zinc-900">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-green-300 pb-2 mb-6">
        {(role === "ngo" || role === "admin") && (
          <button
            className={`px-4 py-2 rounded-t-lg font-medium cursor-pointer ${activeTab === "schedule" ? "bg-green-800 text-white" : "bg-green-600 dark:bg-zinc-700 dark:text-gray-200"
              }`}
            onClick={() => setActiveTab("schedule")}
          >
            Schedule Pickup
          </button>
        )}
        <button
          className={`px-4 py-2 rounded-t-lg font-medium cursor-pointer ${activeTab === "history" ? "bg-green-800 text-white" : "bg-green-600 dark:bg-zinc-700 dark:text-gray-200"
            }`}
          onClick={() => setActiveTab("history")}
        >
          Pickup History
        </button>
      </div>

      {/* Schedule Pickup Form */}
      {activeTab === "schedule" && (
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-md">
          {error && <p className="text-red-600 mb-4">{error}</p>}

          {step === 1 && (
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold text-green-700 dark:text-green-300">
                Request Waste Collection
              </h1>

              {/* Opportunity Select */}
              <div>
                <label className="font-semibold mb-1 block text-gray-700 dark:text-gray-300">Opportunity</label>
                <select
                  className="w-full p-2 border border-gray-300 bg-white rounded dark:bg-zinc-700"
                  value={form.opportunityId}
                  onChange={(e) => setForm({ ...form, opportunityId: e.target.value })}
                >
                  <option value="">Select an opportunity</option>
                  {opportunities.map((op) => (
                    <option key={op._id} value={op._id}>{op.title}</option>
                  ))}
                </select>
              </div>

              {/* NGO Select (only for admin) */}
              {role === "admin" && (
                <div>
                  <label className="font-semibold mb-1 block text-gray-700 dark:text-gray-300">NGO</label>
                  <select
                    className="w-full p-2 border border-gray-300 bg-white rounded dark:bg-zinc-700"
                    value={form.ngoId}
                    onChange={(e) => setForm({ ...form, ngoId: e.target.value })}
                  >
                    <option value="">Select an NGO</option>
                    {ngos.map((ngo) => (
                      <option key={ngo._id} value={ngo._id}>{ngo.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Address */}
              <div>
                <label className="font-semibold mb-1 block text-gray-700 dark:text-gray-300">Address</label>
                <input
                  type="text"
                  placeholder="Street address"
                  className="w-full p-2 border border-gray-300 bg-white rounded dark:bg-zinc-700"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>

              {/* Pickup Date */}
              <div>
                <label className="font-semibold mb-1 block text-gray-700 dark:text-gray-300">Pickup Date</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 bg-white rounded dark:bg-zinc-700"
                  value={form.pickupDate}
                  onChange={(e) => setForm({ ...form, pickupDate: e.target.value })}
                />
              </div>

              {/* Timeslot */}
              <div>
                <label className="font-semibold mb-1 block text-gray-700 dark:text-gray-300">Preferred Slot</label>
                <select
                  className="w-full p-2 border border-gray-300 bg-white rounded dark:bg-zinc-700"
                  value={form.timeslot}
                  onChange={(e) => setForm({ ...form, timeslot: e.target.value })}
                >
                  <option value="">Select a time slot</option>
                  <option>8:00 AM - 11:00 AM</option>
                  <option>11:00 AM - 2:00 PM</option>
                  <option>2:00 PM - 5:00 PM</option>
                  <option>5:00 PM - 8:00 PM</option>
                </select>
              </div>

              <button onClick={() => setStep(2)} className="bg-blue-600 text-white py-2 px-4 rounded cursor-pointer hover:bg-blue-700 transition">
                Next Step
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-green-700 dark:text-green-300">Waste Details</h2>

              <div className="grid grid-cols-2 gap-2">
                {["Plastic", "Glass", "Electronic Waste", "Paper", "Metal", "Organic Waste"].map((type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.wasteTypes.includes(type)}
                      onChange={() => toggleWasteType(type)}
                    />
                    {type}
                  </label>
                ))}
              </div>

              <div>
                <label className="font-semibold mb-1 block text-gray-700 dark:text-gray-300">Quantity (Kg)</label>
                <input
                  type="number"
                  min="1"
                  className="w-full p-2 border border-gray-300 bg-white rounded dark:bg-zinc-700"
                  value={form.quantityKg}
                  onChange={(e) => setForm({ ...form, quantityKg: e.target.value })}
                />
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="bg-gray-400 text-white py-2 px-4 rounded cursor-pointer hover:bg-gray-500 transition">
                  Previous Step
                </button>
                <button onClick={schedulePickup} className="bg-green-600 text-white py-2 px-4 rounded cursor-pointer hover:bg-green-700 transition">
                  Schedule Pickup
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pickup History */}
      {activeTab === "history" && (
        <div className="bg-white dark:bg-zinc-800 rounded-xl shadow p-4">
          {history.length === 0 ? (
            <div className="text-center py-6">
              <p>You haven't scheduled any pickups yet.</p>
              <button onClick={() => setActiveTab("schedule")} className="mt-4 bg-green-600 text-white py-2 px-4 rounded cursor-pointer hover:bg-green-700 transition">
                Schedule your first pickup
              </button>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-gray-700 dark:text-gray-300">
                  <th className="p-2">Waste</th>
                  <th className="p-2">Address</th>
                  <th className="p-2">Pickup Date</th>
                  <th className="p-2">Time Slot</th>
                  <th className="p-2">Created By</th>
                  <th className="p-2">Status</th>
                  {role === "admin" && <th className="p-2">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {history.map((h) => {
                  const isEnrolled = h.enrolledUsers?.some(e => e.userId === userId);
                  const canEnroll =
                    role === "user" &&
                    h.status === "Approved" &&
                    h.applicationStatus === "accepted"; // this comes from backend

                  return (
                    <tr key={h._id} className="border-b border-gray-300/40">
                      <td className="p-2">{h.wasteTypes?.join(", ")}</td>
                      <td className="p-2">{h.address}</td>
                      <td className="p-2">{new Date(h.pickupDate).toLocaleDateString()}</td>
                      <td className="p-2">{h.timeslot}</td>

                      <td className="p-2">
                        {h.createdBy?.role === "admin"
                          ? `Admin (for ${h.ngoId?.name})`
                          : `${h.ngoId?.name}  (${h.createdBy?.role})`}
                      </td>

                      <td
                        className={`p-2 ${h.status === "Completed"
                          ? "text-green-600"
                          : h.status === "Cancelled"
                            ? "text-red-600"
                            : "text-yellow-600"
                          }`}
                      >
                        {h.status}
                      </td>

                      {/* ACTIONS COLUMN */}
                      <td className="p-2">
                        {/* ADMIN ACTION BUTTONS */}
                        {role === "admin" ? (
                          h.status === "Pending" ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => updatePickupStatus(h._id, "Approved")}
                                className="bg-green-600 text-white px-2 rounded cursor-pointer hover:bg-green-700 transition"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => updatePickupStatus(h._id, "Cancelled")}
                                className="bg-red-600 text-white px-2 rounded cursor-pointer hover:bg-red-700 transition"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-500 italic">Decision made</span>
                          )
                        ) : null}

                        {/* USER ENROLL BUTTON */}
                        {role === "user" && (
                          <div>
                            {isEnrolled ? (
                              <span className="text-green-600 font-semibold">Enrolled</span>
                            ) : canEnroll ? (
                              <button
                                onClick={() => {
                                  setSelectedPickup(h);
                                  setOpenModal(true);
                                }}
                                className="bg-green-600 text-white px-3 rounded cursor-pointer hover:bg-green-700 transition"
                              >
                                Enroll
                              </button>
                            ) : (
                              <span className="text-gray-400 text-sm">Not eligible</span>
                            )}
                          </div>
                        )}

                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {openModal && selectedPickup && (
            <EnrollPickupModal
              pickup={selectedPickup}
              onClose={() => setOpenModal(false)}
              onSuccess={(updatedPickup) => {
                // update UI after successful enrollment
                setHistory((prev) =>
                  prev.map((p) => (p._id === updatedPickup._id ? updatedPickup : p))
                );
              }}
            />
          )}

        </div>
      )}

    </div>
  );
}
