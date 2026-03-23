import { fetchActivities } from "../api/activity.api";
import { socket } from "../socket";

export const useActivity = (state, workspaceId, departmentId) => {

  const loadActivities = async () => {
    if (!workspaceId) return;
    if (!state.hasMore || state.loading) return;

    state.setLoading(true);

    try {
      const res = await fetchActivities(
        workspaceId,
        departmentId,
        state.page
      );

      if (state.page === 1) {
        state.setActivities(res.activities || []);
      } else {
        state.appendActivities(res.activities || []);
      }

      state.setHasMore(res.hasMore);
      state.setPage((prev) => prev + 1);

    } catch (err) {
      console.error("ACTIVITY ERROR:", err);
    }finally{

      state.setLoading(false);
    }

  };

  // 🔥 SOCKET INIT
  const initSocket = () => {
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

    socket.on("new-activity", handleActivity);
    socket.on("new-department-activity", handleActivity);
  };

  // 🔥 CLEANUP
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