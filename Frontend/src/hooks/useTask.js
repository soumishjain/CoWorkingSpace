import { useCallback, useEffect } from "react";
import { createTaskAPI,approveTaskAPI, deleteTaskAPI, getAllTasksAPI, rejectTaskAPI } from "../api/task.api";
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

  // ================== FETCH TASKS ==================
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
      stopLoading(); // 🔥 ALWAYS STOP
    }
  }, [workspaceId, departmentId, setAllTasks, setUserRole]);

  // ================== CREATE ==================
  const createTask = async (data) => {
    const res = await createTaskAPI({
      workspaceId,
      departmentId,
      data,
    });

    if (res?.task) {
      addTask(res.task);
    }

    return res;
  };

  // ================== DELETE ==================
  const deleteTask = async (taskId) => {
    const res = await deleteTaskAPI(taskId);

    if (res?.success) {
      removeTask(taskId);
    }

    return res;
  };

  // ================== APPROVE ==================
  const approveTask = async (taskId) => {
    const res = await approveTaskAPI(taskId);

    if (res?.task) {
      updateTask(res.task);
    }

    return res;
  };

  // ================== REJECT ==================
  const rejectTask = async (taskId, feedback) => {
    const res = await rejectTaskAPI({ taskId, feedback });

    if (res?.task) {
      updateTask(res.task);
    }

    return res;
  };

  // ================== SOCKET ==================
  useEffect(() => {
    if (!departmentId) return;

    connectSocket();
    socket.emit("join_department", { departmentId });

    // 🔥 HANDLERS (define once)
    const handleCreate = (task) => {
      addTask(task);
    };

    const handleApprove = (task) => {
      updateTask(task);
    };

    const handleReject = (task) => {
      updateTask(task);
    };

    const handleDelete = ({ taskId }) => {
      removeTask(taskId);
    };

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
  }, [departmentId]); // 🔥 REMOVE function deps

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