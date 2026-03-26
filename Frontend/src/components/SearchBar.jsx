import { Search, X } from "lucide-react";

const SearchBar = ({ query, setQuery }) => {
  return (
    <div className="relative max-w-xl w-full">

      {/* 🔥 INPUT WRAPPER */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">

        {/* 🔍 ICON */}
        <Search size={18} className="text-gray-400" />

        {/* INPUT */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search workspaces, teams..."
          className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
        />

        {/* ❌ CLEAR BUTTON */}
        {query && (
          <button
            onClick={() => setQuery("")}
            className="p-1 rounded-full hover:bg-gray-100 transition"
          >
            <X size={16} className="text-gray-400" />
          </button>
        )}
      </div>

      {/* 🔥 GLOW EFFECT */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 focus-within:opacity-100 transition pointer-events-none" />

    </div>
  );
};

export default SearchBar;