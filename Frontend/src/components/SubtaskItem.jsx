import toast from "react-hot-toast";

const SubtaskItem = ({
  subtask,
  allSubtasks,
  onClaim,
  userRole,
}) => {
  const userId = localStorage.getItem("userId");

  const isMine = subtask.assignedTo?._id === userId;
  const isManager = userRole === "manager" || userRole === "admin";
  const isCompleted = subtask.status === "completed";
  const isAssigned = !!subtask.assignedTo;

  // 🔥 ACTIVE TASK CHECK
  const myActiveSubtask = allSubtasks.find(
    (s) =>
      s.assignedTo?._id === userId &&
      s.status !== "completed"
  );

  const alreadyWorking = !!myActiveSubtask;

  const handleClaim = () => {
    if (isManager) return;

    if (alreadyWorking) {
      toast.error("Complete current subtask first ⚡");
      return;
    }

    onClaim(subtask._id);
    toast.success("Subtask claimed 🚀");
  };

  return (
    <div
      className="group relative p-4 rounded-xl flex justify-between items-center transition-all duration-200 hover:-translate-y-[2px]"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
      }}
    >

      {/* LEFT */}
      <div className="flex flex-col gap-1.5">

        <h3
          className="text-sm font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          {subtask.title}
        </h3>

        <div className="flex items-center gap-2 text-[11px]">

          {/* POINTS */}
          <span
            className="px-2 py-0.5 rounded-md"
            style={{
              background: "var(--bg-hover)",
              color: "var(--text-secondary)",
            }}
          >
            {subtask.points} pts
          </span>

          {/* USER */}
          {subtask.assignedTo && (
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-md"
              style={{
                background: "var(--bg-hover)",
                color: "var(--text-secondary)",
              }}
            >
              <img
                src={
                  subtask.assignedTo.profileImage ||
                  "https://i.pravatar.cc/30"
                }
                className="w-4 h-4 rounded-full"
                alt="user"
              />
              <span>{subtask.assignedTo.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">

        {/* CLAIM */}
        {!isAssigned && !isManager && (
          <button
            onClick={handleClaim}
            disabled={alreadyWorking}
            className="text-[11px] px-3 py-1 rounded-md transition-all duration-200 hover:scale-[1.05] active:scale-[0.95]"
            style={{
              background: alreadyWorking
                ? "var(--bg-hover)"
                : "var(--accent)",
              color: alreadyWorking
                ? "var(--text-secondary)"
                : "white",
              cursor: alreadyWorking ? "not-allowed" : "pointer",
            }}
          >
            Claim
          </button>
        )}

        {/* COMPLETED */}
        {isCompleted && (
          <span
            className="text-[11px] px-2 py-1 rounded-md"
            style={{
              background: "rgba(34,197,94,0.1)",
              color: "rgb(34,197,94)",
            }}
          >
            Completed
          </span>
        )}

        {/* 🔥 CLAIMED (ANY USER) */}
        {isAssigned && !isCompleted && (
          <span
            className="text-[11px] px-2 py-1 rounded-md"
            style={{
              background: "var(--bg-hover)",
              color: "var(--text-secondary)",
            }}
          >
            Claimed
          </span>
        )}

      </div>
    </div>
  );
};

export default SubtaskItem;