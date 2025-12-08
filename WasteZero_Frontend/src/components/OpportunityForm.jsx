import React, { useState } from "react";

export default function OpportunityForm({
  initialValues = {},
  onSubmit,
  submitting,
}) {
  const [values, setValues] = useState({
    title: "",
    description: "",
    location: "",
    skills: [],
    duration: "",
    status: "Open",
    startDate: "",
    endDate: "",
    ...initialValues, // preload fields for edit
  });

  const ALL_SKILLS = [
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

  
  const setField = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSkill = (skill) => {
    setValues((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!values.title.trim() || !values.location.trim()) {
      alert("Title and Location are required");
      return;
    }

    onSubmit(values); // send data to parent
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 ">

      {/* Title */}
      <div>
        <label className="font-semibold mb-1 block text-gray-700 dark:text-gray-300">
          Title *
        </label>
        <input
          className="w-full border border-gray-300 dark:border-gray-700 text-gray-600
                     bg-white dark:bg-zinc-700  dark:text-zinc-400
                     rounded-xl px-3 py-2 focus:border-green-600"
          placeholder="e.g., Community Recycling Drive"
          value={values.title}
          onChange={(e) => setField("title", e.target.value)}
        />
      </div>

      {/* Description */}
      <div>
        <label className="font-semibold mb-1 block text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          rows="4"
          className="w-full border border-gray-300 dark:border-gray-700
                     bg-white dark:bg-zinc-700 text-gray-600 dark:text-zinc-400
                     rounded-xl px-3 py-2 focus:border-green-600"
          placeholder="Describe tasks, goals, and volunteer expectations"
          value={values.description}
          onChange={(e) => setField("description", e.target.value)}
        />
      </div>

      {/* Location */}
      <div>
        <label className="font-semibold mb-1 block text-gray-700 dark:text-gray-300">
          Location *
        </label>
        <input
          className="w-full border border-gray-300 dark:border-gray-700
                     bg-white dark:bg-zinc-700 text-gray-600 dark:text-zinc-400
                     rounded-xl px-3 py-2 focus:border-green-600"
          placeholder="City or area"
          value={values.location}
          onChange={(e) => setField("location", e.target.value)}
        />
      </div>

      {/* Skills */}
      <div>
        <label className="font-semibold block mb-1 text-gray-700 dark:text-gray-300">
          Required Skills
        </label>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl
                     bg-green-50 dark:bg-zinc-700 border border-green-300 dark:border-zinc-700"
        >
          {ALL_SKILLS.map((skill) => (
            <label
              key={skill}
              className={`flex items-center gap-2 px-3 py-3 rounded-xl bg-white
                dark:bg-zinc-700 shadow-md border cursor-pointer transition
                ${
                  values.skills.includes(skill)
                    ? "border-green-600 dark:border-green-400 shadow-lg text-green-700"
                    : "hover:border-green-400"
                }`}
            >
              <input
                type="checkbox"
                checked={values.skills.includes(skill)}
                onChange={() => toggleSkill(skill)}
                className="w-4 h-4 accent-green-600"
              />
              <span>{skill}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Duration + Status */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="font-semibold block mb-1 text-gray-700 dark:text-gray-300">
            Duration
          </label>
          <input 
            className="w-full border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-zinc-400
                       bg-white dark:bg-zinc-700 rounded-xl px-3 py-2"
            placeholder="e.g., 3 hours/day"
            value={values.duration}
            onChange={(e) => setField("duration", e.target.value)}
          />
        </div>

        <div className="flex-1">
          <label className="font-semibold block mb-1 text-gray-700 dark:text-gray-300">
            Status
          </label>
          <select
            className="w-full border border-gray-300 dark:border-gray-700
                       bg-white dark:bg-zinc-700 rounded-xl px-3 py-2"
            value={values.status}
            onChange={(e) => setField("status", e.target.value)}
          >
            <option value="Open">Open</option>
            <option value="In-Progress">In-Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Dates */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="font-semibold block mb-1 text-gray-700 dark:text-gray-300">
            Start Date
          </label>
          <input
            type="date"
            className="w-full border border-gray-300 dark:border-gray-700
                       bg-white dark:bg-zinc-700 rounded-xl px-3 py-2"
            value={values.startDate}
            onChange={(e) => setField("startDate", e.target.value)}
          />
        </div>

        <div className="flex-1">
          <label className="font-semibold block mb-1 text-gray-700 dark:text-gray-300">
            End Date
          </label>
          <input
            type="date"
            className="w-full border border-gray-300 dark:border-gray-700
                       bg-white dark:bg-zinc-700 rounded-xl px-3 py-2"
            value={values.endDate}
            onChange={(e) => setField("endDate", e.target.value)}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          type="reset"
          className="px-5 py-2 border rounded-xl border-gray-300 dark:border-gray-700
                     text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() =>
            setValues({
              title: "",
              description: "",
              location: "",
              skills: [],
              duration: "",
              status: "Open",
              startDate: "",
              endDate: "",
            })
          }
        >
          Reset
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700
                     dark:bg-green-600 dark:hover:bg-green-400 shadow-md"
        >
          {submitting ? "Saving..." : "Save Opportunity"}
        </button>
      </div>
    </form>
  );
}
