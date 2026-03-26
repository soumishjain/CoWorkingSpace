import { useState } from "react";

const RejectModal = ({ onClose, onSubmit }) => {
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSubmit(feedback);
      onClose();
    } catch (err) {
      console.error("Reject failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">

        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Reject Task
        </h2>

        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter rejection feedback..."
          className="w-full h-28 resize-none border border-gray-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-red-400"
        />

        <div className="flex justify-end gap-3 mt-5">

          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? "Rejecting..." : "Reject"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default RejectModal;