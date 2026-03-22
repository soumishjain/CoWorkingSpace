import React from "react";
import { X } from "lucide-react";

const CreateWorkspaceModal = ({
  formData,
  onChange,
  onSubmit,
  loading,
  error,
  setOpenModal
}) => {

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">

        <button
          onClick={() => setOpenModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20}/>
        </button>

        <h2 className="text-xl font-semibold text-gray-900 mb-1">
          Create Workspace
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          Create a new workspace to collaborate
        </p>

        <form onSubmit={onSubmit} className="space-y-4">

          <div>
            <label className="text-sm font-medium text-gray-700">
              Workspace Name
            </label>

            <input
              name="name"
              value={formData.name}
              onChange={onChange}
              required
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              rows="3"
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Cover Image
            </label>

            <input
              type="file"
              name="coverImage"
              onChange={onChange}
              className="mt-1 w-full text-sm"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={() => setOpenModal(false)}
              className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-[var(--color-primary)] text-white rounded-lg"
            >
              {loading ? "Creating..." : "Create Workspace"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default CreateWorkspaceModal;