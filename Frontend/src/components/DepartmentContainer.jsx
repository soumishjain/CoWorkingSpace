import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bell } from "lucide-react";
import { leaveWorkspace } from "../api/workspace.api";
import ConfirmLeaveModal from "./ConfirmLeaveModal";
import toast from "react-hot-toast";
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
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [leaveLoading, setLeaveLoading] = useState(false);

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

      {/* 🔥 HEADER */}
      <div className="flex items-center justify-between mb-8 
                      p-5 rounded-2xl 
                      bg-[var(--bg-secondary)]/60 
                      backdrop-blur-xl 
                      border border-[var(--border)]">

        {/* LEFT */}
        <div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Departments
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage and organize your workspace structure
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* 🔔 NOTIFICATION */}
          <button
            onClick={() => navigate(`/dashboard/notifications`)}
            className="p-2 rounded-xl 
                       bg-[var(--bg-hover)] 
                       border border-[var(--border)] 
                       hover:bg-[var(--accent)]/20 
                       transition"
          >
            <Bell size={18} />
          </button>

          {/* MEMBER ACTION */}
          {role === "member" && (
            <button
              onClick={() => setOpenConfirmModal(true)}
              className="px-4 py-2 rounded-xl text-sm font-medium 
                         bg-red-500/10 text-red-400 
                         border border-red-500/20
                         hover:bg-red-500 hover:text-white 
                         transition-all duration-300"
            >
              Leave Workspace
            </button>
          )}

          {/* ADMIN ACTIONS */}
          {role === "admin" && (
            <>
              <button
                onClick={() => setOpenCreateModal(true)}
                className="px-4 py-2 rounded-xl text-sm font-medium 
                           bg-[var(--accent)] text-white 
                           hover:bg-[var(--accent-soft)] 
                           shadow-[0_0_10px_var(--accent-glow)] 
                           transition"
              >
                + Create
              </button>

              <button
                onClick={() => setOpenRemoveModal(true)}
                className="px-4 py-2 rounded-xl text-sm font-medium 
                           bg-[var(--bg-hover)] 
                           border border-[var(--border)] 
                           hover:bg-red-500/10 
                           hover:text-red-400 
                           transition"
              >
                Remove Member
              </button>
            </>
          )}

        </div>
      </div>

      {/* 🔥 ERROR */}
      {error && (
        <div className="mb-4 p-3 rounded-xl 
                        bg-red-500/10 text-red-400 
                        border border-red-500/20 text-sm">
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

      {/* 🔥 LIST */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {departments.length > 0 ? (
            departments.map((dept) => (
              <DepartmentCard key={dept._id} department={dept} />
            ))
          ) : (
            <div className="col-span-full text-center text-[var(--text-secondary)] py-10">
              No departments found
            </div>
          )}
        </div>
      )}

      {/* 🔥 CREATE MODAL */}
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

      {/* 🔥 REMOVE MODAL */}
      {openRemoveModal && role === "admin" && (
        <RemoveMemberModal
          workspaceId={workspaceId}
          onClose={() => setOpenRemoveModal(false)}
        />
      )}

      {/* 🔥 CONFIRM LEAVE */}
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