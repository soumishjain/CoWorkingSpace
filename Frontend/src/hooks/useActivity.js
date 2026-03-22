import { fetchActivities } from "../api/activity.api";
import { socket } from "../socket"; // 🔥 make sure socket export ho

export const useActivity = (state, workspaceId, departmentId) => {

  const loadActivities = async () => {
    if (!workspaceId) return; // 🔥 workspace required

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
    }

    state.setLoading(false);
  };


  // 🔥 SOCKET LISTENER
  const initSocket = () => {
    if (!workspaceId) return;

    // 🔥 join workspace room
    socket.emit("join-workspace", workspaceId);

    if (departmentId) {
      socket.emit("join-department", departmentId);
    }

    // 🔥 workspace activity
    socket.on("new-activity", (activity) => {
      state.setActivities((prev) => [activity, ...prev]);
    });

    // 🔥 department activity (optional)
    socket.on("new-department-activity", (activity) => {
      state.setActivities((prev) => [activity, ...prev]);
    });
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