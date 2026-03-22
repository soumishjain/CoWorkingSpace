import axios from "./axios";

export const fetchActivities = async (workspaceId, departmentId, page) => {
  let url = `/activity/${workspaceId}?page=${page}&limit=20`;

  // 🔥 agar departmentId hai to department activity
  if (departmentId) {
    url = `/activity/${workspaceId}/${departmentId}?page=${page}&limit=20`;
  }

  const res = await axios.get(url);

  console.log("ACTIVITY:", res.data);

  return res.data;
};