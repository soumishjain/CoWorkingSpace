import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import WorkspaceDashboard from "../components/WorkspaceDashboard";
import DepartmentContainer from "../components/DepartmentContainer";

import { useDepartmentState } from "../state/useDepartmentState";
import { useDepartment } from "../hooks/useDepartment";

import { useWorkspaceStatsState } from "../state/useWorkspaceStatsState";
import { useWorkspaceStats } from "../hooks/useWorkspaceStats";

import { useWorkspaceContext } from "../context/WorkspaceContext";

import { useCreateDepartmentState } from "../state/useCreateDepartmentState";
import { useCreateDepartment } from "../hooks/useCreateDepartment";

import Loader from "../components/Loader";

const Workspace = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const departmentState = useDepartmentState();
  const { fetchDepartments } = useDepartment(departmentState);

  const statsState = useWorkspaceStatsState();
  const { fetchWorkspaceStats } = useWorkspaceStats(statsState);

  const { setWorkspace, setIsAdmin } = useWorkspaceContext();

  const createDeptState = useCreateDepartmentState();

  const { handleCreateDepartment } = useCreateDepartment(
    createDeptState,
    workspaceId,
    () => fetchDepartments(workspaceId)
  );

  useEffect(() => {
    if (workspaceId) {
      fetchDepartments(workspaceId);
      fetchWorkspaceStats(workspaceId);
    }
  }, [workspaceId]);

  useEffect(() => {
    if (statsState.workspace) {
      setWorkspace(statsState.workspace);
      setIsAdmin(statsState.isAdmin);
    }
  }, [statsState]);

  const handleOpenDepartment = (deptId) => {
    navigate(`/dashboard/workspace/${workspaceId}/department/${deptId}`);
  };

  if (statsState.loading) return <Loader />;

  return (
    <div className="p-6 space-y-6">

      <WorkspaceDashboard workspace={statsState.workspace} />

      <DepartmentContainer
        departments={departmentState.departments}
        loading={departmentState.loading}
        error={departmentState.error}
        onCreateDepartment={handleCreateDepartment}
        createDeptState={createDeptState}
        role={statsState.isAdmin ? "admin" : "member"}
      />

    </div>
  );
};

export default Workspace;