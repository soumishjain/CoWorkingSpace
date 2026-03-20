import {
  getNotifications,
  getJoinRequests,
} from "../api/notification.api";

import {
  approveRequest,
  rejectRequest
} from "../api/workspace.api"; // 🔥 IMPORTANT (tera case)

export const useNotification = (state) => {

  const {
    setNotifications,
    setRequests,
    setRole,
    setLoading,
    setError,
  } = state;

  // 🔥 FETCH ALL (USER + WORKSPACE)
  const fetchWorkspaceNotifications = async (workspaceId) => {
    try {
      setLoading(true);
      setError("");

      // 🔹 User Notifications
      const notif = await getNotifications();
      setNotifications(notif.notifications || []);

      // 🔹 Workspace Requests + Role
      const req = await getJoinRequests(workspaceId);

      setRequests(req.requests || []);
      setRole(req.role || "");

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

  // ✅ APPROVE REQUEST
  const handleApprove = async (requestId) => {
    try {
      await approveRequest(requestId);

      // 🔥 Instant UI update
      setRequests((prev) =>
        prev.filter((r) => r._id !== requestId)
      );

    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : err?.message || "Failed to approve"
      );
    }
  };

  // ❌ REJECT REQUEST
  const handleReject = async (requestId) => {
    try {
      await rejectRequest(requestId);

      setRequests((prev) =>
        prev.filter((r) => r._id !== requestId)
      );

    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : err?.message || "Failed to reject"
      );
    }
  };

  return {
    fetchWorkspaceNotifications,
    handleApprove,
    handleReject,
  };
};