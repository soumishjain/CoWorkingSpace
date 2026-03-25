import React from "react";
import { Trash2, AlertTriangle } from "lucide-react";

const DeletePageCards = ({ workspace, onDelete }) => {
  const ws = workspace.workspaceId;

  return (
    <div className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-[2px]">

      {/* IMAGE */}
      <div className="relative h-36 overflow-hidden">
        <img
          src={ws?.coverImage}
          alt="workspace"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* BADGE */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 px-2 py-0.5 rounded-full text-[10px] font-medium text-red-500 border border-gray-200">
          <AlertTriangle size={11} />
          Risk
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4">

        <h3 className="text-sm uppercase font-semibold text-gray-900 group-hover:text-red-600 transition">
          {ws?.name}
        </h3>

        <p className="text-xs uppercase text-gray-500 mt-0.5">
          {workspace.role}
        </p>

        {/* WARNING INLINE */}
        <div className="flex items-center gap-1 mt-2 text-[11px] text-red-500">
          <AlertTriangle size={12} />
          <span>This action is irreversible</span>
        </div>

        {/* BUTTON */}
        <button
          onClick={() => onDelete(ws._id)}
          className="mt-3 w-full flex items-center justify-center gap-2 text-xs font-medium py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200"
        >
          <Trash2 size={14} />
          Delete
        </button>

      </div>

      {/* HOVER LIGHT */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-red-500/5 pointer-events-none" />

    </div>
  );
};

export default DeletePageCards;