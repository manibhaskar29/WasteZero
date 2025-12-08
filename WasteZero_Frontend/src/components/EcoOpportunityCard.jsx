import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser } from "../api/user.api";
import { fetchUserApplications } from "../api/user.api"; // function to fetch user's applications
import ApplicationModal from "./ApplicationModal";
import { deleteOpportunity } from "../api/opportunities.api"; // <-- make sure this import exists

export default function EcoOpportunityCard({ item, onView }) {
  const navigate = useNavigate();
  const [userSkills, setUserSkills] = useState([]);
  const [role, setRole] = useState("user");
  const [showApply, setShowApply] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await fetchCurrentUser();
        console.log(data);
        
        setUserSkills(data.user.skills || []);
        setRole(data.user.role || "user");

        // Check if user has already applied
        if (data.user.role === "user") {
          const applications = await fetchUserApplications(); // fetch all applications by this user
          const applied = applications.some(app => app.opportunityId === item._id);
          setHasApplied(applied);
        }
      } catch {
        setUserSkills([]);
        setRole("user");
      }
    };
    loadUser();
  }, [item._id]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this opportunity?")) return;

    try {
      await deleteOpportunity(id);

      alert("Opportunity deleted successfully!");
      window.location.reload(); // Refresh list
    } catch (err) {
      console.error("Delete error:", err.message);
      alert(err.message || "Failed to delete opportunity");
    }
  };


  const isNgo = role === "ngo";
  const isAdmin = role === "admin";
  const isUser = role === "user";
  const opportunitySkills = item.skills || [];

  const matches = opportunitySkills.filter((s) => userSkills.includes(s)).length;
  const total = opportunitySkills.length || 1;
  const matchScore = Math.round((matches / total) * 100);

  const getMatchColor = () => {
    if (matchScore >= 80) return "bg-green-100 text-green-700";
    if (matchScore >= 50) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  // Condition: opportunity is in the future and user hasn't applied
  const canApply = !isAdmin && !isNgo && !hasApplied && new Date(item.endDate) >= new Date();

  return (
    <div className="bg-white dark:bg-zinc-700 rounded-xl shadow-md p-5 hover:shadow-lg transition flex flex-col">

      {(isUser) && (
         <div className="flex justify-end mb-2">
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getMatchColor()}`}>
            {matchScore}% match
          </span>
        </div>
        )}
      

      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {item.title}
      </h2>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        📍 {item.location}
      </p>

      <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
        {item.description}
      </p>

      <div className="mt-auto flex gap-2 flex-wrap">
        {opportunitySkills.slice(0, 3).map((skill, i) => (
          <span
            key={i}
            className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-md"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={() => onView(item)}
          className="px-4 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
        >
          View
        </button>

        {canApply && (
          <button
            onClick={() => setShowApply(true)}
            className="px-4 py-1 border border-green-600 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-50 dark:hover:bg-zinc-600 text-sm"
          >
            Apply
          </button>
        )}

        {(isNgo || isAdmin) && (
          <>
            <button
              onClick={() => navigate(`/opportunities/edit/${item._id}`)}
              className="px-4 py-1 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700"
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(item._id)}
              className="px-4 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
            >
              Delete
            </button>
          </>
        )}

      </div>

      {showApply && (
        <ApplicationModal item={item} onClose={() => setShowApply(false)} />
      )}
    </div>
  );
}
