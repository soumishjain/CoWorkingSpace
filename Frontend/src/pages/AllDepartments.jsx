import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import WorkspaceDashboard from "../components/WorkspaceDashboard";
import DepartmentContainer from "../components/DepartmentContainer";

import { useDepartmentState } from "../state/useDepartmentState";
import { useDepartment } from "../hooks/useDepartment";

import { useWorkspaceStatsState } from "../state/useWorkspaceStatsState";
import { useWorkspaceStats } from "../hooks/useWorkspaceStats";

const AllDepartments = () => {

  const { workspaceId } = useParams();
  const navigate = useNavigate();

  // 🔥 Department state + hook
  const departmentState = useDepartmentState();
  const { fetchDepartments } = useDepartment(departmentState);

  // 🔥 Workspace stats state + hook
  const statsState = useWorkspaceStatsState();
  const { fetchWorkspaceStats } = useWorkspaceStats(statsState);

  // 🔥 Fetch data
  useEffect(() => {
    if (workspaceId) {
      fetchDepartments(workspaceId);
      fetchWorkspaceStats(workspaceId);
    }
  }, [workspaceId]);

  // 🔥 Handlers

  // open department page
  const handleOpenDepartment = (deptId) => {
    navigate(`/dashboard/workspace/${workspaceId}/department/${deptId}`);
  };

  // create department (abhi console, baad me modal laga)
  const handleCreateDepartment = () => {
    console.log("Create Department clicked");
  };

  // add member (future)
  const handleAddMember = () => {
    console.log("Add Member clicked");
  };

  return (
    <div className="p-6 space-y-6">

      {/* 🔥 Top Workspace Banner */}
      <WorkspaceDashboard workspace={statsState.workspace} />

      {/* 🔥 Departments */}
      <DepartmentContainer
        departments={departmentState.departments}
        loading={departmentState.loading}
        error={departmentState.error}
        onOpenDepartment={handleOpenDepartment}
        onCreateDepartment={handleCreateDepartment}
        onAddMember={handleAddMember}
      />

    </div>
  );
};

export default AllDepartments;