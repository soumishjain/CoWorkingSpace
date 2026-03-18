import React from "react";

const WorkspaceDashboard = ({ workspace }) => {

  // safety
  if (!workspace) return null;

  const {
    name,
    coverImage,
    createdBy,
    totalMembers,
    totalDepartments
  } = workspace;

  return (
    <div className="w-full h-64 md:h-72 lg:h-80 relative rounded-xl overflow-hidden">

      {/* 🔥 Background Image */}
      <img
        src={coverImage}
        alt="workspace"
        className="w-full h-full object-top object-cover"
      />

      {/* 🔥 Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* 🔥 Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">

        {/* Top */}
        <div>
          <h2 className="text-2xl md:text-3xl uppercase font-semibold">
            {name}
          </h2>

          <p className="text-sm mt-1 text-gray-200">
            Admin: {createdBy?.name || "Unknown"}
          </p>
        </div>

        {/* Bottom Stats */}
        <div className="flex gap-6">

          <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-lg">
            <p className="text-sm text-gray-200">Members</p>
            <p className="text-lg font-semibold">
              {totalMembers || 0}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-lg">
            <p className="text-sm text-gray-200">Departments</p>
            <p className="text-lg font-semibold">
              {totalDepartments || 0}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default WorkspaceDashboard;