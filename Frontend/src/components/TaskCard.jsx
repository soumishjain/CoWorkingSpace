import { useNavigate } from "react-router-dom";
import { useState } from "react";
import RejectModal from "./RejectModal";

const TaskCard = ({ task, userRole, onApprove, onReject }) => {
  const navigate = useNavigate();

  const [loadingAction, setLoadingAction] = useState(null);
  const [openRejectModal, setOpenRejectModal] = useState(false);

  const getPriorityColor = () => {
    if (task.priority === "high") return "text-red-500";
    if (task.priority === "medium") return "text-yellow-500";
    return "text-green-500";
  };

  const getStatusDot = () => {
    if (task.status === "completed") return "bg-green-500";
    if (task.status === "in-progress") return "bg-blue-500";
    if (task.status === "awaiting-approval") return "bg-purple-500";
    return "bg-gray-400";
  };

  const isManager = userRole === "manager";
  const isAwaiting = task.status === "awaiting-approval";

  const handleCardClick = (e) => {
    if (e.target.closest("button")) return;
    navigate(`task/${task._id}`);
  };

  const handleApproveClick = async () => {
    if (loadingAction) return;

    try {
      setLoadingAction("approve");
      await onApprove(task._id);
    } catch (err) {
      console.error("Approve failed:", err);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRejectSubmit = async (feedback) => {
    try {
      setLoadingAction("reject");
      await onReject(task._id, feedback);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group relative bg-white border border-gray-200 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      >

        {/* TOP */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${getStatusDot()}`} />
            <h2 className="font-semibold text-gray-900 text-sm group-hover:text-indigo-600 transition">
              {task.title}
            </h2>
          </div>

          <span className={`text-xs font-medium ${getPriorityColor()}`}>
            {task.priority}
          </span>
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
          {task.description || "No description"}
        </p>

        {/* PROGRESS */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progress</span>
            <span>{task.progress ?? 0}%</span>
          </div>

          <div className="h-[6px] w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${task.progress ?? 0}%` }}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
          <span>
            {task.deadline
              ? new Date(task.deadline).toLocaleDateString()
              : "No deadline"}
          </span>

          <span className="capitalize">
            {task.status.replace("-", " ")}
          </span>
        </div>

        {/* MANAGER ACTIONS */}
        {isManager && isAwaiting && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleApproveClick}
              disabled={loadingAction !== null}
              className="flex-1 bg-green-500 text-white text-xs py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
            >
              {loadingAction === "approve" ? "Approving..." : "Approve"}
            </button>

            <button
              onClick={() => setOpenRejectModal(true)}
              disabled={loadingAction !== null}
              className="flex-1 bg-red-500 text-white text-xs py-2 rounded-lg hover:bg-red-600 transition disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        )}

        {/* HOVER LIGHT */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl" />
      </div>

      {/* 🔥 REJECT MODAL */}
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