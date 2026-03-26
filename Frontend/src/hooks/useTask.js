import { useCallback, useEffect } from "react";
import {
  createTaskAPI,
  approveTaskAPI,
  deleteTaskAPI,
  getAllTasksAPI,
  rejectTaskAPI,
} from "../api/task.api";

import { useTaskState } from "../state/useTaskState";
import { connectSocket, socket } from "../socket";

export const useTask = (workspaceId, departmentId) => {
  const {
    tasks,
    loading,
    role,
    setAllTasks,
    addTask,
    updateTask,
    removeTask,
    setUserRole,
    startLoading,
    stopLoading,
  } = useTaskState();

  // ================== FETCH ==================
  const fetchTasks = useCallback(async () => {
    if (!workspaceId || !departmentId) return;

    try {
      startLoading();

      const res = await getAllTasksAPI({ workspaceId, departmentId });

      if (res?.tasks) {
        setAllTasks(res.tasks);
        setUserRole(res.role);
      }
    } catch (err) {
      console.error("FETCH TASK ERROR:", err);
    } finally {
      stopLoading();
    }
  }, [workspaceId, departmentId]);

  // ================== CREATE ==================
  const createTask = async (data) => {
    try {
      const res = await createTaskAPI({
        workspaceId,
        departmentId,
        data,
      });

      if (res?.task) addTask(res.task);

      return res;
    } catch (err) {
      console.error("CREATE TASK ERROR:", err);
    }
  };

  // ================== DELETE ==================
  const deleteTask = async (taskId) => {
    try {
      const res = await deleteTaskAPI(taskId);

      if (res?.success) removeTask(taskId);

      return res;
    } catch (err) {
      console.error("DELETE TASK ERROR:", err);
    }
  };

  // ================== APPROVE ==================
  const approveTask = async (taskId) => {
    try {
      const res = await approveTaskAPI(taskId);

      if (res?.task) updateTask(res.task);

      return res;
    } catch (err) {
      console.error("APPROVE ERROR:", err);
    }
  };

  // ================== REJECT ==================
  const rejectTask = async (taskId, feedback) => {
    try {
      const res = await rejectTaskAPI({ taskId, feedback });

      if (res?.task) {
        updateTask(res.task);
      } else {
        // 🔥 fallback (socket handle karega)
        updateTask({
          _id: taskId,
          status: "in-progress",
        });
      }

      return res;
    } catch (err) {
      console.error("REJECT ERROR:", err);
    }
  };

  // ================== SOCKET ==================
  useEffect(() => {
    if (!departmentId) return;

    connectSocket();
    socket.emit("join_department", { departmentId });

    // 🔥 HANDLERS
    const handleCreate = (task) => addTask(task);

    const handleApprove = (task) => updateTask(task);

    const handleReject = (data) => {
      // 🔥 backend sirf taskId bhej raha hai
      updateTask({
        _id: data.taskId,
        status: "in-progress",
      });
    };

    const handleDelete = ({ taskId }) => removeTask(taskId);

    // 🔥 CLEAN FIRST (important)
    socket.off("task-created");
    socket.off("task-approved");
    socket.off("task-rejected");
    socket.off("task-deleted");

    // 🔥 ATTACH
    socket.on("task-created", handleCreate);
    socket.on("task-approved", handleApprove);
    socket.on("task-rejected", handleReject);
    socket.on("task-deleted", handleDelete);

    return () => {
      socket.off("task-created", handleCreate);
      socket.off("task-approved", handleApprove);
      socket.off("task-rejected", handleReject);
      socket.off("task-deleted", handleDelete);
    };
  }, [departmentId]);

  // ================== INIT ==================
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    role,

    fetchTasks,
    createTask,
    deleteTask,
    approveTask,
    rejectTask,
  };
};