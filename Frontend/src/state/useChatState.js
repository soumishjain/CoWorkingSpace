import { useState, useCallback } from "react";

export const useChatState = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================== SET ALL ==================
  const setAllMessages = useCallback((msgs) => {
    setMessages(Array.isArray(msgs) ? msgs : []);
  }, []);

  // ================== ADD ONE (DUP SAFE) ==================
  const addMessage = useCallback((msg) => {
    if (!msg || !msg._id) return;

    setMessages((prev) => {
      const exists = prev.some((m) => m._id === msg._id);
      if (exists) return prev;

      return [...prev, msg];
    });
  }, []);

  // ================== CLEAR ==================
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  // ================== OPTIONAL: UPDATE MESSAGE ==================
  const updateMessage = useCallback((updatedMsg) => {
    if (!updatedMsg || !updatedMsg._id) return;

    setMessages((prev) =>
      prev.map((m) =>
        m._id === updatedMsg._id ? updatedMsg : m
      )
    );
  }, []);

  // ================== SAFE LOADING ==================
  const startLoading = useCallback(() => setLoading(true), []);
  const stopLoading = useCallback(() => setLoading(false), []);

  return {
    messages,
    loading,

    // setters
    setAllMessages,
    addMessage,
    clearMessages,
    updateMessage,

    // loading controls
    startLoading,
    stopLoading,
  };
};