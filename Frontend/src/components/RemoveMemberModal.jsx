import React, { useEffect, useMemo } from "react";
import { useRemoveMemberState } from "../state/useRemoveMemberState";
import { useRemoveMember } from "../hooks/useRemoveMember";
import { Search, Crown } from "lucide-react";

const RemoveMemberModal = ({ workspaceId, onClose }) => {
  const state = useRemoveMemberState();
  const { query, setQuery, users, loading } = state;

  const { handleSearch, handleRemove } = useRemoveMember(
    state,
    workspaceId
  );

  // 🔥 initial load (all members)
  useEffect(() => {
    handleSearch(); // empty query → all members
  }, []);

  // 🔥 debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // 🔥 optional local filter (extra smooth UX)
  const filteredUsers = useMemo(() => {
    if (!query) return users;
    return users.filter((u) =>
      u.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [users, query]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

      <div className="bg-white w-full max-w-lg rounded-2xl p-5 shadow-2xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Remove Members
            </h2>
            <p className="text-xs text-gray-500">
              Manage workspace members
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg"
          >
            ✕
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative mb-4">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search members..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        {/* LIST */}
        <div className="max-h-80 overflow-y-auto space-y-2 pr-1">

          {loading && (
            <p className="text-sm text-gray-400 text-center py-3">
              Loading members...
            </p>
          )}

          {!loading && filteredUsers.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-3">
              No members found
            </p>
          )}

          {filteredUsers.map((user) => {
            const isAdmin = user.role === "admin"; // 🔥 IMPORTANT

            return (
              <div
                key={user._id}
                className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50 transition"
              >

                {/* LEFT */}
                <div className="flex items-center gap-3">
                  <img
                    src={
                      user.profileImage ||
                      `https://ui-avatars.com/api/?name=${user.name}`
                    }
                    className="w-9 h-9 rounded-full object-cover"
                  />

                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* RIGHT */}
                {isAdmin ? (
                  <div className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                    <Crown size={12} />
                    Admin
                  </div>
                ) : (
                  <button
                    onClick={() => handleRemove(user._id)}
                    className="text-xs bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
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