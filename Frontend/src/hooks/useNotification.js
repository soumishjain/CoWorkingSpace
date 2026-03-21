import {
  getNotifications,
  getAllRequests, // 🔥 NEW
} from "../api/notification.api";

import {
  approveRequest,
  rejectRequest,
} from "../api/workspace.api";

import {
  approveDepartmentRequest,
  rejectDepartmentRequest,
} from "../api/department.api";

export const useNotification = (state) => {
  const {
    setNotifications,
    setRole,
    setLoading,
    setError,
  } = state;

  /**
   * 🔥 FORMAT HELPERS
   */

  const formatNotifications = (notifications = []) => {
    return notifications.map((n) => ({
      ...n,
      type: "NOTIFICATION",
    }));
  };

  const formatRequests = (requests = []) => {
    return requests.map((r) => ({
      ...r,
      type: "REQUEST", // 🔥 unified
      user: r.userId,
    }));
  };

  /**
   * 🔥 MERGE + SORT
   */
  const mergeAndSort = (notifications, requests) => {
    const merged = [
      ...formatNotifications(notifications),
      ...formatRequests(requests),
    ];

    return merged.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  };

  /**
   * 🔥 MAIN FETCH (UNIFIED)
   */
  const fetchAllNotifications = async (workspaceId) => {
    try {
      console.log("🔥 FETCH CALLED", workspaceId);
      setLoading(true);
      setError("");

      const [notifRes, reqRes] = await Promise.all([
        getNotifications(),
        getAllRequests(workspaceId), // 🔥 ONE API
      ]);

      console.log("NOTIF: ",notifRes)
      console.log("REQ: ",reqRes)

      const notifications = notifRes.notification || [];
      const requests = reqRes.requests || [];

      const merged = mergeAndSort(notifications, requests);

      setNotifications(merged);
      setRole(reqRes.role || "");

    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : err?.message || "Failed to fetch notifications"
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * 🔥 USER ONLY
   */
  const fetchUserNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const notifRes = await getNotifications();
      const notifications = notifRes.notification || [];

      setNotifications(formatNotifications(notifications));

    } catch (err) {
      setError(err?.message || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  /**
   * ✅ APPROVE (SMART)
   */
  const handleApprove = async (item) => {
    try {
      if (item.type === "REQUEST") {
        // 🔥 workspace vs department
        if (item.departmentId) {
          await approveDepartmentRequest(
            item.workspaceId,
            item.departmentId,
            item._id
          );
        } else {
          await approveRequest(item._id);
        }
      }

      setNotifications((prev) =>
        prev.filter((n) => n._id !== item._id)
      );

    } catch (err) {
      setError(err?.message || "Failed to approve");
    }
  };

  /**
   * ❌ REJECT (SMART)
   */
  const handleReject = async (item) => {
    try {
      if (item.type === "REQUEST") {
        if (item.departmentId) {
          await rejectDepartmentRequest(
            item.workspaceId,
            item.departmentId,
            item._id
          );
        } else {
          await rejectRequest(item._id);
        }
      }

      setNotifications((prev) =>
        prev.filter((n) => n._id !== item._id)
      );

    } catch (err) {
      setError(err?.message || "Failed to reject");
    }
  };

  return {
    fetchAllNotifications,
    fetchUserNotifications,
    handleApprove,
    handleReject,
  };
};