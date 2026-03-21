import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import SmartDepartmentContainer from "../components/SmartDepartmentContainer";

import { useDepartmentState } from "../state/useDepartmentState";
import { useDepartment } from "../hooks/useDepartment";
import { useDepartmentActions } from "../hooks/useDepartmentActions";

import { useAuth } from "../context/AuthContext";
import { useWorkspaceStatsState } from "../state/useWorkspaceStatsState";
import { useWorkspaceStats } from "../hooks/useWorkspaceStats";

const AllDepartments = () => {

  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const departmentState = useDepartmentState();
  const { fetchDepartments } = useDepartment(departmentState);

  const actions = useDepartmentActions(
    departmentState,
    fetchDepartments
  );

  const statsState = useWorkspaceStatsState();
  const { fetchWorkspaceStats } = useWorkspaceStats(statsState);

  useEffect(() => {
    if (workspaceId) {
      fetchDepartments(workspaceId);
      fetchWorkspaceStats(workspaceId);
    }
  }, [workspaceId]);

  const handleOpenDepartment = (deptId) => {
    navigate(`/dashboard/workspace/${workspaceId}/department/${deptId}`);
  };

  if (!user) return null;

  return (
    <div className="p-6">

      <h1 className="text-2xl font-semibold mb-6">
        Departments
      </h1>

      <SmartDepartmentContainer
        departments={departmentState.departments}
        loading={departmentState.loading}
        error={departmentState.error}
        user={user}
        isAdmin={statsState.isAdmin}
        onJoin={(id) => actions.join(workspaceId, id)}
        onLeave={(id) => actions.leave(workspaceId, id)}
        onAssignManager={(deptId, userId) =>
          actions.setManager(workspaceId, deptId, userId)
        }
        onOpenDepartment={handleOpenDepartment}
        workspaceId={workspaceId}
      />

    </div>
  );
};

export default AllDepartments;