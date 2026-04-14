import { useNavigate, useParams } from "react-router-dom";
import { useChatrooms } from "../hooks/useChatrooms";
import { useChatContext } from "../context/ChatContext";

const ChatroomSidebar = () => {
  const { rooms, plan, role, loading, checkFeature } = useChatrooms();
  const { activeChatRoom, setActiveChatRoom } = useChatContext();

  const navigate = useNavigate();
  const { workspaceId, departmentId, chatRoomId } = useParams();

  if (loading) {
    return (
      <div className="w-72 h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const handleSelectRoom = (room) => {
    setActiveChatRoom(room);
    console.log(role);
    navigate(
      `/dashboard/workspace/${workspaceId}/department/${departmentId}/chat/${room._id}`
    );
  };

  return (
    <div
      className="w-full h-screen flex flex-col border-r relative"
      style={{
        borderColor: "var(--border)",
        background: "var(--bg-secondary)",
      }}
    >
      {/* 🔥 HEADER */}
      <div className="px-5 py-4 text-sm font-semibold tracking-wide flex items-center justify-between">
        <span>Chats</span>

        <span
          className="text-xs px-2 py-1 rounded-md"
          style={{
            background: "var(--bg-hover)",
            color: "var(--text-secondary)",
          }}
        >
          {rooms.length}
        </span>
      </div>

      {/* 🔥 GLOW DIVIDER */}
      <div
        className="h-[1px] mx-4 mb-2"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--accent), transparent)",
          opacity: 0.4,
        }}
      />

      {/* 🔥 ROOM LIST */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 hide-scrollbar">
        {rooms.map((room) => {
          const isActive =
            chatRoomId === room._id || activeChatRoom?._id === room._id;

          return (
            <div
              key={room._id}
              onClick={() => handleSelectRoom(room)}
              className={`
                group px-3 py-2 rounded-xl text-sm cursor-pointer flex justify-between items-center
                transition-all duration-200
              `}
              style={{
                background: isActive
                  ? "var(--bg-hover)"
                  : "transparent",
                border: isActive
                  ? "1px solid var(--border)"
                  : "1px solid transparent",
              }}
            >
              {/* LEFT */}
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold"
                  style={{
                    color: isActive
                      ? "var(--accent)"
                      : "var(--text-secondary)",
                  }}
                >
                  #
                </span>

                <span>{room.name}</span>
              </div>

              {/* RIGHT */}
              <span
                className="text-xs opacity-0 group-hover:opacity-100 transition"
                style={{ color: "var(--text-secondary)" }}
              >
                {room.memberCount || 0}
              </span>
            </div>
          );
        })}
      </div>

      {/* 🔥 BOTTOM PANEL */}
      <div
        className="p-3 border-t space-y-2"
        style={{ borderColor: "var(--border)" }}
      >
        {/* BACK */}
        <button
          onClick={() =>
            navigate(
              `/dashboard/workspace/${workspaceId}/department/${departmentId}`
            )
          }
          className="
            w-full py-2 rounded-xl text-sm transition
            hover:scale-[1.02] active:scale-[0.97]
          "
          style={{
            background: "var(--bg-hover)",
          }}
        >
          ← Back
        </button>

        {(role === "admin" || role === "manager") && (
          <>
            {/* CREATE ROOM */}
            <button
              onClick={() => {
                if (!checkFeature(plan?.features?.createChatRoom)) return;
                console.log("open create room modal");
              }}
              className="
                w-full py-2 rounded-xl text-sm font-medium
                transition-all duration-200
                hover:scale-[1.02] active:scale-[0.97]
              "
              style={{
                background: "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                color: "white",
              }}
            >
              + Create Room
            </button>

            {/* ADD MEMBER */}
            <button
              onClick={() => {
                if (!checkFeature(plan?.features?.addMember)) return;
                console.log("open add member modal");
              }}
              className="
                w-full py-2 rounded-xl text-sm transition
                hover:scale-[1.02] active:scale-[0.97]
              "
              style={{
                background: "var(--bg-hover)",
              }}
            >
              Add Member
            </button>
          </>
        )}

        {/* MEMBER NOTE */}
        {role === "member" && (
          <div
            className="text-xs text-center mt-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Limited access
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatroomSidebar;