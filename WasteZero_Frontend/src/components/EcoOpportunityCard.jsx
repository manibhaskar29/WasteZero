import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function EcoOpportunityCard({ item, onClick }) {
    const navigate = useNavigate();
    const isNgo = localStorage.getItem("role") === "ngo";

  return (
    <div
      onClick={() => onClick(item)}
      className="cursor-pointer bg-white dark:bg-zinc-700 rounded-xl shadow-md p-5 hover:shadow-lg transition flex flex-col"
    >

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
        {(item.skills || []).slice(0, 3).map((skill, i) => (
          <span
            key={i}
            className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-md"
          >
            {skill}
          </span>
        ))}
      </div>

        {isNgo && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/opportunities/edit/${item._id}`);
          }}
          className="mt-3 px-3 py-1 bg-green-600 text-white text-sm rounded-lg"
        >
          Edit
        </button>
      )}

    </div>
  );
}
