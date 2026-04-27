import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import PlanErrorModal from "./PlanErrorModal";
import { useChatContext } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../hooks/useChat";
import { useChatrooms } from "../hooks/useChatrooms";
import { Video, UserPlus } from "lucide-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getWorkspaceById } from "../api/workspace.api";
import { getAllDepartmentMembers } from "../api/department.api"; // 🔥 FIX
import { PLANS } from "../constants/plans";
import AddMembersModal from "./AddMembersModal";
import { socket } from "../socket";
import toast from "react-hot-toast";

const ChatWindow = () => {
  const { activeChatRoom } = useChatContext();
  const { workspaceId } = useParams();
  const { user } = useAuth();

  const chat = useChat(activeChatRoom?._id);
  const { rooms, addMembers, removeMembers } = useChatrooms();

  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);

  /* 🔥 ADD MEMBER STATE */
  const [openMemberModal, setOpenMemberModal] = useState(false);
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [allowed , setAllowed] = useState(false) // For checking if user can add members based on role and plan

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

  /* ================= VIDEO CALL LISTENER ================= */
  useEffect(() => {
    socket.on("video_call_initiated", (data) => {
      toast((t) => (
        <div className="flex flex-col gap-2">
          <p className="font-semibold text-sm">📞 {data.callerName} is calling</p>
          <p className="text-xs opacity-75">in #{data.chatRoomName}</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                window.open(data.callUrl, "_blank");
                toast.dismiss(t.id);
              }}
              className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs font-medium transition"
            >
              Join Call
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-xs font-medium transition"
            >
              Dismiss
            </button>
          </div>
        </div>
      ), {
        duration: 15000,
      });
    });

    return () => socket.off("video_call_initiated");
  }, []);

  

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

  // All hooks must be called before any conditional returns
  // Move all conditional logic to the end

  /* ================= PLAN ================= */
  const planKey = workspace?.plan?.toLowerCase() || "individual";
  const features = PLANS[planKey]?.features || {};
  const canVideoCall = features.videoCall;

  /* ================= MEMBER COUNT ================= */
  const currentRoom = rooms.find(
    (r) => r._id === activeChatRoom?._id
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

    // 🔥 EMIT VIDEO CALL EVENT TO NOTIFY OTHER MEMBERS
    socket.emit("initiate_video_call", {
      chatRoomId: activeChatRoom._id,
      chatRoomName: activeChatRoom.name,
    });

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

  useEffect(() => {
    if (!activeChatRoom || !user) {
      setAllowed(false);
      return;
    }

    // Check if user is a member of this chatroom
    const isMember = activeChatRoom.members?.some((memberId) =>
      memberId.toString() === user?._id?.toString()
    );

    setAllowed(isMember || false);
  }, [activeChatRoom, user]);

  // All hooks must be called before any conditional returns
  // Move the conditional return to the end

  return (
    <div className="flex-1 h-full flex flex-col">
      {allowed ? (
        <>
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
          <AddMembersModal
            open={openMemberModal}
            onClose={() => setOpenMemberModal(false)}
            members={members}
            loadingMembers={loadingMembers}
            activeChatRoom={activeChatRoom}
            onAddMember={handleAddMember}
            onRemoveMember={(userId) =>
              removeMembers(activeChatRoom._id, userId)
            }
          />

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
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm">
          You must be a member of this department to view the chat.
        </div>
      )}
    </div>
  );
};

export default ChatWindow;