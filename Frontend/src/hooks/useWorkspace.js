import { useEffect } from "react";
import { getUserWorkspace } from "../api/workspace.api";

export const useWorkspace = (state) => {

  const { setWorkspaces, setLoading, setError } = state;

  const fetchWorkspaces = async () => {
    try {

      setLoading(true);

      const data = await getUserWorkspace();

      setWorkspaces(data.workspaces);

    } catch (err) {

      setError(err.response?.data?.message || "Failed to fetch workspaces");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  return { fetchWorkspaces };
};