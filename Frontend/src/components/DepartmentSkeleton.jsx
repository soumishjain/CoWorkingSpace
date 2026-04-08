import React from "react";

const DepartmentSkeleton = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl p-5 
                    bg-[var(--bg-secondary)]/70 
                    backdrop-blur-xl 
                    border border-[var(--border)] 
                    animate-pulse">

      {/* 🔥 SOFT GLOW */}
      <div className="absolute inset-0 opacity-20 
                      bg-[radial-gradient(circle_at_top,rgba(255,106,0,0.1),transparent_70%)]" />

      {/* 🔥 TITLE */}
      <div className="h-5 rounded-md w-3/4 mb-3 
                      bg-[var(--bg-hover)]" />

      {/* 🔥 DESCRIPTION */}
      <div className="h-4 rounded-md w-full mb-2 
                      bg-[var(--bg-hover)]" />

      <div className="h-4 rounded-md w-5/6 mb-4 
                      bg-[var(--bg-hover)]" />

      {/* 🔥 FOOTER */}
      <div className="flex items-center justify-between mt-4">

        <div className="h-6 w-20 rounded-full 
                        bg-[var(--bg-hover)]" />

        <div className="h-4 w-12 rounded-md 
                        bg-[var(--bg-hover)]" />

      </div>

    </div>
  );
};

export default DepartmentSkeleton;