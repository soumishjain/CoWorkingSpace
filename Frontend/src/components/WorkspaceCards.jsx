import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const WorkspaceCards = ({ workspace }) => {
  const navigate = useNavigate();
  const ws = workspace.workspaceId;

  const handleOpen = () => {
    navigate(`/dashboard/workspace/${ws._id}`);
  };

  return (
    <div
      onClick={handleOpen}
      className="group relative bg-white/70 backdrop-blur-lg border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
    >

      {/* 🔥 Glow hover effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10" />

      {/* Image */}
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={ws?.coverImage}
          alt="workspace"
          className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition" />
      </div>

      {/* Info */}
      <div className="mt-4 space-y-1 relative z-10">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition">
          {ws?.name}
        </h3>

        <p className="text-xs text-gray-500 tracking-wide">
          Role: <span className="font-medium text-gray-700">{workspace.role}</span>
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 relative z-10">

        {/* Status */}
        <span className="text-[10px] px-3 py-1 rounded-full bg-green-100 text-green-600 font-medium">
          Active
        </span>

        {/* Open button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
          className="flex items-center gap-1 text-sm font-medium text-indigo-600 group-hover:gap-2 transition-all"
        >
          Open
          <ArrowUpRight size={16} />
        </button>

      </div>
    </div>
  );
};

export default WorkspaceCards;