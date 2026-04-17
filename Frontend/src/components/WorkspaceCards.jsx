import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useWorkspaceContext } from "../context/WorkspaceContext";

const WorkspaceCards = ({ workspace }) => {
  const navigate = useNavigate();
  const ws = workspace.workspaceId;

  const { setWorkspace } = useWorkspaceContext(); // 🔥 ADD


  const handleOpen = () => {
     console.log("🔥 CLICK WORKSPACE:", ws);

    // 🔥 IMPORTANT LINE
    setWorkspace(ws);
    navigate(`/dashboard/workspace/${ws._id}`);
  };

  return (
    <div
      onClick={handleOpen}
      className="group relative cursor-pointer"
    >

      {/* 🔥 CARD */}
      <div className="relative rounded-2xl overflow-hidden 
                bg-[var(--bg-secondary)]/70 
                backdrop-blur-xl 
                border border-[var(--border)] 
                shadow-sm 
                transform-gpu
                will-change-transform
                transition-[transform,box-shadow] 
                duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                hover:-translate-y-2 hover:scale-[1.02]
                hover:shadow-[0_25px_60px_rgba(0,0,0,0.45)]">

        {/* 🔥 IMAGE */}
        <div className="relative h-44 overflow-hidden">

          <img
            src={ws?.coverImage}
            alt="workspace"
           className="w-full h-full object-cover 
           transform-gpu
           transition-transform duration-700 
           ease-[cubic-bezier(0.22,1,0.36,1)]
           group-hover:scale-110"
          />

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 
                          bg-gradient-to-t 
                          from-black/60 via-black/20 to-transparent" />

          {/* 🔥 ROLE BADGE */}
          <span className="absolute top-3 left-3 text-[10px] uppercase 
                           px-2.5 py-1 rounded-full 
                           bg-[var(--bg-secondary)]/80 
                           backdrop-blur 
                           border border-[var(--border)] 
                           text-[var(--text-secondary)]">
            {workspace.role}
          </span>

          {/* 🔥 OPEN BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpen();
            }}
            className="absolute top-3 right-3 
                       bg-[var(--bg-secondary)]/80 
                       backdrop-blur 
                       border border-[var(--border)] 
                       p-2 rounded-lg 
                       text-[var(--text-primary)]
                       hover:bg-[var(--accent)] 
                       hover:text-white 
                       hover:scale-110 
                       hover:shadow-[0_0_15px_var(--accent-glow)] 
                      transition-transform duration-300 ease-out"
          >
            <ArrowUpRight size={14} />
          </button>

        </div>

        {/* 🔥 CONTENT */}
        <div className="p-4">

          <h3 className="text-base uppercase font-semibold 
                         text-[var(--text-primary)] 
                         group-hover:text-[var(--accent)] 
                         transition">
            {ws?.name}
          </h3>

          <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">
            {ws?.description || "Workspace Dashboard"}
          </p>

          {/* 🔥 FOOTER */}
          <div className="flex items-center justify-between mt-4">

            {/* STATUS */}
            <span className="text-[10px] px-3 py-1 rounded-full 
                             bg-green-500/10 
                             text-green-400 
                             border border-green-500/20 font-medium">
              ● Active
            </span>

            {/* CTA */}
            <div className="flex items-center gap-1 text-sm font-medium 
                            text-[var(--accent)] 
                            group-hover:gap-2 transition-all duration-300">
              Open
              <ArrowUpRight size={16} />
            </div>

          </div>

        </div>

        {/* 🔥 ORANGE GLOW ON HOVER */}
        <div className="absolute inset-0 opacity-0 
                        group-hover:opacity-100 
                        transition-opacity duration-500 ease-out
                        bg-[radial-gradient(circle_at_top,rgba(255,106,0,0.15),transparent_70%)]" />

      </div>
    </div>
  );
};

export default WorkspaceCards;