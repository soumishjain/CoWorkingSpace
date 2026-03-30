import React from "react";
import { X } from "lucide-react";

const CreateWorkspaceModal = ({
  formData,
  onChange,
  onSubmit,
  loading,
  error,
  setOpenModal,
  retryPayload,
  onRetry // 🔥 NEW PROP
}) => {

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-200 p-6">

        {/* CLOSE */}
        <button
          onClick={() => setOpenModal(false)}
          className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
        >
          <X size={18} />
        </button>

        {/* HEADER */}
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Create Workspace
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Set up a new workspace for your team
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={onSubmit} className="space-y-4">

          {/* NAME */}
          <div>
            <label className="text-xs font-medium text-gray-600">
              Workspace Name
            </label>

            <input
              name="name"
              value={formData.name}
              onChange={onChange}
              required
              placeholder="e.g. Product Team"
              className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-xs font-medium text-gray-600">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              rows="3"
              placeholder="Brief about this workspace..."
              className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          {/* PLAN */}
          <div>
            <label className="text-xs font-medium text-gray-600">
              Select Plan
            </label>

            <select
              name="plan"
              value={formData.plan}
              onChange={onChange}
              className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
            >
              <option value="individual">Free</option>
              <option value="startup">Startup - ₹499</option>
              <option value="company">Company - ₹1999</option>
              <option value="bigtech">BigTech - ₹4999</option>
            </select>
          </div>

          {/* FILE */}
          <div>
            <label className="text-xs font-medium text-gray-600">
              Cover Image
            </label>

            <label className="mt-1 flex items-center justify-center w-full px-4 py-4 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 cursor-pointer hover:bg-gray-50 transition">
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
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-xs">{error}</p>

              {/* 🔥 RETRY BUTTON */}
              {retryPayload && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-2 text-xs px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  Retry Creating Workspace
                </button>
              )}
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={() => setOpenModal(false)}
              className="px-4 py-2 text-sm rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-md"
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