import React from "react";
import { Trash2, AlertTriangle } from "lucide-react";

const DeletePageCards = ({ workspace, onDelete }) => {
  const ws = workspace.workspaceId;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-red-300">

      {/* 🔥 Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={ws?.coverImage}
          alt="workspace"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* warning badge */}
        <div className="absolute top-3 right-3 bg-red-500/90 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
          <AlertTriangle size={12} />
          Danger
        </div>
      </div>

      {/* 🔥 Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition">
          {ws?.name}
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          Role: <span className="font-medium">{workspace.role}</span>
        </p>

        {/* subtle warning */}
        <p className="text-xs text-red-500 mt-2">
          This action cannot be undone
        </p>

        {/* 🔥 Delete Button */}
        <button
          onClick={() => onDelete(ws._id)}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-red-500 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-red-600 transition active:scale-[0.98]"
        >
          <Trash2 size={16} />
          Delete Workspace
        </button>
      </div>

      {/* 🔥 Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-red-100/20 pointer-events-none" />
    </div>
  );
};

export default DeletePageCards;