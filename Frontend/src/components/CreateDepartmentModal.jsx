import React from "react";
import { X } from "lucide-react";

const CreateDepartmentModal = ({
  formData,
  onChange,
  onSubmit,
  loading,
  setOpen
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

      {/* MODAL */}
      <div className="bg-white w-[420px] rounded-2xl shadow-xl p-6 relative animate-in fade-in zoom-in-95">

        {/* CLOSE BUTTON */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>

        {/* HEADER */}
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-gray-900">
            Create Department
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Organize your workspace into teams
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={onSubmit} className="space-y-4">

          {/* NAME */}
          <div>
            <label className="text-xs text-gray-500">Department Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder="e.g. Engineering"
              required
              className="w-full mt-1 border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 p-2.5 rounded-lg outline-none transition"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-xs text-gray-500">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              placeholder="Short description about the department..."
              rows={3}
              className="w-full mt-1 border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 p-2.5 rounded-lg outline-none transition resize-none"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition flex items-center gap-2"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              {loading ? "Creating..." : "Create"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default CreateDepartmentModal;