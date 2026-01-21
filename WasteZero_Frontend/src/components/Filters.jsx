// src/components/Matching/Filters.jsx
import React from "react";

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

export default function Filters({ filters, setFilters, onSearch }) {
  return (
    <div className="bg-white dark:bg-zinc-800 border border-green-100 dark:border-zinc-700 rounded-xl p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-4">
        Filters
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Skill */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Skill / Waste Type
          </label>
          <select
            value={filters.skill}
            onChange={(e) =>
              setFilters({ ...filters, skill: e.target.value })
            }
            className="w-full p-2 border rounded-md bg-gray-200 text-black dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
          >
            <option value="">Any</option>
            {WASTE_TYPES.map((skill, idx) => (
              <option key={idx} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location
          </label>
          <input
            type="text"
            value={filters.location}
            onChange={(e) =>
              setFilters({ ...filters, location: e.target.value })
            }
            placeholder="City or postcode"
            className="w-full p-2 border bg-gray-200 text-black rounded-md dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-3 justify-end">
        <button
          onClick={() => {
            const cleared = { skill: "", location: "" };
            setFilters(cleared);
            onSearch(cleared);
          }}
          className="px-4 py-2 rounded-md border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-700 text-sm"
        >
          Clear
        </button>
        <button
          onClick={() => onSearch(filters)}
          className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
        >
          Search Matches
        </button>
      </div>
    </div>
  );
}
