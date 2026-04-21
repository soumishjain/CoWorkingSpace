import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getAllDepartmentMembers } from "../api/department.api";
import { Search, Loader2, X, Check } from "lucide-react";

const AssignManagerModal = ({
  workspaceId,
  departmentId,
  onClose,
  onAssignManager,
}) => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [assigningId, setAssigningId] = useState(null);

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
    } catch (err) {
      console.log("FETCH ERROR:", err);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = members.filter((m) =>
    (m.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">

      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* MODAL */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl mx-4 rounded-2xl 
                   bg-[var(--bg-secondary)] 
                   border border-[var(--border)] 
                   shadow-[0_20px_60px_rgba(0,0,0,0.8)] 
                   p-6"
      >

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Assign Manager
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Promote a member to manager
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[var(--bg-hover)]"
          >
            <X size={18} className="text-[var(--text-secondary)]" />
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative mb-5">
          <Search
            size={16}
            className="absolute left-3 top-2.5 text-[var(--text-secondary)]"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm
                       bg-[var(--bg-main)] 
                       border border-[var(--border)] 
                       text-[var(--text-primary)] 
                       placeholder:text-[var(--text-secondary)]
                       focus:outline-none 
                       focus:ring-2 focus:ring-[var(--accent)]"
          />
        </div>

        {/* LIST */}
        <div className="max-h-80 overflow-y-auto space-y-2 pr-1 hide-scrollbar">

          {loading && (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-[var(--accent)]" />
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <p className="text-center text-sm text-[var(--text-secondary)] py-6">
              No members found
            </p>
          )}

          {!loading &&
            filtered.map((m) => {
              const isManager = m.role === "manager"; // 🔥 IMPORTANT

              return (
                <div
                  key={m._id}
                  className="flex items-center justify-between p-3 rounded-xl 
                             bg-[var(--bg-main)] 
                             border border-[var(--border)] 
                             hover:border-[var(--accent)] 
                             transition"
                >

                  {/* LEFT */}
                  <div className="flex items-center gap-3">

                    {/* AVATAR */}
                    {m.profileImage ? (
                      <img
                        src={m.profileImage}
                        className="w-10 h-10 rounded-full object-cover border border-[var(--border)]"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full 
                                      bg-[var(--accent)]/15 
                                      text-[var(--accent)] 
                                      flex items-center justify-center 
                                      font-semibold text-sm">
                        {(m.name || "?")[0].toUpperCase()}
                      </div>
                    )}

                    {/* INFO */}
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        {m.name}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {m.email}
                      </p>
                    </div>

                  </div>

                  {/* RIGHT */}
                  {isManager ? (
                    <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full 
                                     bg-green-500/10 text-green-400 border border-green-500/20">
                      <Check size={12} />
                      Assigned
                    </span>
                  ) : (
                    <button
                      disabled={assigningId === m._id}
                      onClick={async () => {
                        try {
                          setAssigningId(m._id);
                          await onAssignManager(departmentId, m._id);
                          onClose();
                        } catch (err) {
                          console.log(err);
                        } finally {
                          setAssigningId(null);
                        }
                      }}
                      className="text-xs px-4 py-1.5 rounded-lg 
                                 bg-[var(--accent)] text-white 
                                 hover:bg-[var(--accent-soft)] 
                                 transition 
                                 disabled:opacity-60"
                    >
                      {assigningId === m._id ? "Assigning..." : "Assign"}
                    </button>
                  )}

                </div>
              );
            })}

        </div>

      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default AssignManagerModal;