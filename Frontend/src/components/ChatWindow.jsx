import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import PlanErrorModal from "./PlanErrorModal";
import { useChatContext } from "../context/ChatContext";
import { useChat } from "../hooks/useChat";
import { useChatrooms } from "../hooks/useChatrooms";
import { Video, UserPlus } from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getWorkspaceById } from "../api/workspace.api";
import { getAllDepartmentMembers } from "../api/department.api"; // 🔥 FIX
import { PLANS } from "../constants/plans";

const ChatWindow = () => {
  const { activeChatRoom } = useChatContext();
  const { workspaceId } = useParams();

  const chat = useChat(activeChatRoom?._id);
  const { rooms, addMembers } = useChatrooms();

  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);

  /* 🔥 ADD MEMBER STATE */
  const [openMemberModal, setOpenMemberModal] = useState(false);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  /* ================= FETCH WORKSPACE ================= */
  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        const res = await getWorkspaceById(workspaceId);
        setWorkspace(res.workspace);
      } catch (err) {
        chat.setErrorModal({
          open: true,
          message: "Failed to load workspace",
        });
      } finally {
        setLoading(false);
      }
    };

    if (workspaceId) fetchWorkspace();
  }, [workspaceId]);

// ONLY FIXED PARTS — baaki same hai

/* ================= FETCH MEMBERS ================= */
const loadMembers = async () => {
  try {
    setLoadingMembers(true);

    console.log("=================================");
    console.log("🔥 CLICKED ADD MEMBER");

    console.log("👉 workspaceId:", workspaceId);
    console.log("👉 activeChatRoom:", activeChatRoom);

    const departmentId =
      activeChatRoom?.departmentId?._id ||
      activeChatRoom?.departmentId;

    console.log("👉 extracted departmentId:", departmentId);

    if (!departmentId) {
      console.log("❌ departmentId missing BROOOO");
      setMembers([]);
      return;
    }

    console.log("📡 CALLING API...");

    const res = await getAllDepartmentMembers(
      workspaceId,
      departmentId
    );

    console.log("✅ API RESPONSE FULL:", res);
    console.log("👉 res.members:", res?.members);
    console.log("👉 isArray:", Array.isArray(res?.members));

    const finalMembers = Array.isArray(res?.members)
      ? res.members
      : [];

    console.log("🔥 FINAL MEMBERS:", finalMembers);

    setMembers(finalMembers);

  } catch (err) {
    console.log("💥 ERROR IN LOAD MEMBERS:", err);

    chat.setErrorModal({
      open: true,
      message: "Failed to load members",
    });
  } finally {
    setLoadingMembers(false);
  }
};

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm">
        Loading workspace...
      </div>
    );
  }

  if (!activeChatRoom) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm">
        Select a chatroom
      </div>
    );
  }

  /* ================= PLAN ================= */
  const planKey = workspace?.plan?.toLowerCase() || "individual";
  const features = PLANS[planKey]?.features || {};
  const canVideoCall = features.videoCall;

  /* ================= MEMBER COUNT ================= */
  const currentRoom = rooms.find(
    (r) => r._id === activeChatRoom._id
  );

  const memberCount = currentRoom?.memberCount || 0;

  /* ================= VIDEO ================= */
  const handleVideoCall = () => {
    if (!canVideoCall) {
      chat.setErrorModal({
        open: true,
        message:
          "Video calls are not available in your plan. Ask your admin to upgrade.",
      });
      return;
    }

    window.open(`/video/${activeChatRoom._id}`, "_blank");
  };

  /* ================= ADD MEMBER ================= */
  const handleOpenMemberModal = () => {
    setOpenMemberModal(true);
    loadMembers();
  };

  const handleAddMember = async (userId) => {
    await addMembers(activeChatRoom._id, [userId]);
  };

  return (
    <div className="flex-1 h-full flex flex-col">

      {/* HEADER */}
      <div
        className="px-6 py-4 border-b flex items-center justify-between relative"
        style={{
          borderColor: "var(--border)",
          background: "var(--bg-secondary)",
        }}
      >
        <div
          className="absolute bottom-0 left-0 w-full h-[1px]"
          style={{
            background:
              "linear-gradient(to right, transparent, var(--accent), transparent)",
            opacity: 0.4,
          }}
        />

        {/* LEFT */}
        <div className="flex flex-col">
          <h1 className="text-sm font-semibold flex items-center gap-2">
            <span style={{ color: "var(--accent)" }}>#</span>
            {activeChatRoom.name}
          </h1>

          <p
            className="text-xs mt-1 flex items-center gap-2"
            style={{ color: "var(--text-secondary)" }}
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            {memberCount} members
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">

          {/* ADD MEMBER */}
          <button
            onClick={handleOpenMemberModal}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
            style={{
              background: "var(--bg-hover)",
              border: "1px solid var(--border)",
            }}
          >
            <UserPlus size={16} />
          </button>

          {/* VIDEO */}
          <button
            onClick={handleVideoCall}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition"
            style={{
              background: canVideoCall
                ? "var(--bg-hover)"
                : "rgba(255,255,255,0.05)",
              border: "1px solid var(--border)",
              color: canVideoCall
                ? "var(--text-primary)"
                : "gray",
              opacity: canVideoCall ? 1 : 0.6,
            }}
          >
            <Video size={16} style={{ color: "var(--accent)" }} />
            Start Call
          </button>
        </div>
      </div>

      {/* BODY */}
      <MessageList chat={chat} workspace={workspace} />
      <MessageInput chat={chat} workspace={workspace} />

      {/* MEMBER MODAL */}
      {openMemberModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="w-[400px] max-h-[500px] overflow-y-auto p-5 rounded-2xl"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            <h2 className="text-sm font-semibold mb-4">
              Add Members
            </h2>

            {loadingMembers ? (
              <div className="text-sm">Loading...</div>
            ) : (
              (Array.isArray(members) ? members : []).map((m) => {
                const alreadyAdded =
  activeChatRoom.members?.some(
    (id) => id === m._id || id?._id === m._id
  );

                return (
                  <div
                    key={m._id}
                    className="flex items-center justify-between mb-2"
                  >
                    <span className="text-sm">{m.name}</span>

                    <button
                      disabled={alreadyAdded}
                      onClick={() => handleAddMember(m._id)}
                      className="px-3 py-1 text-xs rounded"
                      style={{
                        background: alreadyAdded
                          ? "gray"
                          : "var(--accent)",
                        color: "white",
                        opacity: alreadyAdded ? 0.6 : 1,
                      }}
                    >
                      {alreadyAdded ? "Added" : "Add"}
                    </button>
                  </div>
                );
              })
            )}

            <button
              onClick={() => setOpenMemberModal(false)}
              className="mt-4 w-full py-2 rounded"
              style={{ background: "var(--bg-hover)" }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ERROR MODAL */}
      <PlanErrorModal
        open={chat.errorModal?.open}
        message={
          chat.errorModal?.message ||
          "This feature is not allowed in your plan."
        }
        onClose={() =>
          chat.setErrorModal({ open: false, message: "" })
        }
      />
    </div>
  );
};

export default ChatWindow;