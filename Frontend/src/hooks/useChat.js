import { useEffect, useState, useRef, useCallback } from "react";
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

  const bottomRef = useRef(null);
  const isJoinedRef = useRef(false);

  // ================= FETCH INITIAL =================
  useEffect(() => {
    if (!chatRoomId) return;

    const fetchMessages = async () => {
      console.log("📥 Fetching messages:", chatRoomId);
      setLoading(true);

      try {
        const res = await getMessagesAPI({
          chatRoomId,
          page: 1,
          limit: 20,
        });

        if (res.success) {
          setMessages(res.data || []);
          setHasMore(res.meta?.hasMore ?? false);
          setPage(1);
        }
      } catch (err) {
        console.error("💥 FETCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatRoomId]);

  // ================= LOAD MORE (🔥 KEY FEATURE) =================
  const loadMoreMessages = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);

      const nextPage = page + 1;

      console.log("📜 Loading more page:", nextPage);

      const res = await getMessagesAPI({
        chatRoomId,
        page: nextPage,
        limit: 20,
      });

      if (res.success) {
        setMessages((prev) => [
          ...(res.data || []), // 🔥 prepend
          ...prev,
        ]);

        setHasMore(res.meta?.hasMore ?? false);
        setPage(nextPage);
      }

    } catch (err) {
      console.error("💥 LOAD MORE ERROR:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [chatRoomId, page, hasMore, loadingMore]);

  // ================= SOCKET CONNECT =================
  useEffect(() => {
    connectSocket();

    socket.on("connect", () => {
      console.log("🟢 SOCKET CONNECTED:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("🔴 SOCKET DISCONNECTED");
      isJoinedRef.current = false;
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  // ================= JOIN ROOM =================
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

  // ================= RECEIVE =================
  useEffect(() => {
    const handleReceive = (msg) => {
      console.log("📩 RECEIVED:", msg);

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

    socket.on("receive_message", handleReceive);
    socket.on("message_deleted", handleDelete);

    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("message_deleted", handleDelete);
    };
  }, []);

  // ================= SEND TEXT =================
  const sendMessage = (content) => {
    if (!content?.trim()) return;
    if (!socket.connected) return;

    socket.emit("send_message", {
      chatRoomId,
      content,
      type: "text",
    });
  };

  // ================= SEND FILE =================
  const sendFile = async (file, workspaceId) => {
    if (!file || !workspaceId) return;

    try {
      setUploading(true);

      const res = await uploadChatFileAPI({
        file,
        workspaceId,
      });

      if (!res.success) {
        alert(res.error || "Upload failed");
        return;
      }

      socket.emit("send_message", {
        chatRoomId,
        content: res.fileUrl,
        type: res.type,
        fileName: res.fileName,
      });

    } catch (err) {
      console.error("💥 FILE ERROR:", err);
    } finally {
      setUploading(false);
    }
  };

  // ================= DELETE =================
  const deleteMessage = (messageId) => {
    if (!socket.connected) return;
    socket.emit("delete_message", { messageId });
  };

  return {
    messages,
    loading,
    uploading,
    bottomRef,

    sendMessage,
    sendFile,
    deleteMessage,

    hasMore,
    loadingMore,
    loadMoreMessages, // 🔥 important
  };
};