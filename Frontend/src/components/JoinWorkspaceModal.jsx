import React, { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { useJoinWorkspaceState } from "../state/useJoinWorkspaceState";
import { useJoinWorkspace } from "../hooks/useJoinWorkspace";

const JoinWorkspaceModal = ({ setOpen, fetchWorkspaces }) => {
  const state = useJoinWorkspaceState();
  const { search, join } = useJoinWorkspace(state, fetchWorkspaces);

  const [query, setQuery] = useState("");

  // 🔥 Load ALL workspaces on open
  useEffect(() => {
    search(""); // empty search = get all
  }, []);

  // 🔥 Client-side filtering (fast feel)
  const filteredWorkspaces = state.results.filter((ws) =>
    ws.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 border border-gray-100">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Join Workspace
            </h2>
            <p className="text-xs text-gray-500">
              Discover and join available workspaces
            </p>
          </div>

          <button onClick={() => setOpen(false)}>
            <X size={20} className="text-gray-400 hover:text-black transition" />
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative mb-5">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search workspaces..."
            className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition text-sm"
          />
        </div>

        {/* RESULTS */}
        <div className="max-h-[350px] overflow-y-auto space-y-3 pr-1">

          {state.loading && (
            <p className="text-sm text-gray-500 text-center py-6">
              Loading workspaces...
            </p>
          )}

          {!state.loading && filteredWorkspaces.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-6">
              No matching workspaces
            </p>
          )}

          {filteredWorkspaces.map((ws) => (
            <div
              key={ws._id}
              className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-white hover:shadow-md hover:border-gray-200 transition-all duration-200"
            >

              {/* LEFT */}
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-900">
                  {ws.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
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
                  onClick={() => join(ws._id)}
                  disabled={state.loading}
                  className="text-xs px-4 py-1.5 rounded-full bg-black text-white hover:bg-gray-800 transition flex items-center gap-2"
                >
                  {state.loading && (
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  )}
                  Join
                </button>
              )}

            </div>
          ))}

        </div>

      </div>
    </div>
  );
};

export default JoinWorkspaceModal;