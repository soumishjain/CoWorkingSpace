import { useState, useCallback } from "react";

export const useChatState = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ MERGE INSTEAD OF REPLACE
  const setAllMessages = useCallback((msgs) => {
    if (!Array.isArray(msgs)) return;

    setMessages((prev) => {
      const ids = new Set(prev.map((m) => m._id));
      const filtered = msgs.filter((m) => !ids.has(m._id));
      return [...filtered, ...prev];
    });
  }, []);

  // ✅ ADD SINGLE MESSAGE
  const addMessage = useCallback((msg) => {
    if (!msg || !msg._id) return;

    setMessages((prev) => {
      if (prev.some((m) => m._id === msg._id)) return prev;
      return [...prev, msg];
    });
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const startLoading = useCallback(() => setLoading(true), []);
  const stopLoading = useCallback(() => setLoading(false), []);

  return {
    messages,
    loading,
    setAllMessages,
    addMessage,
    clearMessages,
    startLoading,
    stopLoading,
  };
};