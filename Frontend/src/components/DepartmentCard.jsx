import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Users, ArrowUpRight } from "lucide-react";

const DepartmentCard = ({ department }) => {
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  const handleOpenDepartment = () => {
    navigate(
      `/dashboard/workspace/${workspaceId}/department/${department._id}`
    );
  };

  return (
    <div
      onClick={handleOpenDepartment}
      className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex"
    >

      {/* 🔥 LEFT COLOR PANEL */}
      <div className="w-1.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-blue-500" />

      {/* 🔥 MAIN */}
      <div className="flex-1 p-5">

        {/* HEADER */}
        <div className="flex justify-between items-start">

          <div>
            <h3 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition">
              {department?.name}
            </h3>

            <p className="text-xs text-gray-400 mt-0.5">
              Department
            </p>
          </div>

          <ArrowUpRight
            size={16}
            className="text-gray-300 group-hover:text-indigo-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
          />

        </div>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-500 mt-3 leading-relaxed line-clamp-2">
          {department?.description || "No description available"}
        </p>

        {/* BOTTOM */}
        <div className="flex items-center justify-between mt-5">

          {/* MANAGER */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
              {department?.manager?.name?.[0] || "?"}
            </div>

            <div>
              <p className="text-xs text-gray-400">Manager</p>
              <p className="text-sm font-medium text-gray-700">
                {department?.manager?.name || "Not assigned"}
              </p>
            </div>
          </div>

          {/* MEMBERS */}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Users size={14} />
            <span>{department?.memberCount || 0}</span>
          </div>

        </div>

      </div>

      {/* 🔥 HOVER LIGHT */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-blue-500/5 pointer-events-none" />

    </div>
  );
};

export default DepartmentCard;