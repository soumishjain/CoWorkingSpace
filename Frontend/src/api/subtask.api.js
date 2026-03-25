import axios from "./axios";

// ✅ GET SUBTASKS OF TASK
export const getSubtasksAPI = async (taskId) => {
  try {
    const res = await axios.get(`/subtask/tasks/${taskId}/subtask`);
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || "Fetch Failed",
    };
  }
};

// ✅ CLAIM SUBTASK
export const claimSubtaskAPI = async (subtaskId) => {
  try {
    const res = await axios.post(
      `/subtask/claim-subtask/${subtaskId}`
    );
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || "Claim Failed",
    };
  }
};

// ✅ COMPLETE SUBTASK
export const completeSubtaskAPI = async (subtaskId) => {
  try {
    const res = await axios.post(
      `/subtask/complete-subtask/${subtaskId}`
    );
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || "Complete Failed",
    };
  }
};

// ✅ MY PENDING SUBTASKS
export const getMyPendingSubtasksAPI = async () => {
  try {
    const res = await axios.get(
      `/subtask/my-pending-subtask`
    );
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || "Fetch Failed",
    };
  }
};