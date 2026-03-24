import { useEffect, useCallback } from "react";
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

  // ================== FETCH ==================
  const fetchMessages = useCallback(async () => {
    if (!departmentId) return;

    startLoading();

    const res = await getOldMessagesAPI({ departmentId });

    if (res.success) {
      setAllMessages(res.data);
    }

    stopLoading();
  }, [departmentId, startLoading, stopLoading, setAllMessages]);



  // ================== SOCKET ==================
  useEffect(() => {
    if (!departmentId) return;

    console.log("📡 INIT SOCKET WITH DEPT:", departmentId);

    // 🔥 attach listeners FIRST
    const handleConnect = () => {
      console.log("🟢 SOCKET CONNECTED");
      socket.emit("join_department", { departmentId });
    };

    const handleError = (err) => {
      console.log("❌ SOCKET ERROR:", err.message);
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleError);

    // 🔥 then connect
    connectSocket();

    return () => {
      console.log("🔴 CLEANUP SOCKET");

      socket.emit("leave_department", { departmentId });

      socket.off("connect", handleConnect);
      socket.off("connect_error", handleError);

      socket.disconnect();
      clearMessages();
    };
  }, [departmentId, clearMessages]);



  // ================== RECEIVE ==================
  useEffect(() => {
    const handleReceive = (msg) => {
      console.log("📩 RECEIVED:", msg);
      addMessage(msg);
    };

    socket.on("receive_message", handleReceive);

    return () => {
      socket.off("receive_message", handleReceive);
    };
  }, [addMessage]);



  // ================== SEND ==================
  const sendMessage = (content) => {
    if (!content || content.trim() === "") return;

    if (!departmentId) {
      console.log("❌ NO DEPARTMENT ID");
      return;
    }

    if (!socket.connected) {
      console.log("❌ SOCKET NOT CONNECTED");
      return;
    }

    console.log("🚀 SENDING:", content, departmentId);

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
  };
};