import { AlertTriangle } from "lucide-react";

const DeleteConfirmModal = ({ onClose, onConfirm, loading }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center 
                    bg-black/60 backdrop-blur-sm">

      <div className="w-full max-w-sm rounded-2xl 
                      bg-[var(--bg-secondary)] 
                      border border-[var(--border)] 
                      p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">

        {/* ICON */}
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-full bg-red-500/10 border border-red-500/20">
            <AlertTriangle className="text-red-400" />
          </div>
        </div>

        {/* TEXT */}
        <h2 className="text-center text-lg font-semibold text-[var(--text-primary)]">
          Delete Workspace?
        </h2>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-2">
          This action cannot be undone. All data will be permanently removed.
        </p>

        {/* ACTIONS */}
        <div className="flex gap-3 mt-6">

          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl text-sm 
                       border border-[var(--border)] 
                       bg-[var(--bg-secondary)] 
                       hover:bg-[var(--bg-hover)] transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2 rounded-xl text-sm text-white 
                       bg-red-500 
                       hover:bg-red-600 
                       transition 
                       shadow-[0_0_15px_rgba(239,68,68,0.4)]"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;