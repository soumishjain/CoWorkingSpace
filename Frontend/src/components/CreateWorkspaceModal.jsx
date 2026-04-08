import React from "react";
import { X } from "lucide-react";
import PlanDropdown from "./PlanDropDown";

const CreateWorkspaceModal = ({
  formData,
  onChange,
  onSubmit,
  loading,
  error,
  setOpenModal,
  retryPayload,
  onRetry
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

      {/* 🔥 MODAL */}
      <div className="relative w-full max-w-md rounded-2xl 
                      bg-[var(--bg-secondary)]/80 
                      backdrop-blur-xl 
                      border border-[var(--border)] 
                      shadow-[0_20px_60px_rgba(0,0,0,0.6)] 
                      p-6">

        {/* 🔥 CLOSE */}
        <button
          onClick={() => setOpenModal(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg 
                     text-[var(--text-secondary)] 
                     hover:bg-[var(--bg-hover)] 
                     hover:text-[var(--accent)] 
                     transition"
        >
          <X size={18} />
        </button>

        {/* 🔥 HEADER */}
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Create Workspace
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Set up a new workspace for your team
          </p>
        </div>

        {/* 🔥 FORM */}
        <form onSubmit={onSubmit} className="space-y-4">

          {/* NAME */}
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Workspace Name
            </label>

            <input
              name="name"
              value={formData.name}
              onChange={onChange}
              required
              placeholder="e.g. Product Team"
              className="mt-1 w-full px-3 py-2 rounded-xl text-sm 
                         bg-[var(--bg-hover)] 
                         border border-[var(--border)] 
                         text-[var(--text-primary)] 
                         focus:outline-none 
                         focus:ring-2 focus:ring-[var(--accent)] 
                         transition"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              rows="3"
              placeholder="Brief about this workspace..."
              className="mt-1 w-full px-3 py-2 rounded-xl text-sm 
                         bg-[var(--bg-hover)] 
                         border border-[var(--border)] 
                         text-[var(--text-primary)] 
                         focus:outline-none 
                         focus:ring-2 focus:ring-[var(--accent)] 
                         transition"
            />
          </div>

          {/* PLAN */}
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Select Plan
            </label>

           <PlanDropdown
  value={formData.plan}
  onChange={(val) =>
    onChange({ target: { name: "plan", value: val } })
  }
/>
          </div>

          {/* FILE */}
          <div>
            <label className="text-xs font-medium text-[var(--text-secondary)]">
              Cover Image
            </label>

            <label className="mt-1 flex items-center justify-center w-full px-4 py-4 
                              border border-dashed border-[var(--border)] 
                              rounded-xl text-sm text-[var(--text-secondary)] 
                              cursor-pointer 
                              hover:bg-[var(--bg-hover)] 
                              hover:border-[var(--accent)]/40 
                              transition">
              📷 Upload cover image
              <input
                type="file"
                name="coverImage"
                onChange={onChange}
                className="hidden"
              />
            </label>
          </div>

          {/* ERROR */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-xs">{error}</p>

              {retryPayload && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-2 text-xs px-3 py-1 
                             bg-red-500 text-white rounded-md 
                             hover:bg-red-600 transition"
                >
                  Retry Creating Workspace
                </button>
              )}
            </div>
          )}

          {/* 🔥 ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={() => setOpenModal(false)}
              className="px-4 py-2 text-sm rounded-xl 
                         border border-[var(--border)] 
                         bg-[var(--bg-secondary)] 
                         text-[var(--text-primary)] 
                         hover:bg-[var(--bg-hover)] 
                         transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm rounded-xl text-white 
                         bg-[var(--accent)] 
                         hover:bg-[var(--accent-soft)] 
                         hover:shadow-[0_0_20px_var(--accent-glow)] 
                         transition-all duration-300"
            >
              {loading ? "Processing..." : "Create"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateWorkspaceModal;