import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import WorkspaceDashboard from "../components/WorkspaceDashboard";
import DepartmentContainer from "../components/DepartmentContainer";

import { useDepartmentState } from "../state/useDepartmentState";
import { useDepartment } from "../hooks/useDepartment";

import { useWorkspaceStatsState } from "../state/useWorkspaceStatsState";
import { useWorkspaceStats } from "../hooks/useWorkspaceStats";

import { useWorkspaceContext } from "../context/WorkspaceContext";

// 🔥 REQUIRED IMPORTS (missing the before)
import { useCreateDepartmentState } from "../state/useCreateDepartmentState";
import { useCreateDepartment } from "../hooks/useCreateDepartment";
import Loader from "../components/Loader";

const Workspace = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  // 🔹 departments
  const departmentState = useDepartmentState();
  const { fetchDepartments } = useDepartment(departmentState);

  // 🔹 stats
  const statsState = useWorkspaceStatsState();
  const { fetchWorkspaceStats } = useWorkspaceStats(statsState);

  // 🔹 context
  const { setWorkspace, setIsAdmin } = useWorkspaceContext();

  // 🔥 CREATE DEPARTMENT STATE
  const createDeptState = useCreateDepartmentState();

  // 🔥 CREATE HOOK
  const { handleCreateDepartment } = useCreateDepartment(
    createDeptState,
    workspaceId,
    () => fetchDepartments(workspaceId)
  );

  // 🔹 fetch data
  useEffect(() => {
    if (workspaceId) {
      fetchDepartments(workspaceId);
      fetchWorkspaceStats(workspaceId);
    }
  }, [workspaceId]);

  // 🔹 update context
  useEffect(() => {
    if (statsState.workspace) {
      setWorkspace(statsState.workspace);
      setIsAdmin(statsState.isAdmin);
    }
  }, [statsState]);

  // 🔹 open department
  const handleOpenDepartment = (deptId) => {
    navigate(`/dashboard/workspace/${workspaceId}/department/${deptId}`);
  };

  if(statsState.loading) return <Loader />

  return (
    <div className="p-6 space-y-6">

      <WorkspaceDashboard workspace={statsState.workspace} />

      <DepartmentContainer
        departments={departmentState.departments}
        loading={departmentState.loading}
        error={departmentState.error}
        onOpenDepartment={handleOpenDepartment}
        onCreateDepartment={handleCreateDepartment}
        createDeptState={createDeptState}
        role = {statsState.isAdmin ? 'admin' : 'member'}
      />

    </div>
  );
};

export default Workspace;