import axios from "./axios";

// 🔔 1. NORMAL NOTIFICATIONS
export const getNotifications = async () => {
  try {
    const res = await axios.get("/notifications/", {
      withCredentials: true,
    });

    return res.data; // { notification: [...] }

  } catch (err) {
    throw err.response?.data?.message || "Failed to fetch notifications";
  }
};


// 🔥 2. ALL REQUESTS (WORKSPACE + DEPARTMENT) ✅
export const getAllRequests = async () => {
  try {
    const res = await axios.get(
      `/notifications/requests`, // ✅ NO workspaceId
      { withCredentials: true }
    );

    console.log("REQ DATA:", res.data);

    return res.data; // { requests: [...] }

  } catch (err) {
    throw err.response?.data?.message || "Failed to fetch requests";
  }
};


// 🔥 3. UNIFIED FUNCTION (FINAL)
export const getAllNotificationsUnified = async (workspaceId) => {
  try {

    const [notifRes, reqRes] = await Promise.all([
      getNotifications(),
      getAllRequests(workspaceId),
    ]);

    const notifications = notifRes.notification || [];
    const requests = reqRes.requests || [];

    // 🔥 MERGE ALL
    const merged = [

      // 🔔 NORMAL NOTIFICATIONS
      ...notifications.map((n) => ({
        ...n,
        type: "NOTIFICATION",
        isRequest: false,
      })),

      // 📩 ALL REQUESTS (workspace + department handled by backend)
      ...requests.map((r) => ({
        ...r,
        type: "REQUEST",
        isRequest: true,
      })),
    ];

    // 🔥 SORT (latest first)
    merged.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return {
      data: merged,
      role: reqRes.role || "",
    };

  } catch (err) {
    throw err.response?.data?.message || "Failed to fetch unified notifications";
  }
};