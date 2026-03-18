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
    <div className="mt-8">

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Delete Departments
        </h2>

        <p className="text-sm text-gray-500">
          Only admin can delete departments
        </p>
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <DepartmentSkeleton key={i} />
          ))}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {departments?.map((dept) => (
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