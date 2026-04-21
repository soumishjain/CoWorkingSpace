import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bell } from "lucide-react";

import WorkspaceCards from "./WorkspaceCards";
import WorkspaceCardSkeleton from "./WorkspaceSkeleton";

import CreateWorkspaceModal from "./CreateWorkspaceModal";
import JoinWorkspaceModal from "./JoinWorkspaceModal";

import { useWorkspaceState } from "../state/useWorkspaceState";
import { useWorkspace } from "../hooks/useWorkspace";

import { useCreateWorkspaceState } from "../state/useCreateWorkspaceState";
import { useCreateWorkspace } from "../hooks/useCrateWorkspace";

import { getUnreadNotificationCount } from "../api/notification.api";

const CardContainer = () => {
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openJoinModal, setOpenJoinModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const workspaceState = useWorkspaceState();
  const { fetchWorkspaces } = useWorkspace(workspaceState);

  const { workspaces, loading, error } = workspaceState;

  const createState = useCreateWorkspaceState();

  const {
    formData,
    setFormData,
    loading: createLoading,
    error: createError
  } = createState;

  const {
    submitWorkspace,
    retryWorkspaceCreation,
    retryPayload
  } = useCreateWorkspace(
    createState,
    () => setOpenCreateModal(false),
    fetchWorkspaces
  );

  useEffect(() => {
    if (workspaceId) {
      fetchWorkspaces(workspaceId);
    }
  }, [workspaceId]);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await getUnreadNotificationCount();
        setUnreadCount(res.count || 0);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCount();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "coverImage" ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitWorkspace();
  };

  return (
    <div className="mt-10">

      {/* 🔥 HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

        {/* LEFT */}
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            Workspaces
          </h2>

          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Access and manage your workspace environments
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* 🔔 NOTIFICATIONS */}
          <button
            onClick={() => navigate(`/dashboard/notifications`)}
            className="relative p-2.5 rounded-xl 
                       border border-[var(--border)] 
                       bg-[var(--bg-secondary)] 
                       hover:bg-[var(--bg-hover)] 
                       transition-all duration-300 
                       hover:shadow-[0_0_15px_var(--accent-glow)]"
          >
            <Bell size={18} className="text-[var(--text-primary)]" />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 
                               bg-[var(--accent)] text-white 
                               text-[10px] px-1.5 py-[1px] rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {/* JOIN */}
          <button
            onClick={() => setOpenJoinModal(true)}
            className="px-4 py-2 rounded-xl text-sm font-medium 
                       border border-[var(--border)] 
                       bg-[var(--bg-secondary)] 
                       text-[var(--text-primary)]
                       hover:bg-[var(--bg-hover)] 
                       transition-all duration-300"
          >
            Join
          </button>

          {/* CREATE */}
          <button
            onClick={() => setOpenCreateModal(true)}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white 
                       bg-[var(--accent)] 
                       hover:bg-[var(--accent-soft)] 
                       hover:shadow-[0_0_20px_var(--accent-glow)] 
                       transition-all duration-300"
          >
            + New Workspace
          </button>

        </div>
      </div>

      {/* 🔥 ERROR */}
      {error && (
        <p className="text-red-400 text-sm mb-4 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
          {error}
        </p>
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
      {!loading && !error && workspaces?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 
                        border border-dashed border-[var(--border)] 
                        rounded-2xl bg-[var(--bg-secondary)]/50 backdrop-blur">

          <p className="text-sm text-[var(--text-secondary)] mb-3">
            No workspaces yet
          </p>

          <button
            onClick={() => setOpenCreateModal(true)}
            className="px-4 py-2 text-sm font-medium text-white 
                       bg-[var(--accent)] 
                       rounded-lg 
                       hover:bg-[var(--accent-soft)] 
                       hover:shadow-[0_0_15px_var(--accent-glow)] 
                       transition"
          >
            Create your first workspace
          </button>
        </div>
      )}

      {/* 🔥 GRID */}
      {!loading && !error && workspaces?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {workspaces.map((workspace) => (
            <WorkspaceCards key={workspace._id} workspace={workspace} />
          ))}
        </div>
      )}

      {/* 🔥 MODALS */}
      {openCreateModal && (
        <CreateWorkspaceModal
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={createLoading}
          error={createError}
          setOpenModal={setOpenCreateModal}
          retryPayload={retryPayload}
          onRetry={retryWorkspaceCreation}
        />
      )}

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