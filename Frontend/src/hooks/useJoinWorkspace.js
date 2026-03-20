import {
  searchWorkspaces,
  joinWorkspace,
} from "../api/workspace.api";

import toast from "react-hot-toast";

export const useJoinWorkspace = (state, refreshWorkspaces) => {

  const {
    setResults,
    setLoading,
    setError,
  } = state;

  // 🔥 SEARCH
  const search = async (query) => {
    try {
      setLoading(true);
      setError("");

      const data = await searchWorkspaces(query);

      setResults(data?.workspaces || []);

    } catch (err) {
      const message =
        typeof err === "string"
          ? err
          : err?.response?.data?.message || "Search failed";

      setError(message);
      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  // 🔥 JOIN WORKSPACE
  const join = async (workspaceId, password) => {
  try {
    setLoading(true);
    setError("");

    await joinWorkspace(workspaceId, password);

    setResults(prev =>
      prev.map(ws =>
        ws._id === workspaceId
          ? { ...ws, status: "requested" }
          : ws
      )
    );

    toast.success("Request sent 🚀");

    await refreshWorkspaces();

  } catch (err) {
    const message =
      typeof err === "string"
        ? err
        : err?.response?.data?.message || "Join failed";

    setError(message);
    toast.error(message);

  } finally {
    setLoading(false);
  }
};
  return {
    search,
    join,
  };
};