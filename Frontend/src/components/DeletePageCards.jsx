import React, { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import DeleteConfirmModal from "./DeleteConfirmModal";

const DeletePageCards = ({ workspace, onDelete }) => {
  const ws = workspace.workspaceId;

  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await onDelete(ws._id);
      setOpenModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🔥 CARD */}
      <div
        className="group relative overflow-hidden 
                   rounded-2xl 
                   bg-[var(--bg-secondary)] 
                   border border-[var(--border)] 
                   shadow-sm 
                   transform-gpu
                   transition-transform duration-500 ease-out
                   hover:-translate-y-1.5 hover:scale-[1.01]"
      >

        {/* IMAGE */}
        <div className="relative h-36 overflow-hidden">

          <img
            src={ws?.coverImage}
            alt="workspace"
            className="w-full h-full object-cover 
                       transition-transform duration-700 ease-out 
                       group-hover:scale-105"
          />

          <div className="absolute inset-0 
                          bg-gradient-to-t 
                          from-black/70 via-black/20 to-transparent" />

          <div className="absolute top-2 right-2 flex items-center gap-1 
                          bg-red-500/10 
                          border border-red-500/30 
                          px-2 py-0.5 rounded-full 
                          text-[10px] text-red-400">
            <AlertTriangle size={11} />
            Risk
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-4">

          <h3 className="text-sm uppercase font-semibold 
                         text-[var(--text-primary)] 
                         group-hover:text-red-400 transition">
            {ws?.name}
          </h3>

          <p className="text-xs uppercase text-[var(--text-secondary)] mt-0.5">
            {workspace.role}
          </p>

          <div className="flex items-center gap-1 mt-2 text-[11px] text-red-400">
            <AlertTriangle size={12} />
            <span>This action is irreversible</span>
          </div>

          {/* 🔥 DELETE BUTTON */}
          <button
            onClick={() => setOpenModal(true)}
            className="mt-3 w-full flex items-center justify-center gap-2 
                       text-xs font-medium py-2 rounded-lg 
                       bg-red-500/10 
                       text-red-400 
                       border border-red-500/20
                       hover:bg-red-500 
                       hover:text-white 
                       transition-all duration-300"
          >
            <Trash2 size={14} />
            Delete
          </button>

        </div>

        {/* GLOW */}
        <div className="absolute inset-0 opacity-0 
                        group-hover:opacity-100 
                        transition duration-500 
                        bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.15),transparent_70%)] 
                        pointer-events-none" />
      </div>

      {/* 🔥 MODAL */}
      {openModal && (
        <DeleteConfirmModal
          onClose={() => setOpenModal(false)}
          onConfirm={handleDelete}
          loading={loading}
        />
      )}
    </>
  );
};

export default DeletePageCards;