import React, { useState, useEffect } from "react";
import { X, Search } from "lucide-react";
import { useJoinWorkspaceState } from "../state/useJoinWorkspaceState";
import { useJoinWorkspace } from "../hooks/useJoinWorkspace";
import Loader from "./Loader";

const JoinWorkspaceModal = ({ setOpen, fetchWorkspaces }) => {
  const state = useJoinWorkspaceState();
  const { search, join } = useJoinWorkspace(state, fetchWorkspaces);

  const [query, setQuery] = useState("");

  useEffect(() => {
    search("");
  }, []);

  const filteredWorkspaces = state.results.filter((ws) =>
    ws.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">

      {/* BACKDROP */}
      <div
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* PANEL */}
      <div className="relative w-full max-w-2xl mx-4 rounded-2xl 
                      bg-[var(--bg-secondary)] 
                      border border-[var(--border)] 
                      shadow-[0_20px_60px_rgba(0,0,0,0.8)] 
                      overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">

          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)]">
              Join Workspace
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Discover teams & collaborate instantly
            </p>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-md hover:bg-[var(--bg-hover)]"
          >
            <X size={16} className="text-[var(--text-secondary)]" />
          </button>
        </div>

        {/* SEARCH */}
        <div className="px-6 py-4 border-b border-[var(--border)]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-2.5 text-[var(--text-secondary)]" />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search workspaces..."
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm
                         bg-[var(--bg-main)] 
                         border border-[var(--border)] 
                         text-[var(--text-primary)] 
                         placeholder:text-[var(--text-secondary)]
                         focus:outline-none 
                         focus:border-[var(--accent)]"
            />
          </div>
        </div>

        {/* LIST */}
        <div className="max-h-[420px] overflow-y-auto">

          {state.loading && (
            <div className="py-10 flex justify-center">
              <Loader />
            </div>
          )}

          {!state.loading && filteredWorkspaces.length === 0 && (
            <p className="text-center text-sm text-[var(--text-secondary)] py-10">
              No workspaces found
            </p>
          )}

          {filteredWorkspaces.map((ws) => (
            <div
              key={ws._id}
              className="group flex items-center justify-between px-6 py-4 
                         border-b border-[var(--border)] 
                         hover:bg-[var(--bg-hover)] transition"
            >

              {/* LEFT */}
              <div className="flex items-center gap-4">

                {/* ICON */}
                <div className="w-10 h-10 rounded-lg 
                                bg-[var(--bg-main)] 
                                border border-[var(--border)] 
                                flex items-center justify-center 
                                text-sm font-semibold text-[var(--accent)]">
                  {ws.name[0]}
                </div>

                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {ws.name}
                  </p>

                  <p className="text-xs text-[var(--text-secondary)]">
                    {ws.description || "No description"}
                  </p>
                </div>

              </div>

              {/* RIGHT */}
              <div>

                {ws.status === "joined" && (
                  <span className="text-xs px-2 py-1 rounded bg-green-500/10 text-green-400">
                    Joined
                  </span>
                )}

                {ws.status === "requested" && (
                  <span className="text-xs px-2 py-1 rounded bg-yellow-500/10 text-yellow-400">
                    Requested
                  </span>
                )}

                {ws.status === "none" && (
                  <button
                    onClick={() => join(ws._id)}
                    className="text-xs px-3 py-1.5 rounded-md 
                               bg-[var(--accent)] text-white 
                               hover:opacity-90 transition"
                  >
                    Join
                  </button>
                )}

              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
};

export default JoinWorkspaceModal;