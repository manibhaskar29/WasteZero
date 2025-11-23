import React from "react";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
export default function EcoOpportunityDetail({ item, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-zinc-700 p-8 rounded-2xl w-full max-w-2xl shadow-xl relative max-h-[90vh] overflow-y-auto">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 dark:text-gray-300"
        >
          <X size={22}/>
        </button>

        <h2 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">
          {item.title}
        </h2>

        <p className="text-gray-600 dark:text-gray-300 mb-4">
          📍 {item.location}
        </p>

        <p className="text-gray-700 dark:text-gray-200 mb-4">
          {item.description}
        </p>

        <h3 className="font-semibold text-lg mb-2">Required Skills</h3>
        <ul className="list-disc pl-6 space-y-1 text-gray-700 dark:text-gray-200">
          {(item.skills || []).map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>

        <div className="mt-6">
          <strong>Duration:</strong> {item.duration || "N/A"}
        </div>

        <div className="mt-2">
          <strong>Status:</strong> {item.status}
        </div>


        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Close
          </button>
        </div>


      </div>
    </div>
  );
}
