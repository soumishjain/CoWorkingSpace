import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useChat } from "../hooks/useChat";

const MessageInput = ({ chatRoomId }) => {
  const [input, setInput] = useState("");
  const fileRef = useRef();

  const { workspaceId } = useParams();

  const { sendMessage, sendFile, uploading } = useChat(chatRoomId);

  // ================= SEND TEXT =================
  const send = () => {
    if (!input.trim()) return;

    sendMessage(input.trim());
    setInput("");
  };

  // ================= SEND FILE =================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 🔥 IMPORTANT: workspaceId pass kar
    sendFile(file, workspaceId);

    e.target.value = "";
  };

  return (
    <div
      className="p-3 flex gap-2 border-t items-center"
      style={{
        borderColor: "var(--border)",
        background: "var(--bg-secondary)",
      }}
    >
      {/* FILE */}
      <label
        className="px-3 py-2 rounded cursor-pointer text-sm"
        style={{ background: "var(--bg-hover)" }}
      >
        📎
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {/* INPUT */}
      <input
        className="input flex-1"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            send();
          }
        }}
      />

      {/* SEND */}
      <button
        onClick={send}
        disabled={uploading}
        className="px-4 py-2 rounded"
        style={{
          background: uploading ? "gray" : "var(--accent)",
          color: "white",
          opacity: uploading ? 0.7 : 1,
        }}
      >
        {uploading ? "Uploading..." : "Send"}
      </button>
    </div>
  );
};

export default MessageInput;