import React, { useState } from "react";
import WorkspaceCards from "./WorkspaceCards";
import { useCreateWorkspaceState } from "../state/useCreateWorkspaceState";
import { useWorkspace } from "../hooks/useWorkspace";
import { useWorkspaceState } from "../state/useWorkspaceState";
import { useCreateWorkspace } from "../hooks/useCrateWorkspace";
import CreateWorkspaceModal from "./createWorkspaceModal";



const CardContainer = () => {

  const [openModal, setOpenModal] = useState(false);

  const workspaceState = useWorkspaceState();
  const { fetchWorkspaces } = useWorkspace(workspaceState);

  const { workspaces, loading, error } = workspaceState;

  console.log("WORKSPACE : ", workspaces)

  const createState = useCreateWorkspaceState();

  const {
    formData,
    setFormData,
    loading: createLoading,
    error: createError
  } = createState;

  const { submitWorkspace } = useCreateWorkspace(
    createState,
    () => setOpenModal(false),
    fetchWorkspaces
  );

  const handleChange = (e) => {

    const { name, value, files } = e.target;

    if (name === "coverImage") {
      setFormData(prev => ({
        ...prev,
        coverImage: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitWorkspace();
  };

  return (
    <div className="mt-8">

      <div className="flex items-center justify-between mb-6">

        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Your Workspaces
          </h2>

          <p className="text-sm text-gray-500">
            Manage and access your workspaces
          </p>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-[var(--color-primary)] text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition"
        >
          + New Workspace
        </button>

      </div>

      {loading && (
        <p className="text-gray-500 text-sm">Loading workspaces...</p>
      )}

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {workspaces.map((workspace) => (
            <WorkspaceCards
              key={workspace._id}
              workspace={workspace}
            />
          ))}

        </div>
      )}

      {openModal && (
        <CreateWorkspaceModal
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={createLoading}
          error={createError}
          setOpenModal={setOpenModal}
        />
      )}

    </div>
  );
};

export default CardContainer;