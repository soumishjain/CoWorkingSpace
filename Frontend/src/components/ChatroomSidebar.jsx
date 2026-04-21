import { useNavigate, useParams } from "react-router-dom";
import { useChatrooms } from "../hooks/useChatrooms";
import { useChatContext } from "../context/ChatContext";
import { useState } from "react";
import DeleteChatroomConfirmModal from "../components/DeleteChatroomConfirmModal";

const ChatroomSidebar = () => {
  const {
    rooms,
    plan,
    role,
    loading,
    createRoom,
    deleteRoom,
  } = useChatrooms();

  const { activeChatRoom, setActiveChatRoom } = useChatContext();

  const navigate = useNavigate();
  const { workspaceId, departmentId, chatRoomId } = useParams();

  const [openModal, setOpenModal] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [creating, setCreating] = useState(false);

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    roomId: null,
    roomName: "",
  });
  const [deleting, setDeleting] = useState(false);

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
      style={{ background: "var(--bg-secondary)" }}
    >
      {/* HEADER */}
      <div className="px-5 py-4 text-sm font-semibold flex items-center justify-between">
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
            chatRoomId === room._id ||
            activeChatRoom?._id === room._id;

          return (
            <div
              key={room._id}
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
              {/* LEFT */}
              <div
                onClick={() => handleSelectRoom(room)}
                className="flex items-center gap-2 flex-1"
              >
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
              <div className="flex items-center gap-2">
                <span
                  className="text-xs opacity-0 group-hover:opacity-100 transition"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {room.memberCount || 0}
                </span>

                {(role === "admin" || role === "manager") && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteModal({
                        open: true,
                        roomId: room._id,
                        roomName: room.name,
                      });
                    }}
                    className="opacity-0 group-hover:opacity-100 transition p-1 rounded hover:bg-[var(--bg-hover)] text-red-400"
                  >
                    🗑
                  </button>
                )}
              </div>
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
          className="w-full py-2 rounded-xl text-sm"
          style={{ background: "var(--bg-hover)" }}
        >
          ← Back
        </button>

        {(role === "admin" || role === "manager") && (
          <button
            onClick={() => {
              const maxRooms =
                plan?.limits?.chatroomsPerDepartment || Infinity;

              if (rooms.length >= maxRooms) {
                setErrorModal({
                  open: true,
                  message: `You can only create ${maxRooms} chat rooms`,
                });
                return;
              }

              setOpenModal(true);
            }}
            className="w-full py-2 rounded-xl text-sm font-medium"
            style={{
              background:
                "linear-gradient(135deg, var(--accent), var(--accent-soft))",
              color: "white",
            }}
          >
            + Create Room
          </button>
        )}
      </div>

      {/* CREATE MODAL */}
     {openModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    
    {/* 🔥 BACKDROP */}
    <div
      className="absolute inset-0 backdrop-blur-sm"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={() => setOpenModal(false)}
    />

    {/* 🔥 MODAL */}
    <div
      className="relative w-[380px] rounded-2xl p-6 flex flex-col animate-slide"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
      }}
    >
      
      {/* HEADER */}
      <div className="mb-5">
        <h2 className="text-base font-semibold">
          Create Chat Room
        </h2>
        <p className="text-xs text-muted mt-1">
          Start a new conversation space
        </p>
      </div>

      {/* INPUT */}
      <div className="relative mb-5">
        <input
          className="input w-full pr-10"
          placeholder="e.g. design-team, backend, general..."
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />

        {/* HASH ICON */}
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
          style={{ color: "var(--accent)" }}
        >
          #
        </span>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3">
        
        <button
          onClick={() => setOpenModal(false)}
          className="flex-1 py-2 rounded-xl text-sm transition"
          style={{
            background: "var(--bg-hover)",
            border: "1px solid var(--border)",
          }}
        >
          Cancel
        </button>

        <button
          onClick={handleCreateRoom}
          disabled={creating}
          className="flex-1 py-2 rounded-xl text-sm text-white transition"
          style={{
            background: creating
              ? "var(--accent-soft)"
              : "var(--accent)",
            boxShadow: "0 0 0 2px var(--accent-glow)",
            opacity: creating ? 0.7 : 1,
          }}
        >
          {creating ? "Creating..." : "Create"}
        </button>
      </div>

      {/* FOOTER HINT */}
      <p className="text-[11px] text-muted mt-4 text-center">
        Room names should be simple and lowercase
      </p>
    </div>
  </div>
)}

      {/* DELETE MODAL */}
      <DeleteChatroomConfirmModal
        open={deleteModal.open}
        onClose={() =>
          setDeleteModal({
            open: false,
            roomId: null,
            roomName: "",
          })
        }
        message={`Delete #${deleteModal.roomName}?`}
        loading={deleting}
        onConfirm={async () => {
          try {
            setDeleting(true);
            await deleteRoom(deleteModal.roomId);
            setDeleteModal({
              open: false,
              roomId: null,
              roomName: "",
            });
          } finally {
            setDeleting(false);
          }
        }}
      />

      {/* ERROR MODAL */}
      {errorModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="w-[320px] p-5 rounded-2xl text-center"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            <p className="text-sm mb-4">{errorModal.message}</p>
            <button
              onClick={() =>
                setErrorModal({ open: false, message: "" })
              }
              className="w-full py-2 rounded text-white"
              style={{ background: "var(--accent)" }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatroomSidebar;



