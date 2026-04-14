import { useState, useRef, useEffect } from "react";
import { useChat } from "../hooks/useChat";

const getFileIcon = (name = "") => {
  const ext = name.split(".").pop()?.toLowerCase();

  if (["pdf"].includes(ext)) return "📕";
  if (["doc", "docx"].includes(ext)) return "📄";
  if (["xls", "xlsx"].includes(ext)) return "📊";
  if (["zip", "rar"].includes(ext)) return "🗜️";

  return "📎";
};

// 🔥 fallback for old messages
const detectType = (url = "") => {
  if (!url) return "text";

  if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) return "image";
  if (url.match(/\.(mp4|webm)$/i)) return "video";
  if (url.match(/\.(mp3|wav)$/i)) return "audio";

  return "file";
};

const BASE_URL = "http://localhost:5000"; // change if needed

const MessageList = ({ chatRoomId }) => {
  const {
    messages,
    deleteMessage,
    loadMoreMessages,
    loadingMore,
  } = useChat(chatRoomId);

  const [menu, setMenu] = useState(null);

  const containerRef = useRef(null);
  const prevHeightRef = useRef(0);
  const isFetchingRef = useRef(false);

  // ================= SCROLL HANDLER =================
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = async () => {
      if (container.scrollTop < 50 && !isFetchingRef.current) {
        isFetchingRef.current = true;

        prevHeightRef.current = container.scrollHeight;

        await loadMoreMessages();

        setTimeout(() => {
          const newHeight = container.scrollHeight;
          const diff = newHeight - prevHeightRef.current;

          container.scrollTop = diff;
          isFetchingRef.current = false;
        }, 0);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [loadMoreMessages]);

  // ================= INITIAL SCROLL =================
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, []);

  // ================= RIGHT CLICK =================
  const handleRightClick = (e, messageId) => {
    e.preventDefault();
    setMenu({ x: e.clientX, y: e.clientY, messageId });
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4"
      onClick={() => setMenu(null)}
    >
      {/* LOADING */}
      {loadingMore && (
        <div className="text-center text-sm text-gray-400">
          Loading...
        </div>
      )}

      {messages.map((msg) => {
        const type = msg.type || detectType(msg.content);
        const url = msg.content?.startsWith("http")
          ? msg.content
          : BASE_URL + msg.content;

        return (
          <div
            key={msg._id}
            onContextMenu={(e) => handleRightClick(e, msg._id)}
            className="flex gap-3"
          >
            {/* AVATAR */}
            <div className="w-9 h-9 rounded-full bg-gray-600 flex items-center justify-center text-sm">
              {msg.senderId?.name?.[0]?.toUpperCase()}
            </div>

            <div>
              {/* HEADER */}
              <div className="text-sm font-medium">
                {msg.senderId?.name}
              </div>

              <div className="text-xs text-gray-400">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </div>

              {/* CONTENT */}
              <div className="mt-1">
                {type === "text" && (
                  <div className="px-3 py-2 rounded-xl bg-[var(--bg-secondary)]">
                    {msg.content}
                  </div>
                )}

                {type === "image" && (
                  <img
                    src={url}
                    alt="img"
                    className="max-w-xs rounded-xl mt-1"
                  />
                )}

                {type === "video" && (
                  <video
                    src={url}
                    controls
                    className="max-w-xs rounded-xl mt-1"
                  />
                )}

                {type === "audio" && (
                  <audio src={url} controls className="mt-1" />
                )}

                {type === "file" && (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded bg-[var(--bg-secondary)]"
                  >
                    <span>{getFileIcon(msg.fileName)}</span>
                    <span>{msg.fileName || "File"}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* MENU */}
      {menu && (
        <div
          className="fixed z-50 bg-[var(--bg-secondary)] border p-2 rounded"
          style={{ top: menu.y, left: menu.x }}
        >
          <button onClick={() => deleteMessage(menu.messageId)}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageList;