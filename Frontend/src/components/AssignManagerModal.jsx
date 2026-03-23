import React, { useEffect, useState } from "react";
import { getAllDepartmentMembers } from "../api/department.api";
import { Search, Loader2 } from "lucide-react";

const AssignManagerModal = ({
  workspaceId,
  departmentId,
  onClose,
  onAssignManager,
}) => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!workspaceId || !departmentId) return;
    fetchMembers();
  }, [workspaceId, departmentId]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await getAllDepartmentMembers(
        workspaceId,
        departmentId
      );
      setMembers(res.members || []);
    } catch (error) {
      console.error("FETCH ERROR:", error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = members.filter((m) =>
    (m.name || "").toLowerCase().includes(search.toLowerCase())
  );

  console.log("MODAL DATA:", {
  workspaceId,
  departmentId,
});

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">

      {/* MODAL */}
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-6">

        {/* HEADER */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Assign Manager
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Choose a team member to promote
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition"
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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members..."
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
        </div>

        {/* LIST */}
        <div className="max-h-80 overflow-y-auto space-y-2 pr-1">

          {/* LOADING */}
          {loading && (
            <div className="flex justify-center py-6">
              <Loader2 className="animate-spin text-gray-400" size={20} />
            </div>
          )}

          {/* EMPTY */}
          {!loading && filtered.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-6">
              No members found
            </p>
          )}

          {/* MEMBERS */}
          {!loading &&
            filtered.map((m) => (
              <div
                key={m._id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition group"
              >
                {/* LEFT */}
                <div className="flex items-center gap-3">

                  {/* AVATAR */}
                  {m.profileImage ? (
                    <img
                      src={m.profileImage}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-semibold text-sm">
                      {(m.name || "?")[0].toUpperCase()}
                    </div>
                  )}

                  {/* INFO */}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {m.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {m.email}
                    </p>
                  </div>
                </div>

                {/* BUTTON */}
                <button
                  onClick={() => {
                    console.log("ASSIGN CLICK:", {
  workspaceId,
  departmentId,
  userId: m._id
});
                    onAssignManager(departmentId, m._id);
                    onClose();
                  }}
                  className="text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium shadow-sm hover:opacity-90 active:scale-95 transition"
                >
                  Assign
                </button>
              </div>
            ))}
        </div>

      </div>
    </div>
  );
};

export default AssignManagerModal;