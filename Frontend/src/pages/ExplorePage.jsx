import { useEffect } from "react";
import { useExploreState } from "../state/useExploreState";
import { useExplore } from "../hooks/useExplore";

import ExplorePageCard from "../components/ExplorePageCard";
import SearchBar from "../components/SearchBar";

const ExplorePage = () => {
  const state = useExploreState();
  const { fetchWorkspaces } = useExplore(state);

  const {
    workspaces,
    searchResults,
    loading,
    searchLoading,
    query,
    setQuery,
    setWorkspaces,
    setSearchResults,
  } = state;

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  const isSearching = query.trim().length > 0;

  return (
    <div className="min-h-screen 
                    bg-[var(--bg-main)] 
                    text-[var(--text-primary)] 
                    px-6 py-8">

      {/* 🔥 HEADER */}
      <div className="mb-10 flex flex-col gap-2">

        <h1 className="text-3xl font-semibold tracking-tight">
          Explore Workspaces
        </h1>

        <p className="text-sm text-[var(--text-secondary)]">
          Discover communities and collaborate with others
        </p>

      </div>

      {/* 🔍 SEARCH */}
      <SearchBar query={query} setQuery={setQuery} />

      {/* 🔥 CONTENT */}
      <div className="mt-10">

        {/* LOADING */}
        {(loading || searchLoading) && (
          <p className="text-[var(--text-secondary)] text-sm">
            Loading...
          </p>
        )}

        {/* 🔎 SEARCH MODE */}
        {isSearching ? (
          <>
            <h2 className="text-sm text-[var(--text-secondary)] mb-5">
              Results for "<span className="text-[var(--accent)]">{query}</span>"
            </h2>

            {searchResults.length === 0 ? (
              <div className="text-center mt-20">

                <p className="text-lg text-[var(--text-primary)]">
                  No results found
                </p>

                <p className="text-sm mt-1 text-[var(--text-secondary)]">
                  Try searching something else
                </p>

              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((ws) => (
                  <ExplorePageCard
                    key={ws._id}
                    workspace={ws}
                    setWorkspaces={setWorkspaces}
                    setSearchResults={setSearchResults}
                    isSearching={true}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* 🔥 EXPLORE HEADER */}
            <div className="flex justify-between items-center mb-5">

              <h2 className="text-sm font-medium text-[var(--text-secondary)]">
                Trending Workspaces
              </h2>

              <button
                onClick={fetchWorkspaces}
                className="text-xs text-[var(--accent)] 
                           hover:underline 
                           transition"
              >
                Refresh
              </button>

            </div>

            {workspaces.length === 0 ? (
              <div className="text-center mt-20">

                <p className="text-lg text-[var(--text-primary)]">
                  No workspaces available
                </p>

              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {workspaces.map((ws) => (
                  <ExplorePageCard
                    key={ws._id}
                    workspace={ws}
                    setWorkspaces={setWorkspaces}
                    setSearchResults={setSearchResults}
                    isSearching={false}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;