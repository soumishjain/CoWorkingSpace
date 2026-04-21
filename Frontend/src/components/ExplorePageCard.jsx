import { Users } from "lucide-react";
import { useJoinWorkspace } from "../hooks/useJoinWorkspace";
import { useJoinWorkspaceState } from "../state/useJoinWorkspaceState";

const ExplorePageCard = ({
  workspace,
  setWorkspaces,
  setSearchResults,
}) => {
  const state = useJoinWorkspaceState();
  const { join } = useJoinWorkspace(state);

  const { loading } = state;

  // 🔥 DISABLE CONDITIONS
  const isDisabled =
    loading ||
    workspace.requestStatus === "pending" ||
    workspace.isJoined;

  const handleJoin = async () => {
    if (isDisabled) return; // 🔥 safety

    try {
      await join(workspace._id, workspace.joinPassword || "");

      setWorkspaces((prev) =>
        prev.map((ws) =>
          ws._id === workspace._id
            ? { ...ws, requestStatus: "pending" }
            : ws
        )
      );

      setSearchResults((prev) =>
        prev.map((ws) =>
          ws._id === workspace._id
            ? { ...ws, requestStatus: "pending" }
            : ws
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="group relative cursor-pointer 
                 rounded-2xl overflow-hidden 
                 bg-[var(--bg-secondary)] 
                 border border-[var(--border)] 
                 shadow-sm 
                 transform-gpu
                 transition-transform duration-500 ease-out
                 hover:-translate-y-2 hover:scale-[1.02]"
    >

      {/* 🔥 COVER */}
      <div className="h-28 w-full relative overflow-hidden">

        <img
          src={
            workspace.coverImage ||
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c"
          }
          alt="cover"
          className="w-full h-full object-cover 
                     transition-transform duration-700 ease-out 
                     group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-black/40" />

        <span className="absolute top-3 right-3 text-[10px] 
                         bg-[var(--bg-secondary)]/80 
                         border border-[var(--border)] 
                         text-[var(--accent)] 
                         px-2 py-1 rounded-full font-medium">
          Trending
        </span>
      </div>

      {/* 🔥 CONTENT */}
      <div className="p-5 relative">

        {/* AVATAR */}
        <div className="absolute -top-6 left-5 w-12 h-12 rounded-xl 
                        bg-[var(--bg-secondary)] 
                        border border-[var(--border)] 
                        shadow-md flex items-center justify-center 
                        text-lg font-semibold 
                        text-[var(--accent)]">
          {workspace.name?.[0] || "W"}
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold 
                         text-[var(--text-primary)] 
                         group-hover:text-[var(--accent)] 
                         transition">
            {workspace.name}
          </h3>

          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Created by {workspace.createdBy?.name || "Unknown"}
          </p>
        </div>

        <p className="text-sm text-[var(--text-secondary)] 
                      line-clamp-2 mt-3 mb-4 leading-relaxed">
          {workspace.description || "No description available"}
        </p>

        {/* 🔥 FOOTER */}
        <div className="flex justify-between items-center">

          <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
            <Users size={14} />
            <span>{workspace.memberCount || 0}</span>
          </div>

          {/* 🔥 BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleJoin();
            }}
            disabled={isDisabled}
            className={`text-xs font-medium px-4 py-1.5 rounded-lg 
              transition-all duration-300
              
              ${
                workspace.isJoined
                  ? "bg-green-500/10 text-green-400 border border-green-500/20 cursor-not-allowed"
                  : workspace.requestStatus === "pending"
                  ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 cursor-not-allowed"
                  : "bg-[var(--accent)] text-white hover:bg-[var(--accent-soft)] hover:shadow-[0_0_15px_var(--accent-glow)]"
              }
              
              ${isDisabled ? "opacity-70 cursor-not-allowed" : ""}
            `}
          >
            {loading
              ? "Sending..."
              : workspace.requestStatus === "pending"
              ? "Requested"
              : workspace.isJoined
              ? "Joined"
              : "Join"}
          </button>

        </div>
      </div>

      {/* 🔥 HOVER GLOW */}
      <div className="absolute inset-0 opacity-0 
                      group-hover:opacity-100 
                      transition duration-500 
                      bg-[radial-gradient(circle_at_top,rgba(255,106,0,0.15),transparent_70%)] 
                      pointer-events-none" />
    </div>
  );
};

export default ExplorePageCard;