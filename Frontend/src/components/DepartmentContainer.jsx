import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bell } from "lucide-react";

import DepartmentCard from "./DepartmentCard";
import DepartmentSkeleton from "./DepartmentSkeleton";
import CreateDepartmentModal from "./CreateDepartmentModal";

const DepartmentContainer = ({
  departments,
  loading,
  error,
  onAddMember,
  onCreateDepartment,
  createDeptState
}) => {

  const navigate = useNavigate();
  const { workspaceId } = useParams();

  const [openModal, setOpenModal] = useState(false);

  // 🔥 SAFE STATE
  const formData = createDeptState?.formData || { name: "", description: "" };
  const setFormData = createDeptState?.setFormData || (() => {});
  const createLoading = createDeptState?.loading || false;
  const createError = createDeptState?.error || "";

  return (
    <div className="mt-8">

      {/* 🔥 HEADER */}
      <div className="flex items-center justify-between mb-6">

        {/* LEFT */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Departments
          </h2>
          <p className="text-sm text-gray-500">
            Manage departments in this workspace
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* 🔔 WORKSPACE NOTIFICATIONS */}
          <button
            onClick={() => {
              if (!workspaceId) return;
              navigate(`/dashboard/workspace/${workspaceId}/notifications`);
            }}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <Bell size={20} />

            {/* 🔴 static badge (baad me dynamic karna) */}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">
              2
            </span>
          </button>

          {/* CREATE */}
          <button
            onClick={() => setOpenModal(true)}
            className="bg-green-500 text-white text-sm px-4 py-2 rounded-lg"
          >
            + Create Department
          </button>

          {/* ADD MEMBER */}
          <button
            onClick={() => onAddMember && onAddMember()}
            className="bg-[var(--color-primary)] text-white text-sm px-4 py-2 rounded-lg"
          >
            + Add Member
          </button>

        </div>
      </div>

      {/* 🔥 ERROR */}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* 🔥 LOADING */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <DepartmentSkeleton key={i} />
          ))}
        </div>
      )}

      {/* 🔥 LIST */}
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
        <CreateDepartmentModal
          formData={formData}
          onChange={(e) =>
            setFormData({
              ...formData,
              [e.target.name]: e.target.value,
            })
          }
          onSubmit={async (e) => {
            e.preventDefault();
            await onCreateDepartment();
            setOpenModal(false);
          }}
          loading={createLoading}
          setOpen={setOpenModal}
        />
      )}

    </div>
  );
};

export default DepartmentContainer;