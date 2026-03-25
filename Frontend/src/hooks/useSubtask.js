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

  // ================== FETCH SUBTASKS ==================
  const fetchSubtasks = useCallback(async () => {
    if (!taskId) return;

    startLoading();

    const res = await getSubtasksAPI(taskId);

    if (res?.subtasks) {
      setAllSubtasks(res.subtasks);
    }

    stopLoading();
  }, [taskId]);

  // ================== MY SUBTASKS ==================
  const fetchMySubtasks = useCallback(async () => {
    const res = await getMyPendingSubtasksAPI();

    if (res?.subtasks) {
      setMySubtasksData(res.subtasks);
    }
  }, []);

  // ================== CLAIM ==================
  const claimSubtask = async (subtaskId) => {
    const res = await claimSubtaskAPI(subtaskId);

    if (res?.message) {
      claimSubtaskLocal(subtaskId, userId);
    }

    return res;
  };

  // ================== COMPLETE ==================
  const completeSubtask = async (subtaskId) => {
    const res = await completeSubtaskAPI(subtaskId);

    if (res?.message) {
      completeSubtaskLocal(subtaskId);
    }

    return res;
  };

  // ================== SOCKET ==================
  useEffect(() => {
    if (!departmentId) return;

    connectSocket();

    socket.emit("join_department", { departmentId });

    socket.on("subtask-claimed", ({ subtaskId, userId }) => {
      claimSubtaskLocal(subtaskId, userId);
    });

    socket.on("subtask-completed", ({ subtaskId }) => {
      completeSubtaskLocal(subtaskId);
    });

    return () => {
      socket.off("subtask-claimed");
      socket.off("subtask-completed");
    };
  }, [departmentId]);

  // ================== INIT ==================
  useEffect(() => {
    fetchSubtasks();
    fetchMySubtasks();
  }, [taskId]);

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