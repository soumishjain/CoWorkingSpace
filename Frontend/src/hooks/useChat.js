import { useEffect, useState, useRef } from "react";
import { getMessagesAPI } from "../api/chat.api";
import { uploadChatFileAPI } from "../api/file.api";
import { socket, connectSocket } from "../socket";

export const useChat = (chatRoomId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [replyingTo, setReplyingTo] = useState(null);

  const [errorModal, setErrorModal] = useState({
    open: false,
    message: "",
  });

  const isJoinedRef = useRef(false);

  /* ================= INITIAL FETCH ================= */
  useEffect(() => {
    if (!chatRoomId) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await getMessagesAPI({
          chatRoomId,
          page: 1,
          limit: 20,
        });

        if (res.success) {
          const ordered = [...(res.data || [])].reverse();
          setMessages(ordered);
          setHasMore(res.meta?.hasMore ?? false);
          setPage(1);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatRoomId]);

  /* ================= LOAD MORE ================= */
  const loadMoreMessages = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);

      const nextPage = page + 1;

      const res = await getMessagesAPI({
        chatRoomId,
        page: nextPage,
        limit: 20,
      });

      if (res.success) {
        let newMessages = res.data || [];

        newMessages = [...newMessages].reverse();

        setMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m._id));

          const filtered = newMessages.filter(
            (m) => !existingIds.has(m._id)
          );

          return [...filtered, ...prev];
        });

        setPage(nextPage);
        setHasMore(res.meta?.hasMore ?? false);
      }
    } catch (err) {
      console.error("❌ LOAD MORE ERROR:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  /* ================= SOCKET ================= */
  useEffect(() => {
    connectSocket();

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  /* ================= JOIN ================= */
  useEffect(() => {
    if (!chatRoomId || !socket.connected) return;
    if (isJoinedRef.current) return;

    socket.emit("join_chatroom", { chatRoomId });
    isJoinedRef.current = true;

    return () => {
      socket.emit("leave_chatroom", { chatRoomId });
      isJoinedRef.current = false;
    };
  }, [chatRoomId, socket.connected]);

  /* ================= RECEIVE ================= */
  useEffect(() => {
    const handleReceive = (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    const handleDelete = ({ messageId }) => {
      setMessages((prev) =>
        prev.filter((m) => m._id !== messageId)
      );
    };

    // 🔥 FIXED EDIT HANDLER (ONLY CHANGE)
    const handleEdit = (updatedMsg) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === updatedMsg._id
            ? {
                ...m,
                ...updatedMsg,
                replyTo: m.replyTo || updatedMsg.replyTo,
              }
            : m
        )
      );
    };

    const handleError = (err) => {
      setErrorModal({
        open: true,
        message: err.message,
      });
    };

    socket.on("receive_message", handleReceive);
    socket.on("message_deleted", handleDelete);
    socket.on("message_edited", handleEdit);
    socket.on("chat_error", handleError);

    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("message_deleted", handleDelete);
      socket.off("message_edited", handleEdit);
      socket.off("chat_error", handleError);
    };
  }, []);

  /* ================= SEND ================= */
  const sendMessage = (content) => {
    if (!content?.trim()) return;
    if (!socket.connected) return;

    socket.emit("send_message", {
      chatRoomId,
      content,
      type: "text",
      replyTo: replyingTo?._id || null,
    });

    setReplyingTo(null);
  };

  const editMessage = (messageId, content) => {
    if (!socket.connected) return;

    socket.emit("edit_message", {
      messageId,
      content,
    });
  };

  const deleteMessage = (messageId) => {
    if (!socket.connected) return;

    socket.emit("delete_message", { messageId });
  };

  const sendFile = async (file, workspaceId) => {
    if (!file || !workspaceId) return;

    try {
      setUploading(true);

      const res = await uploadChatFileAPI({
        file,
        workspaceId,
      });

      if (!res.success) return;

      socket.emit("send_message", {
        chatRoomId,
        content: res.fileUrl,
        type: res.type,
        fileName: res.fileName,
        replyTo: replyingTo?._id || null,
      });

      setReplyingTo(null);
    } finally {
      setUploading(false);
    }
  };

  return {
    messages,
    loading,
    uploading,

    sendMessage,
    sendFile,
    deleteMessage,
    editMessage,

    replyingTo,
    setReplyingTo,

    loadMoreMessages,
    hasMore,
    loadingMore,

    errorModal,
    setErrorModal,
  };
};