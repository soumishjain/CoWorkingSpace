import React, { useState } from "react";
import DepartmentCard from "./DepartmentCard";
import DepartmentSkeleton from "./DepartmentSkeleton";

const DepartmentContainer = ({
  departments,
  loading,
  error,
  onAddMember,
  onCreateDepartment
}) => {

  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="mt-8">

      {/* 🔥 Header */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Departments
          </h2>

          <p className="text-sm text-gray-500">
            Manage departments in this workspace
          </p>
        </div>

        {/* 🔥 Buttons */}
        <div className="flex gap-3">

          {/* Create Department */}
          <button
            onClick={() => onCreateDepartment && onCreateDepartment()}
            className="bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            + Create Department
          </button>

          {/* Add Member */}
          <button
            onClick={() => {
              setOpenModal(true);
              onAddMember && onAddMember();
            }}
            className="bg-[var(--color-primary)] text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            + Add Member
          </button>

        </div>

      </div>

      {/* 🔴 ERROR */}
      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      {/* 🟡 LOADING */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <DepartmentSkeleton key={i} />
          ))}
        </div>
      )}

      {/* 🟢 DEPARTMENTS */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {departments?.length > 0 ? (
            departments.map((dept) => (
              <DepartmentCard
                key={dept._id}
                department={dept}
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm">
              No departments found
            </p>
          )}

        </div>
      )}

      {/* 🔥 Modal placeholder */}
      {openModal && (
        <div className="text-sm text-gray-500 mt-4">
          Add Member Modal (coming soon)
        </div>
      )}

    </div>
  );
};

export default DepartmentContainer;