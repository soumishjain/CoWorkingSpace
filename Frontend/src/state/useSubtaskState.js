import { useState, useCallback } from "react";

export const useSubtaskState = () => {
  const [subtasks, setSubtasks] = useState([]);
  const [mySubtasks, setMySubtasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================== SET ALL SUBTASKS ==================
  const setAllSubtasks = useCallback((data) => {
    if (!Array.isArray(data)) return;

    setSubtasks((prev) => {
      const ids = new Set(prev.map((s) => s._id));
      const filtered = data.filter((s) => !ids.has(s._id));
      return [...filtered, ...prev];
    });
  }, []);

  // ================== SET MY SUBTASKS ==================
  const setMySubtasksData = useCallback((data) => {
    if (!Array.isArray(data)) return;

    setMySubtasks((prev) => {
      const ids = new Set(prev.map((s) => s._id));
      const filtered = data.filter((s) => !ids.has(s._id));
      return [...filtered, ...prev];
    });
  }, []);

  // ================== CLAIM SUBTASK ==================
  const claimSubtaskLocal = useCallback((subtaskId, userId) => {
    setSubtasks((prev) =>
      prev.map((s) =>
        s._id === subtaskId
          ? { ...s, assignedTo: { _id: userId } }
          : s
      )
    );
  }, []);

  // ================== COMPLETE SUBTASK ==================
  const completeSubtaskLocal = useCallback((subtaskId) => {
    setSubtasks((prev) =>
      prev.map((s) =>
        s._id === subtaskId
          ? { ...s, status: "completed" }
          : s
      )
    );

    // also remove from mySubtasks
    setMySubtasks((prev) =>
      prev.filter((s) => s._id !== subtaskId)
    );
  }, []);

  // ================== LOADING ==================
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  return {
    subtasks,
    mySubtasks,
    loading,

    setAllSubtasks,
    setMySubtasksData,

    claimSubtaskLocal,
    completeSubtaskLocal,

    startLoading,
    stopLoading,
  };
};