import { fetchActivities } from "../api/activity.api";
import { socket } from "../socket";

export const useActivity = (state, workspaceId, departmentId) => {

  const loadActivities = async () => {
    if (!workspaceId) return;
    if (state.loading || !state.hasMore) return;

    try {
      state.setLoading(true);

      const res = await fetchActivities(
        workspaceId,
        departmentId,
        state.page
      );

      const newActivities = res.activities || [];

      if (state.page === 1) {
        state.setActivities(newActivities);
      } else {
        state.appendActivities(newActivities);
      }

      state.setHasMore(res.hasMore ?? false);
      state.setPage((prev) => prev + 1);

    } catch (err) {
      console.error("ACTIVITY ERROR:", err);
    } finally {
      state.setLoading(false);
    }
  };

  // 🔥 SOCKET
  const initSocket = () => {
    if (!workspaceId) return;

    socket.emit("join-workspace", workspaceId);

    if (departmentId) {
      socket.emit("join-department", departmentId);
    }

    const handleActivity = (activity) => {
      state.setActivities((prev) => {
        if (prev.some((a) => a._id === activity._id)) return prev;

        return [activity, ...prev];
      });
    };

    socket.off("new-activity"); // 🔥 prevent duplicate listeners
    socket.off("new-department-activity");

    socket.on("new-activity", handleActivity);
    socket.on("new-department-activity", handleActivity);
  };

  const cleanupSocket = () => {
    socket.off("new-activity");
    socket.off("new-department-activity");
  };

  return {
    loadActivities,
    initSocket,
    cleanupSocket,
  };
};