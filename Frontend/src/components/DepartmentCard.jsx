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
      className="group relative bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* 🔥 Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-gradient-to-br from-indigo-100/40 to-purple-100/40" />

      {/* 🔥 Content */}
      <div className="relative z-10">
        {/* Top */}
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[var(--color-primary)] transition">
            {department?.name}
          </h3>

          <ArrowUpRight
            size={18}
            className="text-gray-400 group-hover:text-[var(--color-primary)] transition"
          />
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-2">
          {department?.description || "No description available"}
        </p>

        {/* Manager */}
        <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
          <Users size={16} />
          <span className="font-medium">
            {department?.manager?.name || "No Manager"}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-6">
          <span className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-medium">
            Department
          </span>

          <span className="text-sm font-medium text-gray-400 group-hover:text-[var(--color-primary)] transition">
            Open
          </span>
        </div>
      </div>
    </div>
  );
};

export default DepartmentCard;