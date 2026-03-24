import { useState, useRef, useEffect } from "react";
import { useChat } from "../hooks/useChat";
import { useParams } from "react-router-dom";
import { formatDateTime } from "../utils/formatDateTime";

const ChatPage = () => {
  const { departmentId } = useParams();
  const { messages, loading, sendMessage, loadMore } = useChat(departmentId);

  const [input, setInput] = useState("");

  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  const currentUserId = localStorage.getItem("userId");

  // 🔥 auto scroll only when new message comes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // 🔥 infinite scroll (top detection)
  const handleScroll = async () => {
    const container = containerRef.current;
    if (!container) return;

    if (container.scrollTop === 0) {
      const prevHeight = container.scrollHeight;

      await loadMore(); // 🔥 old messages load

      // 🔥 maintain scroll position (important)
      setTimeout(() => {
        container.scrollTop =
          container.scrollHeight - prevHeight;
      }, 0);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="h-screen flex flex-col bg-[#f4f6fb]">

      {/* HEADER */}
      <div className="px-6 py-4 bg-white/80 backdrop-blur-md border-b flex justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-semibold">
            D
          </div>
          <div>
            <h1 className="text-sm font-semibold">Department Chat</h1>
            <p className="text-xs text-gray-400">Active now</p>
          </div>
        </div>
      </div>

      {/* CHAT */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-5"
      >
        {messages.map((msg, index) => {
          const isMe = msg?.senderId?._id === currentUserId;
          const isAdmin = msg.role === "admin";
          const isManager = msg.role === "manager";

          return (
            <div
              key={msg._id || index}
              className={`flex items-end gap-2 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {!isMe && (
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs
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

                {!isMe && (
                  <div className="flex gap-2 mb-1 ml-1 text-xs">
                    <span>{msg.senderId?.name}</span>

                    {isAdmin && <span className="text-red-500">ADMIN</span>}
                    {isManager && <span className="text-yellow-600">MANAGER</span>}
                  </div>
                )}

                <div
                  className={`px-4 py-2 rounded-2xl text-sm
                  ${
                    isMe
                      ? "bg-blue-600 text-white"
                      : isAdmin
                      ? "bg-red-50 text-red-900"
                      : isManager
                      ? "bg-yellow-50 text-yellow-900"
                      : "bg-white"
                  }`}
                >
                  {msg.content}
                </div>

                <span className="text-[10px] text-gray-400 mt-1">
                  {formatDateTime(msg.createdAt)}
                </span>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="px-5 py-3 bg-white border-t">
        <div className="flex gap-2 bg-gray-100 rounded-xl px-4 py-2">
          <input
            className="flex-1 bg-transparent outline-none text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-1 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;