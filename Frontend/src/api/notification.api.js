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


// 🔥 2. ALL REQUESTS (WORKSPACE + DEPARTMENT)
export const getAllRequests = async () => {
  try {
    const res = await axios.get(
      `/notifications/requests`,
      { withCredentials: true }
    );

    console.log("REQ DATA:", res.data);

    return res.data; // { requests: [...] }

  } catch (err) {
    throw err.response?.data?.message || "Failed to fetch requests";
  }
};


// 🔥 3. 🔔 UNREAD COUNT (NEW FUNCTION)
export const getUnreadNotificationCount = async () => {
  try {
    const res = await axios.get(
      "/notifications/unread-count",
      { withCredentials: true }
    );

    return res.data; // { count: number }

  } catch (err) {
    throw err.response?.data?.message || "Failed to fetch unread count";
  }
};


// 🔥 4. UNIFIED FUNCTION
export const getAllNotificationsUnified = async () => {
  try {

    const [notifRes, reqRes] = await Promise.all([
      getNotifications(),
      getAllRequests(),
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

      // 📩 REQUESTS
      ...requests.map((r) => ({
        ...r,
        type: "REQUEST",
        isRequest: true,
      })),
    ];

    // 🔥 SORT
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