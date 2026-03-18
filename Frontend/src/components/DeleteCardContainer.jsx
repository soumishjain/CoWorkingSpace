import React from "react";
import WorkspaceCardSkeleton from "./WorkspaceSkeleton";
import DeletePageCards from "./DeletePageCards";

const DeleteCardContainer = ({ workspaces, loading, error, onDelete }) => {

  return (
    <div className="mt-8">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Delete Workspaces
          </h2>

          <p className="text-sm text-gray-500">
            Only workspaces where you are admin are shown
          </p>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <WorkspaceCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {workspaces
            ?.filter(ws => ws.role === "admin")
            .map((workspace) => (
              <DeletePageCards
                key={workspace._id}
                workspace={workspace}
                onDelete={onDelete}
              />
          ))}

        </div>
      )}

    </div>
  );
};

export default DeleteCardContainer;