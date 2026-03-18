import { useState } from "react";

export const useWorkspaceStatsState = () => {

  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAdmin,setIsAdmin] = useState(false)

  return {
    workspace,
    setWorkspace,
    loading,
    setLoading,
    error,
    setError,
    isAdmin,
    setIsAdmin
  };
};