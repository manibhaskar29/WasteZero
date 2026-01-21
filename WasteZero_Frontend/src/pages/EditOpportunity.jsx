import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import OpportunityForm from "../components/OpportunityForm";
import { fetchOpportunityById, updateOpportunity } from "../api/opportunities.api";

export default function EditOpportunity() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const op = await fetchOpportunityById(id);
      setInitialData(op);
    }
    load();
  }, [id]);


  const handleSave = async (updated) => {
    setSaving(true);
    await updateOpportunity(id, updated);
    navigate("/opportunities");
  };


  if (!initialData)
    return (
      <div className="text-center p-10 text-red-600 pt-20">
        Opportunity not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#dff7ea] dark:bg-zinc-900 p-6 pt-20 transition-colors">
      <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8 border border-green-400/20 dark:border-green-300/10 transition-colors">

        <Link
          to="/opportunities"
          className="text-green-700 dark:text-white hover:underline cursor-pointer"
        >
          ← Back to Opportunities
        </Link>

        <h1 className="text-3xl font-semibold text-green-700 dark:text-green-200 mt-4 mb-6">
          Edit Opportunity
        </h1>

        <OpportunityForm
          initialValues={initialData}
          submitting={saving}
          onSubmit={handleSave}
        />
      </div>
    </div>
  );
}
