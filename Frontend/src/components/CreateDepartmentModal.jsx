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
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* 🔥 BACKDROP */}
      <div
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
      />

      {/* 🔥 MODAL */}
      <div className="relative w-[420px] rounded-2xl 
                      bg-[var(--bg-secondary)]/70 
                      backdrop-blur-2xl 
                      border border-[var(--border)] 
                      shadow-[0_20px_60px_rgba(0,0,0,0.7)] 
                      p-6">

        {/* 🔥 GLOW */}
        <div className="absolute inset-0 opacity-30 
                        bg-[radial-gradient(circle_at_top,rgba(255,106,0,0.2),transparent_70%)]" />

        {/* CLOSE */}
        <button
          onClick={() => setOpen(false)}
          className="absolute cursor-pointer top-4 right-4 p-2 rounded-lg 
                     text-[var(--text-secondary)] 
                     hover:bg-[var(--bg-hover)] 
                     transition"
        >
          <X size={18} />
        </button>

        {/* HEADER */}
        <div className="relative mb-6">
          <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            Create Department
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Organize your workspace into teams
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={onSubmit} className="space-y-4 relative">

          {/* NAME */}
          <div>
            <label className="text-xs text-[var(--text-secondary)]">
              Department Name
            </label>

            <input
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder="e.g. Engineering"
              required
              className="w-full mt-1 px-3 py-2 rounded-xl 
                         bg-[var(--bg-main)] 
                         border border-[var(--border)] 
                         text-sm text-[var(--text-primary)] 
                         placeholder:text-[var(--text-secondary)]
                         focus:outline-none 
                         focus:ring-2 focus:ring-[var(--accent)] 
                         transition"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-xs text-[var(--text-secondary)]">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              placeholder="Short description about the department..."
              rows={3}
              className="w-full mt-1 px-3 py-2 rounded-xl 
                         bg-[var(--bg-main)] 
                         border border-[var(--border)] 
                         text-sm text-[var(--text-primary)] 
                         placeholder:text-[var(--text-secondary)]
                         focus:outline-none 
                         focus:ring-2 focus:ring-[var(--accent)] 
                         transition resize-none"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-3">

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm rounded-xl 
                         bg-[var(--bg-hover)] 
                         text-[var(--text-secondary)] 
                         border border-[var(--border)]
                         hover:bg-[var(--bg-main)] 
                         transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm rounded-xl 
                         bg-[var(--accent)] text-white 
                         hover:bg-[var(--accent-soft)] 
                         hover:shadow-[0_0_15px_var(--accent-glow)] 
                         transition flex items-center gap-2"
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