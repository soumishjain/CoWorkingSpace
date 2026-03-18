import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import DeleteDepartmentContainer from "../components/DeleteDepartmentContainer";

import { useDepartmentState } from "../state/useDepartmentState";
import { useDepartment } from "../hooks/useDepartment";

const DeleteDepartment = () => {

  const { workspaceId } = useParams();

  const departmentState = useDepartmentState();
  const { fetchDepartments, handleDeleteDepartment } =
    useDepartment(departmentState);

  useEffect(() => {
    if (workspaceId) {
      fetchDepartments(workspaceId);
    }
  }, [workspaceId]);

  return (
    <div className="p-6">
      <DeleteDepartmentContainer
        departments={departmentState.departments}
        loading={departmentState.loading}
        error={departmentState.error}
        onDelete={(deptId) =>
          handleDeleteDepartment(workspaceId, deptId)
        }
      />
    </div>
  );
};

export default DeleteDepartment;