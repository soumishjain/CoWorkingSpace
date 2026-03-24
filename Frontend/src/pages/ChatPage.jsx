import { useState, useRef, useEffect } from "react";
import { useChat } from "../hooks/useChat";
import { useParams } from "react-router-dom";

const ChatPage = () => {
  const {departmentId} = useParams()
  const { messages, loading, sendMessage } = useChat(departmentId);

  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  // ================== AUTO SCROLL ==================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ================== SEND ==================
  const handleSend = () => {
    if (!input.trim()) return;

    sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">

      {/* ================== HEADER ================== */}
      <div className="bg-gray-900 text-white p-4 font-semibold shadow">
        Department Chat
      </div>

      {/* ================== CHAT BOX ================== */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-500">No messages</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className="bg-white px-3 py-2 rounded-lg shadow max-w-[70%]"
            >
              <p className="text-sm font-semibold text-gray-700">
                {msg.senderId?.name || "User"}
              </p>
              <p className="text-gray-800 text-sm">{msg.content}</p>
            </div>
          ))
        )}

        <div ref={bottomRef} />
      </div>

      {/* ================== INPUT ================== */}
      <div className="flex items-center gap-2 p-3 border-t bg-white">
        <input
          type="text"
          className="flex-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
        />

        <button
          onClick={() => {
            console.log("SEND")
            handleSend()
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>

    </div>
  );
};

export default ChatPage;