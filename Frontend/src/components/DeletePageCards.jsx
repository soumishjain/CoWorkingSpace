import React from "react";

const DeletePageCards = ({ workspace, onDelete }) => {

  const ws = workspace.workspaceId;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">

      <img
        src={ws?.coverImage}
        alt="workspace"
        className="h-36 w-full object-cover rounded-lg mb-4"
      />

      <h3 className="text-lg font-semibold text-gray-900">
        {ws?.name}
      </h3>

      <p className="text-sm text-gray-500 mt-1">
        ROLE : {workspace.role}
      </p>

      <div className="mt-4">
        <button
          onClick={() => onDelete(ws._id)}
          className="w-full bg-red-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-red-600 transition"
        >
          Delete Workspace
        </button>
      </div>

    </div>
  );
};

export default DeletePageCards;