import { createDepartment } from "../api/department.api";

export const useCreateDepartment = (state, workspaceId, refresh) => {

  const { formData, setLoading, setError } = state;

  const handleCreateDepartment = async () => {
    try {
      setLoading(true);
      setError(null);

      await createDepartment(workspaceId, formData);

      refresh(); // 🔥 re-fetch departments

    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { handleCreateDepartment };
};