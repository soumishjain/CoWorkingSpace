import { useEffect, useCallback } from "react";
import {
  getSubtasksAPI,
  claimSubtaskAPI,
  completeSubtaskAPI,
  getMyPendingSubtasksAPI,
} from "../api/subtask.api";

import { useSubtaskState } from "../state/useSubtaskState";
import { socket, connectSocket } from "../socket";

export const useSubtask = (taskId, departmentId) => {
  const {
    subtasks,
    mySubtasks,
    loading,
    setAllSubtasks,
    setMySubtasksData,
    claimSubtaskLocal,
    completeSubtaskLocal,
    startLoading,
    stopLoading,
  } = useSubtaskState();

  const userId = localStorage.getItem("userId");

  // ================== FETCH TASK SUBTASKS ==================
  const fetchSubtasks = useCallback(async () => {
    if (!taskId) return;

    try {
      startLoading();

      const res = await getSubtasksAPI(taskId);

      if (res?.subtasks) {
        setAllSubtasks(res.subtasks);
      }
    } catch (err) {
      console.error("FETCH SUBTASK ERROR:", err);
    } finally {
      stopLoading();
    }
  }, [taskId]);

  // ================== FETCH MY SUBTASKS ==================
  const fetchMySubtasks = useCallback(async () => {
    try {
      startLoading();

      const res = await getMyPendingSubtasksAPI();

      if (res?.subtasks) {
        setMySubtasksData(res.subtasks);
      }
    } catch (err) {
      console.error("MY SUBTASK ERROR:", err);
    } finally {
      stopLoading();
    }
  }, []);

  // ================== CLAIM ==================
  const claimSubtask = async (subtaskId) => {
    try {
      const res = await claimSubtaskAPI(subtaskId);

      if (res?.message) {
        claimSubtaskLocal(subtaskId, userId);

        // 🔥 sync my subtasks instantly
        fetchMySubtasks();
      }

      return res;
    } catch (err) {
      console.error("CLAIM ERROR:", err);
    }
  };

  // ================== COMPLETE ==================
  const completeSubtask = async (subtaskId) => {
    try {
      const res = await completeSubtaskAPI(subtaskId);

      if (res?.message) {
        completeSubtaskLocal(subtaskId);

        // 🔥 sync my subtasks instantly
        fetchMySubtasks();
      }

      return res;
    } catch (err) {
      console.error("COMPLETE ERROR:", err);
    }
  };

  // ================== SOCKET ==================
  useEffect(() => {
    if (!departmentId) return;

    connectSocket();
    socket.emit("join_department", { departmentId });

    const handleClaim = ({ subtaskId, userId }) => {
      claimSubtaskLocal(subtaskId, userId);
      fetchMySubtasks(); // 🔥 sync
    };

    const handleComplete = ({ subtaskId }) => {
      completeSubtaskLocal(subtaskId);
      fetchMySubtasks(); // 🔥 sync
    };

    socket.off("subtask-claimed");
    socket.off("subtask-completed");

    socket.on("subtask-claimed", handleClaim);
    socket.on("subtask-completed", handleComplete);

    return () => {
      socket.off("subtask-claimed", handleClaim);
      socket.off("subtask-completed", handleComplete);
    };
  }, [departmentId, fetchMySubtasks]);

  // ================== INIT ==================
  useEffect(() => {
    // 🔥 ALWAYS FETCH MY TASKS (IMPORTANT FIX)
    fetchMySubtasks();

    // 🔥 ONLY FETCH TASK SUBTASKS IF taskId exists
    if (taskId) {
      fetchSubtasks();
    }
  }, [taskId, fetchSubtasks, fetchMySubtasks]);

  return {
    subtasks,
    mySubtasks,
    loading,

    fetchSubtasks,
    fetchMySubtasks,
    claimSubtask,
    completeSubtask,
  };
};