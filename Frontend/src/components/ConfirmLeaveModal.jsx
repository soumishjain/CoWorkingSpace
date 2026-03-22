import React from "react";

const ConfirmLeaveModal = ({ onClose, onConfirm, loading }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">

      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-5">

        {/* HEADER */}
        <h2 className="text-lg font-semibold text-gray-900">
          Leave Workspace
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          Are you sure you want to leave this workspace? You will lose access to all departments.
        </p>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 mt-5">

          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm text-white rounded-lg ${
              loading
                ? "bg-red-300 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {loading ? "Leaving..." : "Leave"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default ConfirmLeaveModal;