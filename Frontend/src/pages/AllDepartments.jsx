import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import SmartDepartmentContainer from "../components/SmartDepartmentContainer";

import { useDepartmentState } from "../state/useDepartmentState";
import { useDepartment } from "../hooks/useDepartment";
import { useDepartmentActions } from "../hooks/useDepartmentActions";

import { useAuth } from "../context/AuthContext";

const AllDepartments = () => {

  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [role, setRole] = useState(""); // 🔥 IMPORTANT

  const departmentState = useDepartmentState();
  const { fetchDepartments } = useDepartment(departmentState);

  const actions = useDepartmentActions(
    departmentState,
    fetchDepartments
  );

  useEffect(() => {
    if (workspaceId) {
      fetchDepartments(workspaceId);
    }
  }, [workspaceId]);

  // 🔥 TEMP FIX (jab tak backend role nahi bhej raha)
  useEffect(() => {
    // 👇 yaha tu manually test kar sakta hai
    setRole("admin"); // 🔥 CHANGE THIS to "member" to test
  }, []);

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
        role={role} // 🔥 PASSING ROLE
        onJoin={(id) => actions.join(workspaceId, id)}
        onLeave={(id) => actions.leave(workspaceId, id)}
        onAssignManager={(deptId, userId) =>
          actions.setManager(workspaceId, deptId, userId)
        }
        onOpenDepartment={handleOpenDepartment}
      />

    </div>
  );
};

export default AllDepartments;