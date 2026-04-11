import { useParams } from "react-router-dom";
import { useSubtask } from "../hooks/useSubtask";
import { useTask } from "../hooks/useTask";
import SubtaskItem from "../components/SubtaskItem";
import CircularProgress from "../components/CircularProgress";

const TaskDetailsPage = () => {
  const { taskId, departmentId, workspaceId } = useParams();

  const { tasks, role, loading } = useTask(workspaceId, departmentId);

  const { subtasks, claimSubtask, completeSubtask } = useSubtask(
    role ? taskId : null,
    role ? departmentId : null
  );

  if (loading || !role) {
    return <p className="p-6" style={{ color: "var(--text-secondary)" }}>Loading...</p>;
  }

  const task = tasks.find((t) => t._id === taskId);
  if (!task) return <p className="p-6">Task not found</p>;

  const completed = subtasks.filter(s => s.status === "completed").length;
  const total = subtasks.length;
  const pending = total - completed;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">

      {/* 🔥 HEADER (CLEAN CARD STYLE) */}
      <div
        className="rounded-2xl p-6 flex flex-col lg:flex-row gap-6"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
        }}
      >
        {/* LEFT */}
        <div className="flex-1 space-y-4">

          <div>
            <h1
              className="text-xl font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {task.title}
            </h1>

            <p
              className="text-sm mt-1 max-w-xl"
              style={{ color: "var(--text-secondary)" }}
            >
              {task.description || "No description provided"}
            </p>
          </div>

          {/* META */}
          <div className="flex flex-wrap gap-2 text-xs">

            <span
              className="px-3 py-1 rounded-md"
              style={{
                background: "var(--bg-hover)",
                color: "var(--text-secondary)",
              }}
            >
              ⚡ {task.totalPoints} pts
            </span>

            <span
              className="px-3 py-1 rounded-md"
              style={{
                background: "var(--bg-hover)",
                color: "var(--text-secondary)",
              }}
            >
              📅 {task.deadline
                ? new Date(task.deadline).toLocaleDateString()
                : "No deadline"}
            </span>

            <span
              className="px-3 py-1 rounded-md capitalize"
              style={{
                background: "var(--bg-hover)",
                color: "var(--text-secondary)",
              }}
            >
              {task.status.replace("-", " ")}
            </span>
          </div>

          {/* MEMBERS */}
          <div className="flex items-center gap-2">
            {task.assignedMembers?.map((user) => (
              <img
                key={user._id}
                src={user.profileImage || "https://i.pravatar.cc/40"}
                className="w-8 h-8 rounded-full"
                style={{ border: "2px solid var(--bg-secondary)" }}
              />
            ))}
          </div>
        </div>

        {/* RIGHT (PROGRESS + STATS) */}
        <div className="flex flex-col items-center justify-center gap-3 min-w-[140px]">

          <CircularProgress value={task.progress ?? 0} />

          <div className="text-xs text-center" style={{ color: "var(--text-secondary)" }}>
            {completed} completed • {pending} pending
          </div>
        </div>
      </div>

      {/* 🔥 STATS STRIP (THIS FIXES EMPTY FEEL) */}
      <div className="grid grid-cols-3 gap-4">

        <div
          className="p-4 rounded-xl"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
          }}
        >
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Total
          </p>
          <h3 style={{ color: "var(--text-primary)" }}>{total}</h3>
        </div>

        <div
          className="p-4 rounded-xl"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
          }}
        >
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Completed
          </p>
          <h3 style={{ color: "rgb(34,197,94)" }}>{completed}</h3>
        </div>

        <div
          className="p-4 rounded-xl"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
          }}
        >
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Pending
          </p>
          <h3 style={{ color: "var(--accent)" }}>{pending}</h3>
        </div>

      </div>

      {/* 🔥 SUBTASK SECTION */}
      <div>

        <div className="flex justify-between items-center mb-3">
          <h2
            className="text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Subtasks
          </h2>

          <span
            className="text-xs px-2 py-1 rounded-md"
            style={{
              background: "var(--bg-hover)",
              color: "var(--text-secondary)",
            }}
          >
            {total} items
          </span>
        </div>

        {subtasks.length === 0 ? (
          <div
            className="p-6 rounded-xl text-center"
            style={{
              background: "var(--bg-secondary)",
              border: "1px dashed var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            No subtasks yet 🚀
          </div>
        ) : (
          <div className="space-y-3">
            {subtasks.map((subtask) => (
              <SubtaskItem
                key={subtask._id}
                subtask={subtask}
                allSubtasks={subtasks}
                onClaim={claimSubtask}
                onComplete={completeSubtask}
                userRole={role}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default TaskDetailsPage;