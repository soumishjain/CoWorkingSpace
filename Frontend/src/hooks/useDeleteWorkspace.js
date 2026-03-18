import { deleteWorkspace } from "../api/workspace.api";

export const useDeleteWorkspace = (deleteState) => {

  const { setLoading, setError } = deleteState;

  const handleDeleteWorkspace = async (workspaceId) => {
    try {
      setLoading(true);
      setError(null);

      await deleteWorkspace(workspaceId);

      // 🔥 simple solution
      window.location.reload();

    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { handleDeleteWorkspace };
};