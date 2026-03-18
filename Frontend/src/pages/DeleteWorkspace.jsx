import React, { useEffect } from "react";
import DeleteCardContainer from "../components/DeleteCardContainer";

import { useWorkspaceState } from "../state/useWorkspaceState";
import { useWorkspace } from "../hooks/useWorkspace";

import { useDeleteWorkspaceState } from "../state/useDeleteWorkspaceState";
import { useDeleteWorkspace } from "../hooks/useDeleteWorkspace";

const DeleteWorkspace = () => {

  const workspaceState = useWorkspaceState();
  const { fetchWorkspaces } = useWorkspace(workspaceState);

  const deleteState = useDeleteWorkspaceState();
  const { handleDeleteWorkspace } = useDeleteWorkspace(deleteState);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  return (
    <div className="p-6">
      <DeleteCardContainer
  workspaces={workspaceState.workspaces}
  loading={workspaceState.loading}
  error={workspaceState.error}
  onDelete={handleDeleteWorkspace}
/>
    </div>
  );
};

export default DeleteWorkspace;