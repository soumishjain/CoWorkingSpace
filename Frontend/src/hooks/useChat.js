import { useEffect, useCallback, useState } from "react";
import { socket, connectSocket } from "../socket";
import { getOldMessagesAPI } from "../api/chat.api";
import { useChatState } from "../state/useChatState";

export const useChat = (departmentId) => {
  const {
    messages,
    loading,
    startLoading,
    stopLoading,
    setAllMessages,
    addMessage,
    clearMessages,
  } = useChatState();

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // ================== INITIAL FETCH ==================
  const fetchMessages = useCallback(async () => {
    if (!departmentId) return;

    startLoading();

    const res = await getOldMessagesAPI({
      departmentId,
      page: 1,
      limit: 30,
    });

    if (res.success) {
      setAllMessages(res.data);
      setHasMore(res.data.length === 30);
      setPage(1);
    }

    stopLoading();
  }, [departmentId, startLoading, stopLoading, setAllMessages]);



  // ================== LOAD MORE ==================
  const loadMore = useCallback(async () => {
    if (!departmentId || !hasMore) return;

    const nextPage = page + 1;

    const res = await getOldMessagesAPI({
      departmentId,
      page: nextPage,
      limit: 30,
    });

    if (res.success) {
      const newMessages = res.data;

      // 🔥 prepend (old messages upar)
      setAllMessages((prev) => [...newMessages, ...prev]);

      setPage(nextPage);

      if (newMessages.length < 30) {
        setHasMore(false);
      }
    }
  }, [departmentId, page, hasMore, setAllMessages]);



  // ================== SOCKET ==================
  useEffect(() => {
    if (!departmentId) return;

    const handleConnect = () => {
      console.log("🟢 SOCKET CONNECTED");
      socket.emit("join_department", departmentId);
    };

    const handleReceive = (msg) => {
      // 🔥 duplicate avoid
      setAllMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on("connect", handleConnect);
    socket.on("receive_message", handleReceive);

    connectSocket();

    return () => {
      socket.emit("leave_department", departmentId);

      socket.off("connect", handleConnect);
      socket.off("receive_message", handleReceive);

      socket.disconnect();
      clearMessages();
      setPage(1);
      setHasMore(true);
    };
  }, [departmentId, clearMessages, setAllMessages]);



  // ================== SEND ==================
  const sendMessage = (content) => {
    if (!content?.trim()) return;
    if (!socket.connected) return;

    socket.emit("send_message", {
      content,
      departmentId,
    });
  };



  // ================== INIT ==================
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);



  return {
    messages,
    loading,
    sendMessage,
    loadMore,     // 🔥 important for scroll
    hasMore,      // optional (loader ke liye)
  };
};