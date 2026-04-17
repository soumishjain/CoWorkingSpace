import { useNavigate, useParams } from "react-router-dom";
import { useChatrooms } from "../hooks/useChatrooms";
import { useChatContext } from "../context/ChatContext";
import { useState } from "react";

const ChatroomSidebar = () => {
  const {
    rooms,
    plan,
    role,
    loading,
    createRoom,
  } = useChatrooms();

  const { activeChatRoom, setActiveChatRoom } = useChatContext();

  const navigate = useNavigate();
  const { workspaceId, departmentId, chatRoomId } = useParams();

  const [openModal, setOpenModal] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [creating, setCreating] = useState(false);

  /* 🔥 NEW ERROR MODAL */
  const [errorModal, setErrorModal] = useState({
    open: false,
    message: "",
  });

  if (loading) {
    return (
      <div className="w-72 h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const handleSelectRoom = (room) => {
    setActiveChatRoom(room);
    navigate(
      `/dashboard/workspace/${workspaceId}/department/${departmentId}/chat/${room._id}`
    );
  };

  /* ================= CREATE ROOM ================= */
  const handleCreateRoom = async () => {
    if (!roomName.trim()) return;

    try {
      setCreating(true);

      const res = await createRoom(roomName);

      if (!res?.success) {
        setErrorModal({
          open: true,
          message:
            res.error ||
            "Unable to create chat room. Please try again.",
        });
        return;
      }

      if (res?.chatRoom) {
        handleSelectRoom(res.chatRoom);
      }

      setRoomName("");
      setOpenModal(false);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div
      className="w-full border-[var(--border)] h-screen flex flex-col border-r relative"
      style={{
        background: "var(--bg-secondary)",
      }}
    >
      {/* HEADER */}
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

      {/* DIVIDER */}
      <div
        className="h-[1px] mx-4 mb-2"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--accent), transparent)",
          opacity: 0.4,
        }}
      />

      {/* ROOM LIST */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 hide-scrollbar">
        {rooms.map((room) => {
          const isActive =
            chatRoomId === room._id || activeChatRoom?._id === room._id;

          return (
            <div
              key={room._id}
              onClick={() => handleSelectRoom(room)}
              className="group px-3 py-2 rounded-xl text-sm cursor-pointer flex justify-between items-center transition-all duration-200"
              style={{
                background: isActive
                  ? "var(--bg-hover)"
                  : "transparent",
                border: isActive
                  ? "1px solid var(--border)"
                  : "1px solid transparent",
              }}
            >
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

      {/* BOTTOM */}
      <div
        className="p-3 border-t space-y-2"
        style={{ borderColor: "var(--border)" }}
      >
        <button
          onClick={() =>
            navigate(
              `/dashboard/workspace/${workspaceId}/department/${departmentId}`
            )
          }
          className="w-full py-2 rounded-xl text-sm transition hover:scale-[1.02] active:scale-[0.97]"
          style={{
            background: "var(--bg-hover)",
          }}
        >
          ← Back
        </button>

        {(role === "admin" || role === "manager") && (
          <>
            <button
              onClick={() => {
                const maxRooms =
                  plan?.limits?.chatroomsPerDepartment || Infinity;

                if (rooms.length >= maxRooms) {
                  setErrorModal({
                    open: true,
                    message: `You can only create ${maxRooms} chat rooms in your plan`,
                  });
                  return;
                }

                setOpenModal(true);
              }}
              className="w-full py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent), var(--accent-soft))",
                color: "white",
              }}
            >
              + Create Room
            </button>

            
          </>
        )}
      </div>

      {/* CREATE MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="w-[320px] p-5 rounded-2xl"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            <h2 className="text-sm font-semibold mb-3">
              Create Chat Room
            </h2>

            <input
              className="input w-full mb-4"
              placeholder="Enter room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />

            <div className="flex gap-2">
              <button
                onClick={() => setOpenModal(false)}
                className="flex-1 py-2 rounded"
                style={{ background: "var(--bg-hover)" }}
              >
                Cancel
              </button>

              <button
                onClick={handleCreateRoom}
                disabled={creating}
                className="flex-1 py-2 rounded text-white"
                style={{
                  background: "var(--accent)",
                  opacity: creating ? 0.6 : 1,
                }}
              >
                {creating ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 ERROR MODAL */}
      {errorModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="w-[320px] p-5 rounded-2xl text-center"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            <h2 className="text-sm font-semibold mb-3 text-red-400">
              Action Not Allowed
            </h2>

            <p className="text-xs mb-4 text-[var(--text-secondary)]">
              {errorModal.message}
            </p>

            <button
              onClick={() =>
                setErrorModal({ open: false, message: "" })
              }
              className="w-full py-2 rounded text-white"
              style={{ background: "var(--accent)" }}
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatroomSidebar;