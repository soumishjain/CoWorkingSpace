import React, { useState } from "react";
import DepartmentCard from "./DepartmentCard";
import DepartmentSkeleton from "./DepartmentSkeleton";

const DepartmentContainer = ({
  departments,
  loading,
  error,
  onAddMember,
  onCreateDepartment,
  createDeptState
}) => {

  const [openModal, setOpenModal] = useState(false);

  // 🔥 SAFE STATE (NO FREEZE BUG)
  const formData = createDeptState?.formData || { name: "", description: "" };
  const setFormData = createDeptState?.setFormData || (() => {});
  const createLoading = createDeptState?.loading || false;
  const createError = createDeptState?.error || "";

  return (
    <div className="mt-8">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Departments
          </h2>
          <p className="text-sm text-gray-500">
            Manage departments in this workspace
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setOpenModal(true)}
            className="bg-green-500 text-white text-sm px-4 py-2 rounded-lg"
          >
            + Create Department
          </button>

          <button
            onClick={() => onAddMember && onAddMember()}
            className="bg-[var(--color-primary)] text-white text-sm px-4 py-2 rounded-lg"
          >
            + Add Member
          </button>
        </div>
      </div>

      {/* ERROR */}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* LOADING */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <DepartmentSkeleton key={i} />
          ))}
        </div>
      )}

      {/* LIST */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {departments?.length > 0 ? (
            departments.map((dept) => (
              <DepartmentCard key={dept._id} department={dept} />
            ))
          ) : (
            <p className="text-gray-500 text-sm">
              No departments found
            </p>
          )}
        </div>
      )}

      {/* 🔥 MODAL */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpenModal(false)}
          />

          {/* modal */}
          <div className="relative bg-white w-full max-w-md rounded-xl shadow-lg p-6 z-10">

            <h3 className="text-lg font-semibold mb-4">
              Create Department
            </h3>

            <input
              type="text"
              placeholder="Department Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              className="w-full border rounded-lg px-3 py-2 mb-3"
            />

            <input
              type="text"
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              className="w-full border rounded-lg px-3 py-2 mb-3"
            />

            {createError && (
              <p className="text-red-500 text-sm mb-2">
                {createError}
              </p>
            )}

            <div className="flex justify-end gap-2 mt-4">

              <button
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 text-sm text-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await onCreateDepartment();
                  setOpenModal(false);
                }}
                disabled={createLoading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                {createLoading ? "Creating..." : "Create"}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default DepartmentContainer;