import { useState } from "react";

export const useExploreState = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const [error, setError] = useState("");

  const [query, setQuery] = useState("");

  return {
    workspaces,
    setWorkspaces,

    searchResults,
    setSearchResults,

    loading,
    setLoading,

    searchLoading,
    setSearchLoading,

    error,
    setError,

    query,
    setQuery,
  };
};