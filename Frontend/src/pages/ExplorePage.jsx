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
  } = state;

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  const isSearching = query.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 px-6 py-8">

      {/* 🔥 HEADER */}
      <div className="mb-10 flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Explore Workspaces
        </h1>
        <p className="text-sm text-gray-500">
          Discover communities and collaborate with others
        </p>
      </div>

      {/* 🔍 SEARCH */}
      <SearchBar query={query} setQuery={setQuery} />

      {/* 🔥 CONTENT */}
      <div className="mt-10">

        {/* LOADING */}
        {(loading || searchLoading) && (
          <p className="text-gray-400 text-sm">Loading...</p>
        )}

        {/* 🔎 SEARCH MODE */}
        {isSearching ? (
          <>
            <h2 className="text-sm text-gray-500 mb-5">
              Results for "{query}"
            </h2>

            {searchResults.length === 0 ? (
              <div className="text-center text-gray-400 mt-20">
                <p className="text-lg">No results found</p>
                <p className="text-sm mt-1">
                  Try searching something else
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((ws) => (
                  <ExplorePageCard key={ws._id} workspace={ws} />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* 🔥 EXPLORE */}
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-sm font-medium text-gray-500">
                Trending Workspaces
              </h2>

              <span className="text-xs text-indigo-500 cursor-pointer hover:underline">
                Refresh
              </span>
            </div>

            {workspaces.length === 0 ? (
              <div className="text-center text-gray-400 mt-20">
                <p className="text-lg">No workspaces available</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {workspaces.map((ws) => (
                  <ExplorePageCard key={ws._id} workspace={ws} />
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