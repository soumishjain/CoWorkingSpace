import { searchWorkspaceMembers, removeMember } from "../api/workspace.api";

export const useRemoveMember = (state, workspaceId) => {
  const { query, setUsers, setLoading } = state;

  const handleSearch = async () => {
    try {
      setLoading(true);

      const res = await searchWorkspaceMembers(workspaceId, query);

      setUsers(res.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userId) => {
    try {
      await removeMember(workspaceId, userId);

      // 🔥 UI update
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  return {
    handleSearch,
    handleRemove,
  };
};