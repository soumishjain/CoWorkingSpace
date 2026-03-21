import React, { useState } from "react";
import AssignManagerModal from "./AssignManagerModal";
import { Users, Lock } from "lucide-react";

const SmartDepartmentCard = ({
  department,
  isAdmin,
  onJoin,
  onLeave,
  onAssignManager,
  onOpenDepartment,
  workspaceId
}) => {

  const [openModal, setOpenModal] = useState(false);

  const isMember = department.isMember;

  // 🔥 GENERAL CHECK
  const isGeneral = department.name?.toLowerCase() === "general";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200">

      {/* HEADER */}
      <div
        onClick={() => onOpenDepartment(department._id)}
        className="cursor-pointer"
      >
        <div className="flex items-center justify-between">

          <h3 className="text-lg font-semibold text-gray-900">
            {department.name}
          </h3>

          {/* 🔒 GENERAL BADGE */}
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

      {/* INFO */}
      <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <Users size={14} />
          <span>{department.memberCount || 0} members</span>
        </div>
      </div>

      {/* 🔥 MANAGER SECTION */}
      <div className="mt-3 flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">

        <div className="flex items-center gap-3">

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
            {department.manager?.name
              ? department.manager.name.charAt(0).toUpperCase()
              : "?"}
          </div>

          {/* Name */}
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
      <div className="mt-4 flex items-center gap-2">

        {/* 🔥 ADMIN (NO MANAGER FOR GENERAL) */}
        {isAdmin && !isGeneral && (
          <button
            onClick={() => setOpenModal(true)}
            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white text-xs py-2 rounded-lg transition"
          >
            {department.manager ? "Change Manager" : "Assign Manager"}
          </button>
        )}

        {/* 🔥 MEMBER FLOW (BLOCK GENERAL) */}
        {!isAdmin && !isMember && !isGeneral && (
          <button
            onClick={() => onJoin(department._id)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-xs py-2 rounded-lg transition"
          >
            Join
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

        {/* 🔒 GENERAL INFO */}
        {isGeneral && (
          <div className="w-full text-center text-xs text-gray-400">
            Default department (auto-assigned)
          </div>
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