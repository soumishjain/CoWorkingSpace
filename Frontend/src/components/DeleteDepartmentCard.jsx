import React from "react";
import { Trash2, Lock } from "lucide-react";

const DeleteDepartmentCard = ({ department, onDelete }) => {

  // 🔥 GENERAL CHECK
  const isGeneral = department.name?.toLowerCase() === "general";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group">

      {/* HEADER */}
      <div className="flex items-start justify-between">

        <div>
          <div className="flex items-center gap-2">

            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-500 transition">
              {department.name}
            </h3>

            {/* 🔒 GENERAL BADGE */}
            {isGeneral && (
              <span className="flex items-center gap-1 text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                <Lock size={10} />
                Default
              </span>
            )}

          </div>

          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {department.description || "No description provided"}
          </p>
        </div>

        {/* ICON */}
        <div className={`${isGeneral ? "bg-gray-100 text-gray-400" : "bg-red-50 text-red-500"} p-2 rounded-lg`}>
          <Trash2 size={16} />
        </div>

      </div>

      {/* 🔥 GENERAL MESSAGE */}
      {isGeneral && (
        <div className="mt-4 text-xs text-gray-400">
          This is the default department and cannot be deleted
        </div>
      )}

      {/* 🔥 DELETE FLOW */}
      {!isGeneral && (
        <>
          <div className="mt-4 text-xs text-gray-400">
            This action cannot be undone
          </div>

          <button
            onClick={() => onDelete(department._id)}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 active:scale-95 text-white text-sm font-medium py-2.5 rounded-xl transition"
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