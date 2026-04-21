const AddMembersModal = ({
  open,
  onClose,
  members,
  loadingMembers,
  activeChatRoom,
  onAddMember,
  onRemoveMember, // 🔥 required
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: "rgba(0,0,0,0.6)" }}
        onClick={onClose}
      />

      {/* MODAL */}
      <div
        className="relative w-[420px] max-h-[520px] rounded-2xl p-5 flex flex-col animate-slide"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        }}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold">Add Members</h2>
            <p className="text-xs text-muted mt-1">
              Invite people to this chatroom
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-xs px-2 py-1 rounded-lg"
            style={{ background: "var(--bg-hover)" }}
          >
            ✕
          </button>
        </div>

        {/* SEARCH */}
        <input
          placeholder="Search members..."
          className="input mb-4"
        />

        {/* LIST */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {loadingMembers ? (
            <div className="text-sm text-muted">Loading...</div>
          ) : (
            (Array.isArray(members) ? members : []).map((m) => {

              const alreadyAdded =
                activeChatRoom.members?.some(
                  (id) =>
                    id === m._id ||
                    id?._id?.toString() === m._id?.toString()
                );

              return (
                <div
                  key={m._id}
                  className="flex items-center justify-between p-2 rounded-xl"
                  style={{ background: "var(--bg-hover)" }}
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium"
                      style={{
                        background: "var(--accent-glow)",
                        color: "var(--accent)",
                      }}
                    >
                      {m.name?.charAt(0)?.toUpperCase()}
                    </div>

                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {m.name}
                      </span>
                      <span className="text-xs text-muted">
                        {m.email || "member"}
                      </span>
                    </div>
                  </div>

                  {/* BUTTON */}
                  <button
                    onClick={() =>
                      alreadyAdded
                        ? onRemoveMember(m._id)
                        : onAddMember(m._id)
                    }
                    className="px-3 py-1.5 text-xs rounded-lg"
                    style={{
                      background: alreadyAdded
                        ? "var(--bg-main)"
                        : "var(--accent)",
                      color: alreadyAdded
                        ? "var(--text-secondary)"
                        : "white",
                      border: alreadyAdded
                        ? "1px solid var(--border)"
                        : "none",
                    }}
                  >
                    {alreadyAdded ? "Remove" : "Add"}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* FOOTER */}
        <div
          className="pt-4 mt-4 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl text-sm"
            style={{ background: "var(--bg-hover)" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMembersModal;