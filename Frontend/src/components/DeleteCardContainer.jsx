import React from "react";
import WorkspaceCardSkeleton from "./WorkspaceSkeleton";
import DeletePageCards from "./DeletePageCards";

const DeleteCardContainer = ({ workspaces, loading, error, onDelete }) => {

  const adminWorkspaces = workspaces?.filter(ws => ws.role === "admin") || [];

  return (
    <div className="mt-8">

      {/* 🔥 HEADER */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Delete Workspaces
          </h2>

          <p className="text-sm text-[var(--text-secondary)]">
            Only workspaces where you are admin are shown
          </p>
        </div>

      </div>

      {/* 🔥 ERROR */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl 
                        bg-red-500/10 border border-red-500/20 
                        text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* 🔥 LOADING */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <WorkspaceCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* 🔥 EMPTY STATE */}
      {!loading && !error && adminWorkspaces.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 
                        border border-dashed border-[var(--border)] 
                        rounded-2xl bg-[var(--bg-secondary)]/50">

          <p className="text-[var(--text-primary)] text-lg">
            No deletable workspaces
          </p>

          <p className="text-sm text-[var(--text-secondary)] mt-1">
            You need admin access to delete a workspace
          </p>

        </div>
      )}

      {/* 🔥 GRID */}
      {!loading && !error && adminWorkspaces.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {adminWorkspaces.map((workspace) => (
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