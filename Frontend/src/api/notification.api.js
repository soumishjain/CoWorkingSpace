import axios from "./axios";

export const getNotifications = async () => {
  try {
    const res = await axios.get("/notifications/", {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    throw err.response?.data?.message || "Failed to fetch notifications";
  }
};

export const getJoinRequests = async (workspaceId) => {
  try {
    const res = await axios.get(
      `/workspace/get-all-requests/${workspaceId}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data?.message || "Failed to fetch requests";
  }
};
