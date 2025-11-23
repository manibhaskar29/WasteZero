import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import OpportunityForm from "../components/OpportunityForm";
import { createOpportunity } from "../api/opportunities.api";

export default function CreateOpportunity() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const handleSave = async (data) => {
    setSaving(true);

    await createOpportunity(data);

    setSaving(false);
    navigate("/opportunities");
  };


  return (
    <div className="min-h-screen bg-[#dff7ea] dark:bg-zinc-800 p-6 pt-20 transition-colors">
      <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-700 rounded-2xl shadow-xl p-8 border border-green-400/20 dark:border-green-300/10 transition-colors">

        <Link
          to="/eco-opportunities"
          className="text-green-700 dark:text-white hover:underline"
        >
          ← Back to Opportunities
        </Link>

        <h1 className="text-3xl font-semibold text-green-700 dark:text-green-200 mt-4 mb-6">
          Create Opportunity
        </h1>

        <OpportunityForm submitting={saving} onSubmit={handleSave} />
      </div>
    </div>
  );
}
