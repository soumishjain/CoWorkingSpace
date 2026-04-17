import { useState, useRef } from "react";
import { useParams } from "react-router-dom";

/* 🔥 PLAN FEATURES */
const PLAN_FEATURES = {
  individual: {
    fileUpload: false,
  },
  startup: {
    fileUpload: true,
  },
  company: {
    fileUpload: true,
  },
  bigtech: {
    fileUpload: true,
  },
};

const MessageInput = ({ chat, workspace }) => {
  const [input, setInput] = useState("");
  const fileRef = useRef(null);

  const { workspaceId } = useParams();

  const {
    sendMessage,
    sendFile,
    uploading,
    replyingTo,
    setReplyingTo,
    setErrorModal,
  } = chat;

  /* ================= FIX ================= */
  const plan = workspace?.plan?.toLowerCase() || "individual";
  const features = PLAN_FEATURES[plan] || {};

  console.log("🔥 PLAN:", plan);
  console.log("🔥 FEATURES:", features);

  /* ================= SEND ================= */
  const send = () => {
    const text = input.trim();
    if (!text) return;

    sendMessage(text);
    setInput("");
  };

  /* ================= FILE ================= */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!features.fileUpload) {
      setErrorModal({
        open: true,
        message:
          "File upload is not allowed in your plan. Ask your admin to upgrade.",
      });
      return;
    }

    sendFile(file, workspaceId);
    e.target.value = "";
  };

  const handleFileClick = () => {
    if (!features.fileUpload) {
      setErrorModal({
        open: true,
        message:
          "File upload is not allowed in your plan. Ask your admin to upgrade.",
      });
      return;
    }

    fileRef.current.click();
  };

  return (
    <div
      className="p-3 flex flex-col gap-2 border-t"
      style={{
        borderColor: "var(--border)",
        background: "var(--bg-secondary)",
      }}
    >
      {/* REPLY BAR */}
      {replyingTo && (
        <div
          className="flex justify-between items-center px-3 py-2 rounded-lg border"
          style={{
            borderColor: "var(--accent)",
            background: "var(--bg-hover)",
          }}
        >
          <div className="text-sm overflow-hidden">
            <div
              className="font-medium"
              style={{ color: "var(--accent)" }}
            >
              Replying to {replyingTo?.senderId?.name || "User"}
            </div>

            <div className="text-xs text-[var(--text-secondary)] truncate">
              {replyingTo?.content}
            </div>
          </div>

          <button onClick={() => setReplyingTo(null)}>✕</button>
        </div>
      )}

      {/* INPUT ROW */}
      <div className="flex gap-2 items-center">

        {/* FILE */}
        <button
          onClick={handleFileClick}
          className="px-3 py-2 rounded text-sm"
          style={{
            background: features.fileUpload
              ? "var(--bg-hover)"
              : "rgba(255,255,255,0.05)",
            color: features.fileUpload
              ? "var(--text-primary)"
              : "gray",
            opacity: features.fileUpload ? 1 : 0.6,
          }}
        >
          📎
        </button>

        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* INPUT */}
        <input
          className="input flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            replyingTo
              ? `Replying to ${replyingTo?.senderId?.name || "user"}...`
              : "Type a message..."
          }
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
    </div>
  );
};

export default MessageInput;