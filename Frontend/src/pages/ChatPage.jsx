import { useState, useRef, useEffect } from "react";
import { useChat } from "../hooks/useChat";
import { useParams } from "react-router-dom";
import { formatDateTime } from "../utils/formatDateTime";
import { Send } from "lucide-react";

const ChatPage = () => {
  const { departmentId } = useParams();
  const { messages, sendMessage, loadMore, hasMore, loadingMore } =
    useChat(departmentId);

  const [input, setInput] = useState("");

  const bottomRef = useRef(null);
  const containerRef = useRef(null);
  const prevLengthRef = useRef(0);

  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    if (messages.length > prevLengthRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevLengthRef.current = messages.length;
  }, [messages]);

  const handleScroll = async () => {
    const container = containerRef.current;
    if (!container || loadingMore || !hasMore) return;

    if (container.scrollTop <= 5) {
      const prevHeight = container.scrollHeight;
      await loadMore();

      requestAnimationFrame(() => {
        container.scrollTop =
          container.scrollHeight - prevHeight;
      });
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="h-full flex flex-col bg-[#f7f9fc]">

      {/* 🔥 HEADER */}
      <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold text-gray-900">
            Department Chat
          </h1>
          <p className="text-xs text-green-500">● Active now</p>
        </div>
      </div>

      {/* 🔥 CHAT AREA */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-4"
      >
        {messages.map((msg) => {
          const isMe = msg?.senderId?._id === currentUserId;
          const isAdmin = msg.role === "admin";
          const isManager = msg.role === "manager";

          return (
            <div
        key={msg._id}
        className={`flex gap-3 ${
          isMe ? "justify-end" : "justify-start"
        }`}
      >

        {/* AVATAR (ONLY LEFT SIDE) */}
        {!isMe && (
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold
            ${
              isAdmin
                ? "bg-red-100 text-red-600"
                : isManager
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {msg.senderId?.name?.charAt(0)}
          </div>
        )}

        <div className="max-w-[65%] flex flex-col">

          {/* NAME */}
          {!isMe && (
            <div className="flex gap-2 mb-1 text-xs text-gray-500">
              <span className="font-medium text-gray-700">
                {msg.senderId?.name}
              </span>
              {isAdmin && <span className="text-red-500">ADMIN</span>}
              {isManager && <span className="text-yellow-600">MANAGER</span>}
            </div>
          )}

          {/* MESSAGE */}
          <div
            className={`px-4 py-2.5 text-sm leading-relaxed shadow-sm
            ${
              isMe
                ? "bg-blue-500/90 text-white rounded-2xl rounded-br-md"
                : "bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-md"
            }`}
          >
            {msg.content}
          </div>

          {/* TIME */}
          <span
            className={`text-[10px] mt-1 ${
              isMe ? "text-blue-200 text-right mr-1" : "text-gray-400 ml-1"
            }`}
          >
            {formatDateTime(msg.createdAt)}
          </span>

        </div>
      </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* 🔥 INPUT */}
      <div className="px-5 py-4 bg-white border-t border-gray-200">

        <div className="flex items-center gap-3 bg-gray-100 rounded-2xl px-4 py-2">

          <input
            className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          <button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition"
          >
            <Send size={16} />
          </button>

        </div>

      </div>
    </div>
  );
};

export default ChatPage;