import React, { useState } from "react";
import AssignManagerModal from "./AssignManagerModal";
import { Users, Lock } from "lucide-react";
import toast from "react-hot-toast";

const SmartDepartmentCard = ({
  department,
  isAdmin,
  onJoin,
  onLeave,
  onAssignManager,
  onOpenDepartment,
  workspaceId,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [reqSent, setReqSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const isMember = department.isMember;
  const isGeneral = department.name?.toLowerCase() === "general";

  return (
    <div
      className="group relative cursor-pointer 
                 rounded-2xl overflow-hidden 
                 bg-[var(--bg-secondary)]/70 
                 backdrop-blur-xl 
                 border border-[var(--border)] 
                 shadow-sm 
                 transition-all duration-500 
                 hover:-translate-y-2 hover:scale-[1.02]
                 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
    >

      {/* 🔥 ORANGE GLOW */}
      <div className="absolute inset-0 opacity-0 
                      group-hover:opacity-100 
                      transition duration-500 
                      bg-[radial-gradient(circle_at_top,rgba(255,106,0,0.18),transparent_70%)]" />

      {/* 🔥 CONTENT */}
      <div
        onClick={() => onOpenDepartment(department._id)}
        className="relative p-5"
      >

        {/* HEADER */}
        <div className="flex justify-between items-start">

          <div>
            <h3 className="text-base font-semibold 
                           text-[var(--text-primary)] 
                           group-hover:text-[var(--accent)] 
                           transition">
              {department.name}
            </h3>

            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Department
            </p>
          </div>

          {isGeneral && (
            <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full 
                             bg-[var(--bg-hover)] 
                             text-[var(--text-secondary)] 
                             border border-[var(--border)]">
              <Lock size={10} />
              Default
            </span>
          )}
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm text-[var(--text-secondary)] mt-3 leading-relaxed line-clamp-2">
          {department.description || "No description"}
        </p>

        {/* META */}
        <div className="flex items-center justify-between mt-4 text-xs text-[var(--text-secondary)]">

          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>{department.memberCount || 0} members</span>
          </div>

        </div>

        {/* MANAGER */}
        <div className="mt-5 flex items-center justify-between">

          <div className="flex items-center gap-3">

            {/* AVATAR STYLE */}
            <div className="w-10 h-10 rounded-xl 
                            bg-[var(--accent)]/15 
                            flex items-center justify-center 
                            text-sm font-semibold 
                            text-[var(--accent)]">
              {department.manager?.name
                ? department.manager.name.charAt(0).toUpperCase()
                : "?"}
            </div>

            <div>
              <p className="text-xs text-[var(--text-secondary)]">
                Manager
              </p>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {department.manager?.name || "Not assigned"}
              </p>
            </div>

          </div>

          {/* STATUS */}
          <span
            className={`text-[10px] px-3 py-1 rounded-full border ${
              department.manager
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
            }`}
          >
            {department.manager ? "Active" : "Pending"}
          </span>

        </div>

      </div>

      {/* 🔥 ACTIONS */}
      <div className="relative px-5 pb-5 flex gap-2">

        {isAdmin && !isGeneral && (
          <button
            onClick={() => setOpenModal(true)}
            className="flex-1 text-xs py-2 rounded-lg 
                       border border-[var(--border)] 
                       text-[var(--text-secondary)]
                       hover:border-[var(--accent)] 
                       hover:text-[var(--accent)] 
                       transition"
          >
            {department.manager ? "Change Manager" : "Assign Manager"}
          </button>
        )}

        {!isAdmin && !isMember && !isGeneral && (
          <button
            disabled={reqSent || loading}
            onClick={async (e) => {
              e.stopPropagation();
              try {
                setLoading(true);
                await onJoin(department._id);
                setReqSent(true);
                toast.success("Request sent");
              } catch {
                toast.error("Failed");
              } finally {
                setLoading(false);
              }
            }}
            className={`flex-1 text-xs py-2 rounded-lg text-white transition-all duration-300 ${
              reqSent
                ? "bg-gray-500"
                : loading
                ? "bg-[var(--accent-soft)]"
                : "bg-[var(--accent)] hover:bg-[var(--accent-soft)] hover:shadow-[0_0_15px_var(--accent-glow)]"
            }`}
          >
            {loading
              ? "Sending..."
              : reqSent
              ? "Requested"
              : "Join"}
          </button>
        )}

        {!isAdmin && isMember && !isGeneral && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLeave(department._id);
            }}
            className="flex-1 text-xs py-2 rounded-lg 
                       bg-red-500/10 text-red-400 
                       border border-red-500/20
                       hover:bg-red-500 hover:text-white 
                       hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] 
                       transition"
          >
            Leave
          </button>
        )}
      </div>

      {/* MODAL */}
      {openModal && !isGeneral && (
        <AssignManagerModal
          workspaceId={workspaceId}
          departmentId={department._id}
          onClose={() => setOpenModal(false)}
          onAssignManager={onAssignManager}
        />
      )}
    </div>
  );
};

export default SmartDepartmentCard;