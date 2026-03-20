import { useState } from "react";

export const useJoinWorkspaceState = () => {

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return {
    results,
    setResults,
    loading,
    setLoading,
    error,
    setError,
  };
};