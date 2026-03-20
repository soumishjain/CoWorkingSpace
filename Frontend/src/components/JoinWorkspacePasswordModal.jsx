import React, { useState } from "react";

const JoinWorkspacePasswordModal = ({
  workspace,
  onClose,
  onSubmit,
  loading
}) => {

  const [password, setPassword] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white w-full max-w-sm rounded-xl p-6">

        <h2 className="text-lg font-semibold mb-4">
          Join {workspace.name}
        </h2>

        <input
          type="password"
          placeholder="Enter workspace password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4"
        />

        <div className="flex justify-end gap-2">

          <button
            onClick={onClose}
            className="text-gray-500 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={() => onSubmit(workspace._id, password)}
            className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg text-sm"
            disabled={loading}
          >
            {loading ? "Sending..." : "Join"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default JoinWorkspacePasswordModal;