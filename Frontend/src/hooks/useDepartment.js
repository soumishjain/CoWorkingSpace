import {
  getAllDepartments,
  createDepartment,
  joinDepartment,
  leaveDepartment,
  deleteDepartment,
  assignManager,
  getMyDepartments
} from "../api/department.api";

export const useDepartment = (state) => {

  const {
    setDepartments,
    setLoading,
    setError,
    setRole, // 🔥 IMPORTANT (ADD IN STATE)
  } = state;

  // 🔥 FETCH ALL
  const fetchDepartments = async (workspaceId) => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllDepartments(workspaceId);

      setDepartments(data?.departments || []);
      setRole(data?.currentUserRole || "member"); // 🔥 ADD THIS

    } catch (err) {
      setError(err || "Failed to fetch departments");
    } finally {
      setLoading(false);
    }
  };

    const fetchMyDepartments = async (workspaceId) => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyDepartments(workspaceId);

      setDepartments(data?.departments || []);
      setRole(data?.currentUserRole || "member"); // 🔥 ADD THIS

    } catch (err) {
      setError(err || "Failed to fetch departments");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 CREATE
  const handleCreateDepartment = async (workspaceId, payload) => {
    try {
      setLoading(true);
      setError("");

      await createDepartment(workspaceId, payload);
      await fetchDepartments(workspaceId);

    } catch (err) {
      setError(err || "Failed to create department");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 JOIN
  const handleJoinDepartment = async (workspaceId, departmentId) => {
    try {
      setLoading(true);
      setError("");

      await joinDepartment(workspaceId, departmentId);
      await fetchDepartments(workspaceId);

    } catch (err) {
      setError(err || "Failed to join department");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 LEAVE
  const handleLeaveDepartment = async (workspaceId, departmentId) => {
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

  // 🔥 ASSIGN / CHANGE MANAGER
  const handleAssignManager = async (
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
      setError(err || "Failed to assign manager");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 DELETE
  const handleDeleteDepartment = async (workspaceId, departmentId) => {
    try {
      setLoading(true);
      setError("");

      await deleteDepartment(workspaceId, departmentId);
      await fetchDepartments(workspaceId);

    } catch (err) {
      setError(err || "Failed to delete department");
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchDepartments,
    handleCreateDepartment,
    handleJoinDepartment,
    handleLeaveDepartment,
    handleAssignManager,
    handleDeleteDepartment,
    fetchMyDepartments
  };
};