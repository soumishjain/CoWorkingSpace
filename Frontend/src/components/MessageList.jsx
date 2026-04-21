import { useState, useRef, useEffect } from "react";
import { useChatrooms } from "../hooks/useChatrooms";
import { Reply, Pencil, Trash2 } from "lucide-react";
import { PLANS } from "../constants/plans"; // 🔥 ADD

const MessageList = ({ chat, workspace }) => {
  const {
    messages,
    deleteMessage,
    editMessage,
    setReplyingTo,
    loadMoreMessages,
    hasMore,
    loadingMore,
    setErrorModal,
  } = chat;

  const { role } = useChatrooms();

  /* 🔥 FINAL FIX */
  const planKey = workspace?.plan?.toLowerCase() || "individual";
  const features = PLANS[planKey]?.features || {};

  const [editingMessage, setEditingMessage] = useState(null);
  const [editText, setEditText] = useState("");

  const containerRef = useRef(null);
  const prevHeightRef = useRef(0);
  const loadingRef = useRef(false);

  const messageRefs = useRef({});

  // rest same code...

  /* ================= LOAD MORE ================= */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (el.scrollTop < 50 && hasMore && !loadingMore) {
        prevHeightRef.current = el.scrollHeight;
        loadingRef.current = true;
        loadMoreMessages();
      }
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [hasMore, loadingMore, loadMoreMessages]);

  /* ================= SCROLL FIX ================= */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (loadingRef.current) {
      const diff = el.scrollHeight - prevHeightRef.current;
      el.scrollTop += diff;
      loadingRef.current = false;
      return;
    }

    const isNearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 80;

    if (isNearBottom) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  /* ================= SCROLL TO MESSAGE ================= */
  const scrollToMessage = (id) => {
    const el = messageRefs.current[id];
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    el.style.transition = "all 0.3s ease";
    el.style.background = "rgba(255,106,0,0.15)";

    setTimeout(() => {
      el.style.background = "transparent";
    }, 1500);
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const getFileIcon = (name = "") => {
    if (name.endsWith(".pdf")) return "📕";
    if (name.endsWith(".doc") || name.endsWith(".docx")) return "📄";
    if (name.endsWith(".xls")) return "📊";
    return "📁";
  };

  /* ================= REPLY ================= */
  const handleReply = (msg) => {
    if (!features.replyMessage) {
      setErrorModal({
        open: true,
        message:
          "Reply feature is not available in your plan. Ask your admin to upgrade.",
      });
      return;
    }
    setReplyingTo(msg);
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-6 py-4 space-y-6"
    >
      {loadingMore && (
        <div className="text-center text-xs opacity-60">
          Loading...
        </div>
      )}

      {messages.map((msg) => {
        const senderRole = msg.senderId?.role || role;
        const isPrivileged =
          senderRole === "admin" || senderRole === "manager";

        const isReply = msg.replyTo && typeof msg.replyTo === "object";

        return (
          <div
            key={msg._id}
            ref={(el) => (messageRefs.current[msg._id] = el)}
            className="flex gap-3 items-start group"
          >
            {/* AVATAR */}
            <div className="w-9 h-9 rounded-full bg-[var(--bg-hover)] flex items-center justify-center text-sm font-medium shrink-0">
              {msg.senderId?.name?.[0]}
            </div>

            <div className="max-w-[70%] w-full relative">

              {/* HEADER */}
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">
                  {msg.senderId?.name}
                </span>

                {isPrivileged && (
                  <span
                    className="text-[10px] px-2 py-[2px] rounded-full"
                    style={{
                      background: "var(--accent)",
                      color: "white",
                    }}
                  >
                    {senderRole}
                  </span>
                )}

                <span className="text-xs opacity-60 ml-2">
                  {formatTime(msg.createdAt)}
                </span>
              </div>

              {/* ACTIONS */}
              <div className="absolute -right-12 top-0 opacity-0 group-hover:opacity-100 flex gap-2">
                
                {/* REPLY */}
                <button
                  onClick={() => handleReply(msg)}
                  className="p-1 rounded hover:bg-[var(--bg-hover)]"
                >
                  <Reply size={14} />
                </button>

                {/* EDIT */}
                {features.editMessage && (
                  <button
                    onClick={() => {
                      setEditingMessage(msg._id);
                      setEditText(msg.content);
                    }}
                    className="p-1 rounded hover:bg-[var(--bg-hover)]"
                  >
                    <Pencil size={14} />
                  </button>
                )}

                {/* DELETE */}
                {features.deleteMessage && (
                  <button
                    onClick={() => deleteMessage(msg._id)}
                    className="p-1 rounded hover:bg-[var(--bg-hover)] text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              {/* REPLY PREVIEW */}
              {isReply && (
                <div
                  onClick={() => scrollToMessage(msg.replyTo?._id)}
                  className="mt-1 pl-3 text-xs cursor-pointer hover:opacity-80"
                  style={{
                    borderLeft: "2px solid var(--accent)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <span style={{ color: "var(--accent)" }}>
                    {msg.replyTo.senderId?.name}
                  </span>
                  : {msg.replyTo.content}
                </div>
              )}

              {/* CONTENT */}
              <div className="mt-1">
                {editingMessage === msg._id ? (
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="input"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        editMessage(msg._id, editText);
                        setEditingMessage(null);
                      }
                    }}
                  />
                ) : (
                  <div
                    className="px-4 py-2 rounded-2xl text-sm break-words whitespace-pre-wrap"
                    style={{ background: "var(--bg-secondary)" }}
                  >
                    {msg.type === "image" ? (
                      <img
                        src={msg.content}
                        alt="chat"
                        className="max-w-full rounded-xl"
                      />
                    ) : msg.type === "file" ? (
                      <a
                        href={msg.content}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl"
                        style={{ background: "var(--bg-hover)" }}
                      >
                        <div className="text-2xl">
                          {getFileIcon(msg.fileName)}
                        </div>

                        <div className="flex flex-col text-xs">
                          <span className="font-medium">
                            {msg.fileName || "File"}
                          </span>
                          <span style={{ color: "var(--text-secondary)" }}>
                            Click to download
                          </span>
                        </div>
                      </a>
                    ) : (
                      msg.content
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;