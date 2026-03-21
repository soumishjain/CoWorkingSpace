import React, { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { useJoinWorkspaceState } from "../state/useJoinWorkspaceState";
import { useJoinWorkspace } from "../hooks/useJoinWorkspace";
import { useDebounce } from "../hooks/useDebounce";

// 🔥 PASSWORD MODAL (UPGRADED)
const PasswordModal = ({ workspace, onClose, onSubmit, loading }) => {
  const [password, setPassword] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60]">

      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Join {workspace.name}
          </h2>

          <button onClick={onClose}>
            <X size={18} className="text-gray-400 hover:text-gray-700" />
          </button>
        </div>

        <input
          type="password"
          placeholder="Enter workspace password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 rounded-lg px-3 py-2 mb-4 outline-none transition"
        />

        <div className="flex justify-end gap-2">

          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            Cancel
          </button>

          <button
            onClick={() => onSubmit(workspace._id, password)}
            disabled={loading}
            className="px-4 py-2 text-sm bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 flex items-center gap-2 transition disabled:opacity-50"
          >
            {loading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {loading ? "Joining..." : "Join"}
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

  useEffect(() => {
    if (debouncedQuery.trim()) {
      search(debouncedQuery);
    } else {
      state.setResults([]);
    }
  }, [debouncedQuery]);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">

          {/* HEADER */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Join Workspace
            </h2>

            <button onClick={() => setOpen(false)}>
              <X size={20} className="text-gray-400 hover:text-gray-700" />
            </button>
          </div>

          {/* SEARCH BAR */}
          <div className="relative mb-4">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search workspaces..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
            />
          </div>

          {/* RESULTS */}
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
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition"
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
                    Requested
                  </span>
                )}

                {ws.status === "none" && (
                  <button
                    onClick={() => setSelectedWorkspace(ws)}
                    className="bg-[var(--color-primary)] text-white text-xs px-4 py-1.5 rounded-full hover:opacity-90 transition"
                  >
                    Join
                  </button>
                )}

              </div>
            ))}

          </div>

        </div>
      </div>

      {/* PASSWORD MODAL */}
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