const DeleteChatroomConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title = "Delete",
  message = "Are you sure?",
  loading = false,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: "rgba(0,0,0,0.6)" }}
        onClick={onClose}
      />

      {/* MODAL */}
      <div
        className="relative w-[360px] rounded-2xl p-6 flex flex-col animate-slide"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        }}
      >
        <h2 className="text-base font-semibold mb-2 text-red-400">
          {title}
        </h2>

        <p className="text-xs text-muted mb-5">
          {message}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl text-sm"
            style={{
              background: "var(--bg-hover)",
              border: "1px solid var(--border)",
            }}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2 rounded-xl text-sm text-white"
            style={{
              background: "linear-gradient(135deg, #ff3b3b, #ff6a00)",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteChatroomConfirmModal;