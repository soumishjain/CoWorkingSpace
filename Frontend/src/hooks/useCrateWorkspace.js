import { createWorkspace } from "../api/workspace.api";

export const useCreateWorkspace = (state, closeModal, refreshWorkspaces) => {

  const { formData, setLoading, setError } = state;

  const submitWorkspace = async () => {

    try {

      setLoading(true);

      await createWorkspace(formData);

      refreshWorkspaces();

      closeModal();

    } catch (error) {

      setError(error.response?.data?.message || "Workspace creation failed");

    } finally {

      setLoading(false);

    }
  };

  return { submitWorkspace };
};