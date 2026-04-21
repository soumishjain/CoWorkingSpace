import React, { useEffect, useMemo } from "react";
import { useRemoveMemberState } from "../state/useRemoveMemberState";
import { useRemoveMember } from "../hooks/useRemoveMember";
import { Search, Crown, X } from "lucide-react";

const RemoveMemberModal = ({ workspaceId, onClose }) => {
  const state = useRemoveMemberState();
  const { query, setQuery, users, loading } = state;

  const { handleSearch, handleRemove } = useRemoveMember(
    state,
    workspaceId
  );

  useEffect(() => {
    handleSearch();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const filteredUsers = useMemo(() => {
    if (!query) return users;
    return users.filter((u) =>
      u.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [users, query]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* 🔥 BACKDROP */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
      />

      {/* 🔥 MODAL */}
      <div className="relative w-full max-w-lg rounded-2xl 
                      bg-[var(--bg-secondary)]/70 
                      backdrop-blur-2xl 
                      border border-[var(--border)] 
                      shadow-[0_20px_60px_rgba(0,0,0,0.7)] 
                      p-6">

        {/* 🔥 GLOW */}
        <div className="absolute inset-0 opacity-30 
                        bg-[radial-gradient(circle_at_top,rgba(255,106,0,0.2),transparent_70%)]" />

        {/* HEADER */}
        <div className="relative flex justify-between items-center mb-6">

          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Remove Members
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Manage workspace members
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg 
                       text-[var(--text-secondary)] 
                       hover:bg-[var(--bg-hover)] 
                       transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* 🔍 SEARCH */}
        <div className="relative mb-5">

          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
          />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search members..."
            className="w-full pl-9 pr-3 py-2 rounded-xl 
                       bg-[var(--bg-main)] 
                       border border-[var(--border)] 
                       text-sm text-[var(--text-primary)] 
                       placeholder:text-[var(--text-secondary)] 
                       focus:outline-none 
                       focus:ring-2 focus:ring-[var(--accent)] 
                       transition"
          />

        </div>

        {/* 🔥 LIST */}
        <div className="max-h-80 overflow-y-auto space-y-2 pr-1">

          {loading && (
            <p className="text-sm text-[var(--text-secondary)] text-center py-3">
              Loading members...
            </p>
          )}

          {!loading && filteredUsers.length === 0 && (
            <p className="text-sm text-[var(--text-secondary)] text-center py-3">
              No members found
            </p>
          )}

          {filteredUsers.map((user) => {
            const isAdmin = user.role === "admin";

            return (
              <div
                key={user._id}
                className="flex items-center justify-between px-3 py-2 rounded-xl 
                           bg-[var(--bg-main)]/60 
                           border border-[var(--border)] 
                           hover:bg-[var(--bg-hover)] 
                           transition"
              >

                {/* LEFT */}
                <div className="flex items-center gap-3">

                  <img
                    src={
                      user.profileImage ||
                      `https://ui-avatars.com/api/?name=${user.name}`
                    }
                    className="w-9 h-9 rounded-full object-cover border border-[var(--border)]"
                  />

                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {user.name}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {user.email}
                    </p>
                  </div>

                </div>

                {/* RIGHT */}
                {isAdmin ? (
                  <div className="flex items-center gap-1 text-xs 
                                  text-yellow-400 
                                  bg-yellow-500/10 
                                  border border-yellow-500/20 
                                  px-2 py-1 rounded-full">
                    <Crown size={12} />
                    Admin
                  </div>
                ) : (
                  <button
                    onClick={() => handleRemove(user._id)}
                    className="text-xs px-3 py-1.5 rounded-lg 
                               bg-red-500/10 text-red-400 
                               border border-red-500/20
                               hover:bg-red-500 hover:text-white 
                               hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] 
                               transition"
                  >
                    Remove
                  </button>
                )}

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default RemoveMemberModal;