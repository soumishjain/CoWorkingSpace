import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import RejectModal from "./RejectModal";

const TaskCard = ({ task, userRole, onApprove, onReject }) => {
  const navigate = useNavigate();

  const [loadingAction, setLoadingAction] = useState(null);
  const [openRejectModal, setOpenRejectModal] = useState(false);

  // 🔥 SAFE CONDITIONS
  const isManager = ["manager"].includes(userRole);

  const isAwaiting =
    task.status?.toLowerCase().includes("await");

  // 🔥 DEBUG LOGS (IMPORTANT)
  useEffect(() => {
    console.log("------------ TASK DEBUG ------------");
    console.log("TASK ID:", task._id);
    console.log("ROLE:", userRole);
    console.log("STATUS:", task.status);
    console.log("isManager:", isManager);
    console.log("isAwaiting:", isAwaiting);
    console.log("-----------------------------------");
  }, [task, userRole]);

  // 🔥 APPROVE
  const handleApproveClick = async (e) => {
    e.stopPropagation();

    console.log("🔥 APPROVE BUTTON CLICKED");

    if (loadingAction) return;

    try {
      setLoadingAction("approve");

      if (!onApprove) {
        console.error("❌ onApprove NOT PASSED");
        return;
      }

      console.log("👉 Calling onApprove with:", task._id);

      const res = await onApprove(task._id);

      console.log("✅ APPROVE RESPONSE:", res);
    } catch (err) {
      console.error("❌ APPROVE ERROR:", err);
    } finally {
      setLoadingAction(null);
    }
  };

  // 🔥 REJECT
  const handleRejectSubmit = async (feedback) => {
    try {
      console.log("🔥 REJECT CLICKED", task._id, feedback);

      setLoadingAction("reject");

      const res = await onReject(task._id, feedback);

      console.log("✅ REJECT RESPONSE:", res);
    } catch (err) {
      console.error("❌ REJECT ERROR:", err);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleCardClick = () => {
    navigate(`task/${task._id}`);
  };

  const progress = task.progress ?? 0;

  return (
    <>
      <div
      onClick={handleCardClick}
        className="group relative p-4 rounded-xl transition"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
        }}
      >
        {/* TOP */}
        <div className="flex justify-between items-start mb-3">
          <h2
            className="text-sm font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            {task.title}
          </h2>

          <span
            className="text-[11px] px-2 py-0.5 rounded-md"
            style={{
              background: "var(--bg-hover)",
              color: "var(--text-secondary)",
            }}
          >
            {task.priority}
          </span>
        </div>

        {/* DESC */}
        <p
          className="text-sm mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          {task.description || "No description"}
        </p>

        {/* PROGRESS */}
        <div className="mb-4">
          <div className="flex justify-between text-[11px] mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>

          <div
            className="h-[6px] w-full rounded-full overflow-hidden"
            style={{ background: "var(--bg-hover)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${progress}%`,
                background: "var(--accent)",
              }}
            />
          </div>
        </div>

        {/* STATUS */}
        <div className="text-[11px] mb-3">
          Status: {task.status}
        </div>

        {/* 🔥 ACTION BUTTONS */}
        {isManager && isAwaiting ? (
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleApproveClick}
              disabled={loadingAction !== null}
              className="flex-1 text-xs py-2 rounded-md"
              style={{
                background: "var(--accent)",
                color: "white",
              }}
            >
              {loadingAction === "approve"
                ? "Approving..."
                : "Approve"}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                console.log("🔥 OPEN REJECT MODAL");
                setOpenRejectModal(true);
              }}
              className="flex-1 text-xs py-2 rounded-md"
              style={{
                background: "var(--bg-hover)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
              }}
            >
              Reject
            </button>
          </div>
        ) : (
          <p
            className="text-xs mt-2"
            style={{ color: "var(--text-secondary)" }}
          >
            {/* ❌ Buttons hidden (check role/status) */}
          </p>
        )}
      </div>

      {/* MODAL */}
      {openRejectModal && (
        <RejectModal
          onClose={() => setOpenRejectModal(false)}
          onSubmit={handleRejectSubmit}
        />
      )}
    </>
  );
};

export default TaskCard;