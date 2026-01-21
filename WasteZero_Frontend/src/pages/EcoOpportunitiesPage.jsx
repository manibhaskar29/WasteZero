import React, { useEffect, useState, useMemo } from "react";
import EcoOpportunityCard from "../components/EcoOpportunityCard";
import EcoOpportunityDetail from "../components/EcoOpportunityDetail";
import Filters from "../components/Filters";
import { fetchOpportunities } from "../api/opportunities.api";

export default function EcoOpportunitiesPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const [filters, setFilters] = useState({
    skill: "",
    location: "",
    category: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  // Fetch opportunities
  useEffect(() => {
    async function load() {
      console.time("fetchOpportunities");
      const data = await fetchOpportunities();
      console.timeEnd("fetchOpportunities");
      setItems(data);
    }
    load();
  }, []);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Apply search + filters
  const filtered = useMemo(() => {
    return items.filter((i) => {
      const matchesSearch = i.title.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesSkill = !filters.skill || (i.skills || []).includes(filters.skill);
      const matchesLocation = !filters.location || i.location.toLowerCase().includes(filters.location.toLowerCase());
      const matchesCategory = !filters.category || i.category === filters.category;
      return matchesSearch && matchesSkill && matchesLocation && matchesCategory;
    });
  }, [items, debouncedSearch, filters]);

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="p-8 w-full min-h-screen bg-green-100 dark:bg-zinc-900 pt-20">
      <h1 className="text-3xl font-bold text-green-800 dark:text-green-300 mb-6">
        Match Suggestions
      </h1>

      {/* Search + Filters */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6 items-start">
        {/* <div className="w-full lg:w-1/3">
          <input
            type="text"
            placeholder="Search opportunities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm border px-3 py-2 rounded-lg"
          />
        </div> */}
        <div className="w-full lg:w-2/3">
          <Filters filters={filters} setFilters={setFilters} onSearch={(f) => setFilters(f)} />
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-semibold text-green-700 dark:text-green-300 mb-6">
          Recommended Opportunites
        </h2>
      </div>

      {/* Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedItems.map((item) => (
          <EcoOpportunityCard key={item._id} item={item} onView={setSelected} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-4">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-green-600 dark:bg-green-700 text-white rounded disabled:opacity-50 hover:bg-green-700 dark:hover:bg-green-600"
          >
            Prev
          </button>
          <span className="px-3 py-1 text-gray-800 dark:text-gray-200">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-green-600 dark:bg-green-700 text-white rounded disabled:opacity-50 hover:bg-green-700 dark:hover:bg-green-600"
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      {selected && <EcoOpportunityDetail item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
