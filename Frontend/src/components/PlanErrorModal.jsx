const PlanErrorModal = ({ open, message, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* modal */}
      <div
        className="relative p-6 rounded-2xl w-[320px] text-center"
        style={{
          background: "var(--bg-secondary)",
        }}
      >
        <h2 className="text-lg font-semibold mb-2">
          Feature Locked 🔒
        </h2>

        <p
          className="text-sm mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          {message || "This feature is not allowed in your plan."}
        </p>

        <button
          onClick={onClose}
          className="px-4 py-2 rounded"
          style={{
            background: "var(--accent)",
            color: "white",
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default PlanErrorModal;