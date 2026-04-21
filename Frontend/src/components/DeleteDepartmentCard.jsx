import React from "react";
import { Trash2, Lock, AlertTriangle } from "lucide-react";

const DeleteDepartmentCard = ({ department, onDelete }) => {

  const isGeneral = department.name?.toLowerCase() === "general";

  return (
    <div
      className="group relative overflow-hidden 
                 rounded-2xl p-5
                 bg-[var(--bg-secondary)]/70 
                 backdrop-blur-xl 
                 border border-[var(--border)] 
                 shadow-sm
                 transition-all duration-500 ease-out
                 hover:-translate-y-2 hover:scale-[1.02]
                 hover:shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
    >

      {/* 🔥 RED GLOW */}
      <div className="absolute inset-0 opacity-0 
                      group-hover:opacity-100 
                      transition duration-500 
                      bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.18),transparent_70%)]" />

      {/* HEADER */}
      <div className="relative flex items-start justify-between">

        <div>
          <div className="flex items-center gap-2">

            <h3 className="text-base font-semibold 
                           text-[var(--text-primary)] 
                           group-hover:text-red-400 transition">
              {department.name}
            </h3>

            {/* 🔒 DEFAULT */}
            {isGeneral && (
              <span className="flex items-center gap-1 text-[10px] 
                               px-2 py-0.5 rounded-full 
                               bg-[var(--bg-hover)] 
                               border border-[var(--border)] 
                               text-[var(--text-secondary)]">
                <Lock size={10} />
                Default
              </span>
            )}
          </div>

          <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">
            {department.description || "No description provided"}
          </p>
        </div>

        {/* ICON */}
        <div
          className={`p-2 rounded-xl border transition ${
            isGeneral
              ? "bg-[var(--bg-hover)] text-[var(--text-secondary)] border-[var(--border)]"
              : "bg-red-500/10 text-red-400 border-red-500/20 group-hover:bg-red-500 group-hover:text-white"
          }`}
        >
          <Trash2 size={16} />
        </div>
      </div>

      {/* 🔥 GENERAL MESSAGE */}
      {isGeneral && (
        <div className="mt-4 flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <Lock size={12} />
          This is the default department and cannot be deleted
        </div>
      )}

      {/* 🔥 DELETE FLOW */}
      {!isGeneral && (
        <>
          {/* WARNING */}
          <div className="mt-4 flex items-center gap-2 text-xs text-red-400">
            <AlertTriangle size={12} />
            This action is irreversible
          </div>

          {/* BUTTON */}
          <button
            onClick={() => onDelete(department._id)}
            className="mt-4 w-full flex items-center justify-center gap-2 
                       text-sm font-medium py-2.5 rounded-xl 
                       bg-red-500/10 
                       text-red-400 
                       border border-red-500/20
                       hover:bg-red-500 
                       hover:text-white 
                       hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]
                       active:scale-95 
                       transition-all duration-300"
          >
            <Trash2 size={14} />
            Delete Department
          </button>
        </>
      )}

    </div>
  );
};

export default DeleteDepartmentCard;