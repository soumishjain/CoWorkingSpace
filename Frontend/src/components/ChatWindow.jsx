import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useChatContext } from "../context/ChatContext";

const ChatWindow = () => {
  const { activeChatRoom } = useChatContext();

  if (!activeChatRoom) {
    return (
      <div
        className="flex-1 h-full flex items-center justify-center text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        Select a chatroom
      </div>
    );
  }

  const handleVideoCall = () => {
    window.open(`/video/${activeChatRoom._id}`, "_blank");
  };

  return (
    <div className="flex-1 h-full flex flex-col">

      {/* 🔥 HEADER */}
      <div
        className="px-6 py-4 border-b flex items-center justify-between relative"
        style={{
          borderColor: "var(--border)",
          background: "var(--bg-secondary)",
        }}
      >
        {/* 🔥 GLOW LINE (premium feel) */}
        <div
          className="absolute bottom-0 left-0 w-full h-[1px]"
          style={{
            background: "linear-gradient(to right, transparent, var(--accent), transparent)",
            opacity: 0.4,
          }}
        />

        {/* LEFT */}
        <div className="flex flex-col">
          <h1 className="text-sm font-semibold tracking-wide flex items-center gap-2">
            <span style={{ color: "var(--accent)" }}>#</span>
            {activeChatRoom.name}
          </h1>

          <p
            className="text-xs mt-1 flex items-center gap-2"
            style={{ color: "var(--text-secondary)" }}
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            {activeChatRoom.members?.length || 0} members
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* 🔥 VIDEO BUTTON (SEXY) */}
          <button
            onClick={handleVideoCall}
            className="
              relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
              transition-all duration-300
              overflow-hidden
            "
            style={{
              background: "var(--bg-hover)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          >
            {/* glow background */}
            <span
              className="absolute inset-0 opacity-0"
              style={{
                background: "linear-gradient(120deg, transparent, var(--accent-glow), transparent)",
              }}
            />

            {/* icon */}
            <span
              className="text-base"
              style={{ color: "var(--accent)" }}
            >
              🎥
            </span>

            <span>Start Call</span>
          </button>

          {/* 🔥 SECONDARY ACTION */}
          {/* <button
            className="p-2 rounded-lg transition"
            style={{
              background: "var(--bg-hover)",
            }}
          >
            ⋮
          </button> */}
        </div>
      </div>

      {/* 🔥 MESSAGE LIST */}
      <MessageList chatRoomId={activeChatRoom._id} />

      {/* 🔥 INPUT */}
      <MessageInput chatRoomId={activeChatRoom._id} />
    </div>
  );
};

export default ChatWindow;