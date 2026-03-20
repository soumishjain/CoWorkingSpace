import React, { useState, useEffect } from "react";
import { useJoinWorkspaceState } from "../state/useJoinWorkspaceState";
import { useJoinWorkspace } from "../hooks/useJoinWorkspace";
import { useDebounce } from "../hooks/useDebounce";

// 🔥 PASSWORD MODAL
const PasswordModal = ({ workspace, onClose, onSubmit, loading }) => {
  const [password, setPassword] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
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
            disabled={loading}
            className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
          >
            {loading ? "Sending..." : "Join"}
          </button>
        </div>

      </div>
    </div>
  );
};

const JoinWorkspaceModal = ({ setOpen, fetchWorkspaces }) => {

  const state = useJoinWorkspaceState();
  const { search, join } = useJoinWorkspace(state, fetchWorkspaces);

  const [query, setQuery] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  const debouncedQuery = useDebounce(query, 300);

  // 🔥 LIVE SEARCH
  useEffect(() => {
    if (debouncedQuery.trim()) {
      search(debouncedQuery);
    } else {
      state.setResults([]);
    }
  }, [debouncedQuery]);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">

          {/* 🔥 HEADER */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Join Workspace
            </h2>

            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>

          {/* 🔥 SEARCH */}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search workspaces..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />

          {/* 🔥 RESULTS */}
          <div className="max-h-64 overflow-y-auto space-y-2">

            {state.loading && (
              <p className="text-sm text-gray-500 text-center">
                Searching...
              </p>
            )}

            {!state.loading && query && state.results.length === 0 && (
              <p className="text-sm text-gray-500 text-center">
                No workspaces found
              </p>
            )}

            {state.results.map((ws) => (
              <div
                key={ws._id}
                className="flex items-center justify-between p-3 rounded-xl border hover:shadow-sm transition"
              >

                {/* LEFT */}
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {ws.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {ws.description || "No description"}
                  </p>
                </div>

                {/* RIGHT */}
                {ws.status === "joined" && (
                  <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-600 font-medium">
                    Joined
                  </span>
                )}

                {ws.status === "requested" && (
                  <span className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                    Req Sent
                  </span>
                )}

                {ws.status === "none" && (
                  <button
                    onClick={() => setSelectedWorkspace(ws)}
                    className="bg-[var(--color-primary)] text-white text-xs px-4 py-1.5 rounded-full hover:opacity-90"
                  >
                    Join
                  </button>
                )}

              </div>
            ))}

          </div>

        </div>
      </div>

      {/* 🔥 PASSWORD MODAL */}
      {selectedWorkspace && (
        <PasswordModal
          workspace={selectedWorkspace}
          loading={state.loading}
          onClose={() => setSelectedWorkspace(null)}
          onSubmit={(id, password) => {
            join(id, password);
            setSelectedWorkspace(null);
          }}
        />
      )}
    </>
  );
};

export default JoinWorkspaceModal;