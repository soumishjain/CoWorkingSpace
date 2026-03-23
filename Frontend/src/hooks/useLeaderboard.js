import { useEffect, useState } from "react";
import {
  fetchLeaderboard,
  fetchTop3,
  fetchMyRank,
} from "../api/leaderboard.api";
import { initialLeaderboardState } from "../state/LeaderboardState";
import { socket } from "../socket";

export const useLeaderboard = (workspaceId, departmentId) => {
  const [state, setState] = useState(initialLeaderboardState);

  const loadData = async () => {
    try {
      const [lbRes, topRes, rankRes] = await Promise.allSettled([
        fetchLeaderboard(workspaceId, departmentId),
        fetchTop3(workspaceId, departmentId),
        fetchMyRank(workspaceId, departmentId),
      ]);

      setState({
        leaderboard:
          lbRes.status === "fulfilled"
            ? lbRes.value.data.leaderboard
            : [],

        top3:
          topRes.status === "fulfilled"
            ? topRes.value.data.top
            : [],

        myRank:
          rankRes.status === "fulfilled"
            ? rankRes.value.data
            : null,

        loading: false,
        error: null,
      });
    } catch (err) {
      console.error(err);

      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load leaderboard",
      }));
    }
  };

  useEffect(() => {
    if (!workspaceId || !departmentId) return;

    setState((prev) => ({ ...prev, loading: true }));

    // 🔥 initial fetch
    loadData();

    // 🔥 JOIN ROOM
    socket.emit("join-department", departmentId);

    // 🔥 LISTEN FOR REALTIME UPDATE
    const handleUpdate = (data) => {
        console.log("Realtime event recieved")
      if (data.departmentId === departmentId) {
        loadData(); // 🔥 refetch silently
      }
    };

    socket.on("leaderboard-updated", handleUpdate);

    return () => {
      socket.off("leaderboard-updated", handleUpdate);

      // optional cleanup
      socket.emit("leave-department", departmentId);
    };
  }, [workspaceId, departmentId]);

  return state;
};