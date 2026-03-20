import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bell } from "lucide-react";

import WorkspaceCards from "./WorkspaceCards";
import WorkspaceCardSkeleton from "./WorkspaceSkeleton";

import CreateWorkspaceModal from "./createWorkspaceModal";
import JoinWorkspaceModal from "./JoinWorkspaceModal";

import { useWorkspaceState } from "../state/useWorkspaceState";
import { useWorkspace } from "../hooks/useWorkspace";

import { useCreateWorkspaceState } from "../state/useCreateWorkspaceState";
import { useCreateWorkspace } from "../hooks/useCrateWorkspace";

const CardContainer = () => {

  // 🔥 Navigation
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  // 🔥 Modals
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openJoinModal, setOpenJoinModal] = useState(false);

  // 🔥 Workspace State
  const workspaceState = useWorkspaceState();
  const { fetchWorkspaces } = useWorkspace(workspaceState);

  const { workspaces, loading, error } = workspaceState;

  // 🔥 Create Workspace State
  const createState = useCreateWorkspaceState();

  const {
    formData,
    setFormData,
    loading: createLoading,
    error: createError
  } = createState;

  const { submitWorkspace } = useCreateWorkspace(
    createState,
    () => setOpenCreateModal(false),
    fetchWorkspaces
  );

  // 🔥 Fetch Workspaces
  useEffect(() => {
    if (workspaceId) {
      fetchWorkspaces(workspaceId);
    }
  }, [workspaceId]);

  // 🔥 Handle Input
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "coverImage" ? files[0] : value,
    }));
  };

  // 🔥 Submit Create
  const handleSubmit = (e) => {
    e.preventDefault();
    submitWorkspace();
  };

  return (
    <div className="mt-8">

      {/* 🔥 HEADER */}
      <div className="flex items-center justify-between mb-6">

        {/* LEFT */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Your Workspaces
          </h2>

          <p className="text-sm text-gray-500">
            Manage and access your workspaces
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* 🔔 NOTIFICATIONS */}
          <button
            onClick={() =>
              navigate(`/dashboard/notifications`)
            }
            className="relative p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <Bell size={20} />

            {/* 🔴 static badge (baad me dynamic kar lena) */}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">
              3
            </span>
          </button>

          {/* 🔥 JOIN BUTTON */}
          <button
            onClick={() => setOpenJoinModal(true)}
            className="bg-gray-100 text-gray-800 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            + Join Workspace
          </button>

          {/* 🔥 CREATE BUTTON */}
          <button
            onClick={() => setOpenCreateModal(true)}
            className="bg-[var(--color-primary)] text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            + New Workspace
          </button>

        </div>
      </div>

      {/* 🔥 ERROR */}
      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      {/* 🔥 LOADING */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <WorkspaceCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* 🔥 WORKSPACES */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {workspaces?.length > 0 ? (
            workspaces.map((workspace) => (
              <WorkspaceCards
                key={workspace._id}
                workspace={workspace}
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm">
              No workspaces found
            </p>
          )}

        </div>
      )}

      {/* 🔥 CREATE MODAL */}
      {openCreateModal && (
        <CreateWorkspaceModal
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={createLoading}
          error={createError}
          setOpenModal={setOpenCreateModal}
        />
      )}

      {/* 🔥 JOIN MODAL */}
      {openJoinModal && (
        <JoinWorkspaceModal
          setOpen={setOpenJoinModal}
          fetchWorkspaces={fetchWorkspaces}
        />
      )}

    </div>
  );
};

export default CardContainer;