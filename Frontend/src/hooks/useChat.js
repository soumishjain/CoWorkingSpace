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
  } = useChatState();

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // ✅ INITIAL FETCH
  useEffect(() => {
    if (!departmentId) return;

    const fetchMessages = async () => {
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
    };

    fetchMessages();
  }, [departmentId]);

  // ✅ LOAD MORE
  const loadMore = useCallback(async () => {
    if (!departmentId || !hasMore || loadingMore) return;

    setLoadingMore(true);

    const nextPage = page + 1;

    const res = await getOldMessagesAPI({
      departmentId,
      page: nextPage,
      limit: 30,
    });

    if (res.success) {
      setAllMessages(res.data);
      setPage(nextPage);

      if (res.data.length < 30) {
        setHasMore(false);
      }
    }

    setLoadingMore(false);
  }, [departmentId, page, hasMore, loadingMore]);

  // ✅ SOCKET
  useEffect(() => {
    if (!departmentId) return;

    connectSocket();
    socket.emit("join_department", { departmentId });

    const handleReceive = (msg) => {
      addMessage(msg); // ✅ IMPORTANT
    };

    socket.on("receive_message", handleReceive);

    return () => {
      socket.emit("leave_department", { departmentId });
      socket.off("receive_message", handleReceive);
    };
  }, [departmentId]);

  // ✅ SEND
  const sendMessage = (content) => {
    if (!content?.trim()) return;
    if (!socket.connected) return;

    socket.emit("send_message", {
      content,
      departmentId,
    });
  };

  return {
    messages,
    loading,
    sendMessage,
    loadMore,
    hasMore,
    loadingMore,
  };
};