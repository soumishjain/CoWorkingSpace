import { Search, X } from "lucide-react";

const SearchBar = ({ query, setQuery }) => {
  return (
    <div className="relative max-w-xl w-full">

      {/* 🔥 INPUT WRAPPER */}
      <div className="flex items-center gap-2 
                      bg-[var(--bg-secondary)]/80 
                      backdrop-blur-xl 
                      border border-[var(--border)] 
                      rounded-2xl px-4 py-3 
                      shadow-sm
                      focus-within:border-[var(--accent)] 
                      focus-within:shadow-[0_0_15px_var(--accent-glow)] 
                      transition-all duration-300">

        {/* 🔍 ICON */}
        <Search size={18} className="text-[var(--text-secondary)]" />

        {/* INPUT */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search workspaces, teams..."
          className="flex-1 bg-transparent outline-none text-sm 
                     text-[var(--text-primary)] 
                     placeholder:text-[var(--text-secondary)]"
        />

        {/* ❌ CLEAR BUTTON */}
        {query && (
          <button
            onClick={() => setQuery("")}
            className="p-1 rounded-full 
                       hover:bg-[var(--bg-hover)] 
                       transition"
          >
            <X size={16} className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition" />
          </button>
        )}

      </div>

      {/* 🔥 SUBTLE ORANGE GLOW */}
      <div className="absolute inset-0 rounded-2xl 
                      bg-[radial-gradient(circle_at_center,rgba(255,106,0,0.15),transparent_70%)] 
                      opacity-0 
                      focus-within:opacity-100 
                      transition duration-500 
                      pointer-events-none" />

    </div>
  );
};

export default SearchBar;