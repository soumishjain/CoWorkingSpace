import {
  joinDepartment,
  leaveDepartment,
  assignManager,
} from "../api/department.api";

export const useDepartmentActions = (state, fetchDepartments) => {

  const { setLoading, setError } = state;

  // 🔥 JOIN
  const join = async (workspaceId, departmentId) => {
    try {
      setLoading(true);
      setError("");

      await joinDepartment(workspaceId, departmentId);

      // refresh
      await fetchDepartments(workspaceId);

    } catch (err) {
      setError(err || "Failed to join department");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 LEAVE
  const leave = async (workspaceId, departmentId) => {
    try {
      setLoading(true);
      setError("");

      await leaveDepartment(workspaceId, departmentId);

      await fetchDepartments(workspaceId);

    } catch (err) {
      setError(err || "Failed to leave department");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 ASSIGN / CHANGE MANAGER (same API)
  const setManager = async (
    workspaceId,
    departmentId,
    assignedUserId
  ) => {
    try {
      setLoading(true);
      setError("");

      await assignManager(workspaceId, departmentId, assignedUserId);

      await fetchDepartments(workspaceId);

    } catch (err) {
      setError(err || "Failed to update manager");
    } finally {
      setLoading(false);
    }
  };

  return {
    join,
    leave,
    setManager,
  };
};