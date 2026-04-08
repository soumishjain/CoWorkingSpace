import React from "react";
import DepartmentSkeleton from "./DepartmentSkeleton";
import DeleteDepartmentCard from "./DeleteDepartmentCard";

const DeleteDepartmentContainer = ({
  departments,
  loading,
  error,
  onDelete,
}) => {

  return (
    <div className="mt-10">

      {/* 🔥 HEADER */}
      <div className="mb-8">

        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
          Delete Departments
        </h2>

        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Only admins can delete departments
        </p>

      </div>

      {/* 🔥 ERROR */}
      {error && (
        <div className="mb-5 p-3 rounded-xl 
                        bg-red-500/10 
                        border border-red-500/20 
                        text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* 🔥 LOADING */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <DepartmentSkeleton key={i} />
          ))}
        </div>
      )}

      {/* 🔥 EMPTY */}
      {!loading && !error && departments?.length === 0 && (
        <div className="text-center py-16">

          <div className="w-14 h-14 mx-auto rounded-full 
                          bg-[var(--bg-secondary)] 
                          border border-[var(--border)] 
                          flex items-center justify-center mb-4">

            <span className="text-lg text-[var(--text-secondary)]">⚠️</span>

          </div>

          <p className="text-sm text-[var(--text-secondary)]">
            No departments available to delete
          </p>

        </div>
      )}

      {/* 🔥 GRID */}
      {!loading && !error && departments?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {departments.map((dept) => (
            <DeleteDepartmentCard
              key={dept._id}
              department={dept}
              onDelete={onDelete}
            />
          ))}

        </div>
      )}

    </div>
  );
};

export default DeleteDepartmentContainer;