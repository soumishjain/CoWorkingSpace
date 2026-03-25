import axios from "./axios";

// ✅ CREATE TASK (manager)
export const createTaskAPI = async ({
  workspaceId,
  departmentId,
  data,
}) => {
  try {
    const res = await axios.post(
      `/task/create-task/${workspaceId}/${departmentId}`,
      data
    );

    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || "Create Task Failed",
    };
  }
};

// ✅ GET ALL TASKS
export const getAllTasksAPI = async ({
  workspaceId,
  departmentId,
}) => {
  try {
    const res = await axios.get(
      `/task/all-tasks/${workspaceId}/${departmentId}`
    );

    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || "Fetch Failed",
    };
  }
};

// ✅ GET SINGLE TASK
export const getSingleTaskAPI = async (taskId) => {
  try {
    const res = await axios.get(`/task/task/${taskId}`);
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || "Fetch Failed",
    };
  }
};

// ✅ DELETE TASK
export const deleteTaskAPI = async (taskId) => {
  try {
    const res = await axios.delete(`/task/delete-task/${taskId}`);
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || "Delete Failed",
    };
  }
};

// ✅ APPROVE TASK
export const approveTaskAPI = async (taskId) => {
  try {
    const res = await axios.patch(`/task/approve-task/${taskId}`);
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || "Approve Failed",
    };
  }
};

// ✅ REJECT TASK
export const rejectTaskAPI = async ({ taskId, feedback }) => {
  try {
    const res = await axios.patch(
      `/task/reject-task/${taskId}`,
      { feedback }
    );
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || "Reject Failed",
    };
  }
};