import { useCallback, useEffect, useRef } from "react";
import { fetchAllWorkspace, searchWorkspaces } from "../api/workspace.api";

export const useExplore = (state) => {
  const {
    setWorkspaces,
    setSearchResults,
    setLoading,
    setSearchLoading,
    setError,
    query,
  } = state;

  const debounceRef = useRef(null);

  // ================== FETCH WORKSPACES ==================
  const fetchWorkspaces = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetchAllWorkspace();

      console.log("EXPLORE RES:", res);

      const workspaces = res?.workspaces || []; // ✅ clean

      const shuffled = [...workspaces].sort(() => 0.5 - Math.random());

      setWorkspaces(shuffled.slice(0, 20));

    } catch (err) {
      console.error("FETCH WORKSPACE ERROR:", err);
      setError(err?.response?.data?.message || "Failed to fetch workspaces");
    } finally {
      setLoading(false);
    }
  }, [setWorkspaces, setLoading, setError]);

  // ================== SEARCH ==================
  const handleSearch = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        setSearchLoading(true);
        setError("");

        const res = await searchWorkspaces(query);

        console.log("SEARCH RES:", res);

        const results = res?.workspaces || []; // ✅ clean

        setSearchResults(results);

      } catch (err) {
        console.error("SEARCH ERROR:", err);
        setError(err?.response?.data?.message || "Search failed");
      } finally {
        setSearchLoading(false);
      }
    }, 400);
  }, [query, setSearchResults, setSearchLoading, setError]);

  useEffect(() => {
    handleSearch();

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [handleSearch]);

  return {
    fetchWorkspaces,
  };
};