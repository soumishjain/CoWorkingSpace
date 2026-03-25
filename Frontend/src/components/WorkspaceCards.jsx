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
      className="group relative cursor-pointer transition-all duration-300"
    >

      {/* 🔥 CARD */}
      <div className="relative rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

        {/* IMAGE */}
        <div className="relative h-44 overflow-hidden">
          <img
            src={ws?.coverImage}
            alt="workspace"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* 🔥 GRADIENT OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

          {/* ROLE BADGE */}
          <span className="absolute top-3 uppercase left-3 text-[10px] px-2.5 py-1 rounded-full bg-white/90 text-gray-700 font-medium shadow">
            {workspace.role}
          </span>

          {/* OPEN BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpen();
            }}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur p-2 rounded-lg shadow hover:scale-110 transition"
          >
            <ArrowUpRight size={14} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-4">

          <h3 className="text-base uppercase font-semibold text-gray-900 group-hover:text-indigo-600 transition">
            {ws?.name}
          </h3>

          <p className="text-xs text-gray-500 mt-1">
            {ws?.description || "Workspace Dashboard"}
          </p>

          {/* FOOTER */}
          <div className="flex items-center justify-between mt-4">

            {/* STATUS */}
            <span className="text-[10px] px-3 py-1 rounded-full bg-green-100 text-green-600 font-medium">
              ● Active
            </span>

            {/* CTA */}
            <div className="flex items-center gap-1 text-sm font-medium text-indigo-600 group-hover:gap-2 transition-all">
              Open
              <ArrowUpRight size={16} />
            </div>

          </div>

        </div>

        {/* 🔥 HOVER LIGHT */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5" />

      </div>
    </div>
  );
};

export default WorkspaceCards;