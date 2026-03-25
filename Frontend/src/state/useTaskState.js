import { useState, useCallback } from "react";

export const useTaskState = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState(null); // 🔥 NEW

  // ================== SET ALL TASKS ==================
  const setAllTasks = useCallback((data) => {
    if (!Array.isArray(data)) return;

    // 🔥 IMPORTANT: overwrite instead of merge
    setTasks(data);
  }, []);

  // ================== ADD SINGLE TASK ==================
  const addTask = useCallback((task) => {
    if (!task?._id) return;

    setTasks((prev) => {
      if (prev.some((t) => t._id === task._id)) return prev;
      return [task, ...prev];
    });
  }, []);

  // ================== UPDATE TASK ==================
  const updateTask = useCallback((updatedTask) => {
    if (!updatedTask?._id) return;

    setTasks((prev) =>
      prev.map((t) =>
        t._id === updatedTask._id ? updatedTask : t
      )
    );

    setSelectedTask((prev) =>
      prev?._id === updatedTask._id ? updatedTask : prev
    );
  }, []);

  // ================== DELETE TASK ==================
  const removeTask = useCallback((taskId) => {
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  }, []);

  // ================== SELECT TASK ==================
  const selectTask = useCallback((task) => {
    setSelectedTask(task);
  }, []);

  const clearSelectedTask = useCallback(() => {
    setSelectedTask(null);
  }, []);

  // ================== ROLE ==================
  const setUserRole = useCallback((r) => {
    setRole(r);
  }, []);

  // ================== LOADING ==================
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  return {
    tasks,
    selectedTask,
    loading,
    role,

    setAllTasks,
    addTask,
    updateTask,
    removeTask,

    selectTask,
    clearSelectedTask,

    setUserRole, // 🔥 NEW

    startLoading,
    stopLoading,
  };
};