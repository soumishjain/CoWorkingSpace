import React from "react";

const WorkspaceCards = ({ workspace }) => {

    const ws = workspace.workspaceId

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer">

      {/* Workspace Image */}
      <img
        src={
          ws.coverImage 
        }
        alt="workspace"
        className="h-36 w-full object-cover rounded-lg mb-4"
      />

      {/* Workspace Info */}
      <h3 className="text-lg font-semibold text-gray-900">
        {ws?.name}
      </h3>


      <p className="text-sm text-gray-500 mt-1">
        ROLE : {workspace.role}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">

        <span className="text-xs px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full">
          Active
        </span>

        <button className="text-sm font-medium text-[var(--color-primary)] hover:underline">
          Open →
        </button>

      </div>

    </div>
  );
};

export default WorkspaceCards;