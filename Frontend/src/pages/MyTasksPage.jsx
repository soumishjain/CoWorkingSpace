// MyTasksPage.jsx
import { useSubtask } from "../hooks/useSubtask";

const MyTasksPage = () => {
  const { mySubtasks, completeSubtask } = useSubtask();

  const getPriorityStyle = (priority) => {
    if (priority === "high")
      return "border-red-400/40 text-red-400";
    if (priority === "medium")
      return "border-yellow-400/40 text-yellow-400";
    return "border-green-400/40 text-green-400";
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* HEADER */}
      <h1
        className="text-2xl font-semibold mb-6"
        style={{ color: "var(--text-primary)" }}
      >
        My Tasks
      </h1>

      {/* EMPTY */}
      {mySubtasks.length === 0 && (
        <p
          className="text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          No tasks assigned
        </p>
      )}

      {/* LIST */}
      <div className="space-y-3">
        {mySubtasks.map((s) => (
          <div
            key={s._id}
            className="group rounded-xl p-4 flex justify-between items-center transition"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
            }}
          >
            {/* LEFT */}
            <div className="flex flex-col gap-1.5">

              {/* TITLE */}
              <h2
                className="text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {s.title}
              </h2>

              {/* PARENT */}
              <p
                className="text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                {s.taskId?.title || "—"}
              </p>

              {/* META */}
              <div className="flex gap-2 flex-wrap mt-1 text-[11px]">

                {/* PRIORITY */}
                <span
                  className={`px-2 py-0.5 rounded-md border ${getPriorityStyle(
                    s.taskId?.priority
                  )}`}
                >
                  {s.taskId?.priority}
                </span>

                {/* DEADLINE */}
                <span
                  className="px-2 py-0.5 rounded-md"
                  style={{
                    background: "var(--bg-hover)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {s.taskId?.deadline
                    ? new Date(s.taskId.deadline).toLocaleDateString()
                    : "No deadline"}
                </span>

                {/* POINTS */}
                <span
                  className="px-2 py-0.5 rounded-md"
                  style={{
                    background: "var(--bg-hover)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {s.points} pts
                </span>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col items-end gap-2">

              {/* STATUS */}
              {s.status === "completed" ? (
                <span
                  className="text-[11px] px-2 py-0.5 rounded-md"
                  style={{
                    background: "rgba(34,197,94,0.1)",
                    color: "rgb(34,197,94)",
                  }}
                >
                  Completed
                </span>
              ) : (
                <button
                  onClick={() => completeSubtask(s._id)}
                  className="text-[11px] px-3 py-1 rounded-md transition"
                  style={{
                    background: "var(--accent)",
                    color: "white",
                  }}
                >
                  Mark Done
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTasksPage;