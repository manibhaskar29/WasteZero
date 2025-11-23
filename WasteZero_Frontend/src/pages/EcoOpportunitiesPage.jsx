import React, { useEffect, useState } from "react";
import EcoOpportunityCard from "../components/EcoOpportunityCard";
import EcoOpportunityDetail from "../components/EcoOpportunityDetail";
import { fetchOpportunities } from "../api/opportunities.api";
export default function EcoOpportunitiesPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
  async function load() {
    const data = await fetchOpportunities();
    setItems(data);
    
  }
  load();
}, []);

  const filtered = items.filter((i) =>
    i.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 w-full min-h-screen bg-green-100 dark:bg-zinc-800 pt-20">

      <h1 className="text-3xl font-bold text-green-800 dark:text-green-300 mb-6">
        Eco Opportunities
      </h1>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search opportunities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm border px-3 py-2 rounded-lg"
        />
      </div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <EcoOpportunityCard key={item._id} item={item} onClick={setSelected} />
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <EcoOpportunityDetail item={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
