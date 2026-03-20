import axios from "./axios";

// 🔥 1. Get ALL departments of a workspace (main API)
export const getAllDepartments = async (workspaceId) => {
  try {
    const res = await axios.get(
      `/department/get-departments-of-this-workspace/${workspaceId}`,
      { withCredentials: true }
    );

    return res.data;

  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch departments";
  }
};

// 🔥 2. Create Department
export const createDepartment = async (workspaceId, data) => {
  try {
    const res = await axios.post(
      `/department/create/${workspaceId}`,
      data,
      { withCredentials: true }
    );

    return res.data;

  } catch (error) {
    throw error.response?.data?.message || "Failed to create department";
  }
};

// 🔥 3. Join Department (for users)
export const joinDepartment = async (workspaceId, departmentId) => {
  try {
    const res = await axios.post(
      `/department/join-department/${workspaceId}/${departmentId}`,
      {},
      { withCredentials: true }
    );

    return res.data;

  } catch (error) {
    throw error.response?.data?.message || "Failed to join department";
  }
};

// 🔥 4. Delete Department (admin only)
export const deleteDepartment = async (workspaceId, departmentId) => {
  try {
    const res = await axios.delete(
      `/department/delete-department/${workspaceId}/${departmentId}`,
      { withCredentials: true }
    );

    return res.data;

  } catch (error) {
    throw error.response?.data?.message || "Failed to delete department";
  }
};

export const getWorkspaceStats = async (workspaceId) => {
  try {
    const res = await axios.get(
      `/workspace/stats/${workspaceId}`,
      { withCredentials: true }
    );

    return res.data;

  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch workspace stats";
  }
};


// 🔥 LEAVE DEPARTMENT
export const leaveDepartment = async (workspaceId, departmentId) => {
  try {
    const res = await axios.post(
      `/department/leave/${workspaceId}/${departmentId}`,
      {},
      { withCredentials: true }
    );

    return res.data;

  } catch (error) {
    throw error.response?.data?.message || "Failed to leave department";
  }
};

// 🔥 ASSIGN MANAGER
export const assignManager = async (
  workspaceId,
  departmentId,
  assignedUserId
) => {
  try {
    const res = await axios.patch(
      `/department/assign-manager/${departmentId}/${workspaceId}/${assignedUserId}`,
      {},
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to assign manager";
  }
};