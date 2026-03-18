import { getWorkspaceStats } from "../api/workspace.api";

export const useWorkspaceStats = (state) => {

  const { setLoading, setError, setWorkspace, setIsAdmin } = state;

  const fetchWorkspaceStats = async (workspaceId) => {
    try {
      setLoading(true);
      setError(null);

      const data = await getWorkspaceStats(workspaceId);

      // 🔥 IMPORTANT
      setWorkspace({
        ...data.workspace,
        totalMembers: data.totalMembers,
        totalDepartments: data.totalDepartments,
      });

      // 🔥 THIS WAS MISSING / WRONG
      setIsAdmin(data.isAdmin);

    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { fetchWorkspaceStats };
};