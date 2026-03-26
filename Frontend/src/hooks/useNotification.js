import {
  getNotifications,
  getAllRequests,
  getUnreadNotificationCount,
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
    setUnreadCount, // 🔥 NEW
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
      type: "REQUEST",
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
   * 🔥 FETCH COUNT
   */
  const fetchUnreadCount = async () => {
    try {
      const res = await getUnreadNotificationCount();
      setUnreadCount(res.count || 0);
    } catch (err) {
      console.error("Count fetch failed", err);
    }
  };

  /**
   * 🔥 MAIN FETCH
   */
  const fetchAllNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const [notifRes, reqRes] = await Promise.all([
        getNotifications(),
        getAllRequests(),
      ]);

      const notifications = notifRes.notification || [];
      const requests = reqRes.requests || [];

      const merged = mergeAndSort(notifications, requests);

      setNotifications(merged);

      // 🔥 ALSO FETCH COUNT
      fetchUnreadCount();

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
   * 🔥 ONLY USER NOTIFICATIONS
   */
  const fetchUserNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const notifRes = await getNotifications();
      const notifications = notifRes.notification || [];

      setNotifications(formatNotifications(notifications));

      fetchUnreadCount();

    } catch (err) {
      setError(err?.message || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  /**
   * ✅ APPROVE
   */
  const handleApprove = async (item) => {
    try {
      if (item.type === "REQUEST") {
        if (item.departmentId) {
          await approveDepartmentRequest(
            item.workspaceId?._id || item.workspaceId,
            item.departmentId?._id || item.departmentId,
            item._id
          );
        } else {
          await approveRequest(item._id);
        }
      }

      // 🔥 REMOVE FROM UI
      setNotifications((prev) =>
        prev.filter((n) => n._id !== item._id)
      );

      // 🔥 UPDATE COUNT (reduce)
      setUnreadCount((prev) => Math.max(prev - 1, 0));

    } catch (err) {
      setError(err?.message || "Failed to approve");
    }
  };

  /**
   * ❌ REJECT
   */
  const handleReject = async (item) => {
    try {
      if (item.type === "REQUEST") {
        if (item.departmentId) {
          await rejectDepartmentRequest(
            item.workspaceId?._id || item.workspaceId,
            item.departmentId?._id || item.departmentId,
            item._id
          );
        } else {
          await rejectRequest(item._id);
        }

        setNotifications((prev) =>
          prev.filter((n) => n._id !== item._id)
        );

        // 🔥 UPDATE COUNT
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      }

    } catch (err) {
      setError(err?.message || "Failed to reject");
    }
  };

  return {
    fetchAllNotifications,
    fetchUserNotifications,
    handleApprove,
    handleReject,
    fetchUnreadCount, // 🔥 expose for manual use
  };
};