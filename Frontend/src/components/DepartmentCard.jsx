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
                      bg-[radial-gradient(circle_at_top,rgba(255,106,0,0.2),transparent_70%)]" />

      {/* 🔥 TOP */}
      <div className="flex justify-between items-start p-5">

        <div>
          <h3 className="text-base font-semibold 
                         text-[var(--text-primary)] 
                         group-hover:text-[var(--accent)] 
                         transition">
            {department?.name}
          </h3>

          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Department
          </p>
        </div>

        <ArrowUpRight
          size={16}
          className="text-[var(--text-secondary)] 
                     group-hover:text-[var(--accent)] 
                     group-hover:-translate-y-1 group-hover:translate-x-1 
                     transition-all duration-300"
        />
      </div>

      {/* 🔥 DESCRIPTION */}
      <div className="px-5">
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">
          {department?.description || "No description available"}
        </p>
      </div>

      {/* 🔥 DIVIDER */}
      <div className="my-4 border-t border-[var(--border)] opacity-60" />

      {/* 🔥 BOTTOM */}
      <div className="flex items-center justify-between px-5 pb-5">

        {/* MANAGER */}
        <div className="flex items-center gap-3">

          {/* AVATAR */}
          <div className="w-9 h-9 rounded-full 
                          bg-[var(--accent)]/15 
                          flex items-center justify-center 
                          text-sm font-semibold 
                          text-[var(--accent)]">
            {department?.manager?.name?.[0] || "?"}
          </div>

          <div>
            <p className="text-[10px] text-[var(--text-secondary)]">
              Manager
            </p>
            <p className="text-sm font-medium text-[var(--text-primary)]">
              {department?.manager?.name || "Not assigned"}
            </p>
          </div>

        </div>

        {/* MEMBERS */}
        <div className="flex items-center gap-2 
                        px-3 py-1 rounded-full 
                        bg-[var(--bg-hover)] 
                        border border-[var(--border)] 
                        text-xs text-[var(--text-secondary)]">

          <Users size={13} />
          <span>{department?.memberCount || 0}</span>

        </div>

      </div>

    </div>
  );
};

export default DepartmentCard;