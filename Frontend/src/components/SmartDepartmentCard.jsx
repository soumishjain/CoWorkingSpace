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
    <div className="group bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300">

      {/* HEADER */}
      <div
        onClick={() => onOpenDepartment(department._id)}
        className="cursor-pointer"
      >
        <div className="flex items-center justify-between">

          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition">
            {department.name}
          </h3>

          {isGeneral && (
            <div className="flex items-center gap-1 text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
              <Lock size={10} />
              Default
            </div>
          )}
        </div>

        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {department.description || "No description"}
        </p>
      </div>

      {/* MEMBERS */}
      <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <Users size={14} />
          <span>{department.memberCount || 0} members</span>
        </div>
      </div>

      {/* MANAGER */}
      <div className="mt-4 flex items-center justify-between bg-gray-50 px-3 py-2 rounded-xl">

        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-semibold">
            {department.manager?.name
              ? department.manager.name.charAt(0).toUpperCase()
              : "?"}
          </div>

          {/* Info */}
          <div>
            <p className="text-xs text-gray-400">Manager</p>
            <p className="text-sm font-medium text-gray-800">
              {department.manager?.name || "Not assigned"}
            </p>
          </div>
        </div>

        {/* Status */}
        {department.manager ? (
          <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
            Active
          </span>
        ) : (
          <span className="text-[10px] bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full">
            Pending
          </span>
        )}
      </div>

      {/* ACTIONS */}
      <div className="mt-4 flex gap-2">

        {isAdmin && !isGeneral && (
          <button
            onClick={() => setOpenModal(true)}
            className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:opacity-90 text-white text-xs py-2 rounded-lg transition"
          >
            {department.manager ? "Change Manager" : "Assign Manager"}
          </button>
        )}

        {!isAdmin && !isMember && !isGeneral && (
          <button
            disabled={reqSent || loading}
            onClick={async () => {
              try {
                setLoading(true);
                await onJoin(department._id);
                setReqSent(true);
                toast.success("Join Req Sent");
              } catch {
                toast.error("Failed");
              } finally {
                setLoading(false);
              }
            }}
            className={`flex-1 text-white text-xs py-2 rounded-lg transition ${
              reqSent
                ? "bg-gray-400 cursor-not-allowed"
                : loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading
              ? "Sending..."
              : reqSent
              ? "Request Sent"
              : "Join"}
          </button>
        )}

        {!isAdmin && isMember && !isGeneral && (
          <button
            onClick={() => onLeave(department._id)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs py-2 rounded-lg transition"
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