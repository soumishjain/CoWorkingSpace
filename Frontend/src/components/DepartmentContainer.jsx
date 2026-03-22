import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bell } from "lucide-react";
import { leaveWorkspace } from "../api/workspace.api";
import ConfirmLeaveModal from "./ConfirmLeaveModal";
import toast from 'react-hot-toast'
import DepartmentCard from "./DepartmentCard";
import DepartmentSkeleton from "./DepartmentSkeleton";
import CreateDepartmentModal from "./CreateDepartmentModal";
import RemoveMemberModal from "./RemoveMemberModal";

const DepartmentContainer = ({
  departments = [],
  loading,
  error,
  onCreateDepartment,
  createDeptState,
  role,
}) => {
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openRemoveModal, setOpenRemoveModal] = useState(false);

  const [openConfirmModal,setOpenConfirmModal] = useState(false)
  const [leaveLoading, setLeaveLoading] = useState(false)


  const formData = createDeptState?.formData || {
    name: "",
    description: "",
  };
  const setFormData = createDeptState?.setFormData || (() => {});
  const createLoading = createDeptState?.loading || false;

  const handleLeaveWorkspace = async () => {
  try {
    setLeaveLoading(true);

    await leaveWorkspace(workspaceId);

    toast.success("Left workspace");

    navigate("/dashboard");
  } catch (err) {
    toast.error("Failed to leave");
  } finally {
    setLeaveLoading(false);
    setOpenConfirmModal(false);
  }
};



  return (
    <div className="mt-8">

      {/* HEADER */}
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

          {/* NOTIFICATIONS */}
          <button
            onClick={() => navigate(`/dashboard/notifications`)}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <Bell size={20} />
            
          </button>

          {/* 🔥 LEAVE WORKSPACE */}
          {role === 'member' && (
            <button
              onClick={() => setOpenConfirmModal(true)}
              className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition"
            >
              Leave Workspace
            </button>
          )}

          {/* ADMIN */}
          {role === "admin" && (
            <>
              <button
                onClick={() => setOpenCreateModal(true)}
                className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg transition"
              >
                + Create Department
              </button>

              <button
                onClick={() => setOpenRemoveModal(true)}
                className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-lg transition"
              >
                Remove Member
              </button>
            </>
          )}

        </div>
      </div>

      {/* ERROR */}
      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

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
          {departments.length > 0 ? (
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

      {/* CREATE MODAL */}
      {openCreateModal && role === "admin" && (
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
            setOpenCreateModal(false);
          }}
          loading={createLoading}
          setOpen={setOpenCreateModal}
        />
      )}

      {/* REMOVE MODAL */}
      {openRemoveModal && role === "admin" && (
        <RemoveMemberModal
          workspaceId={workspaceId}
          onClose={() => setOpenRemoveModal(false)}
        />
      )}

      {openConfirmModal && (
  <ConfirmLeaveModal
    onClose={() => setOpenConfirmModal(false)}
    onConfirm={handleLeaveWorkspace}
    loading={leaveLoading}
  />
)}

    </div>
  );
};

export default DepartmentContainer;