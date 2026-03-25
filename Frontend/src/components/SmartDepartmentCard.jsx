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
    <div className="group bg-white border border-gray-200 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-[2px]">

      {/* HEADER */}
      <div
        onClick={() => onOpenDepartment(department._id)}
        className="cursor-pointer"
      >
        <div className="flex justify-between items-start">

          <div>
            <h3 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition">
              {department.name}
            </h3>

            <p className="text-xs text-gray-400 mt-1">
              Department
            </p>
          </div>

          {isGeneral && (
            <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-gray-100 text-gray-600">
              <Lock size={10} />
              Default
            </span>
          )}
        </div>

        <p className="text-sm text-gray-500 mt-3 leading-relaxed line-clamp-2">
          {department.description || "No description"}
        </p>
      </div>

      {/* META */}
      <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Users size={14} />
          <span>{department.memberCount || 0} members</span>
        </div>
      </div>

      {/* MANAGER */}
      <div className="mt-4 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">
            {department.manager?.name
              ? department.manager.name.charAt(0).toUpperCase()
              : "?"}
          </div>

          <div>
            <p className="text-xs text-gray-400">Manager</p>
            <p className="text-sm font-medium text-gray-800">
              {department.manager?.name || "Not assigned"}
            </p>
          </div>

        </div>

        <span
          className={`text-[10px] px-2 py-1 rounded-full ${
            department.manager
              ? "bg-green-100 text-green-600"
              : "bg-yellow-100 text-yellow-600"
          }`}
        >
          {department.manager ? "Active" : "Pending"}
        </span>

      </div>

      {/* ACTIONS */}
      <div className="mt-5 flex gap-2">

        {isAdmin && !isGeneral && (
          <button
            onClick={() => setOpenModal(true)}
            className="flex-1 text-xs py-2 rounded-lg border border-gray-200 hover:border-indigo-500 hover:text-indigo-600 transition"
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
                toast.success("Request sent");
              } catch {
                toast.error("Failed");
              } finally {
                setLoading(false);
              }
            }}
            className={`flex-1 text-xs py-2 rounded-lg text-white transition ${
              reqSent
                ? "bg-gray-400"
                : loading
                ? "bg-blue-300"
                : "bg-blue-600 hover:bg-blue-700"
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
            onClick={() => onLeave(department._id)}
            className="flex-1 text-xs py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
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