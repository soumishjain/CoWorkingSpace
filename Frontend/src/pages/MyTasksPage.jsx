import { useSubtask } from "../hooks/useSubtask";

const MyTasksPage = () => {
  const { mySubtasks, completeSubtask } = useSubtask();

  const getPriorityStyle = (priority) => {
    if (priority === "high")
      return "bg-red-50 text-red-600 border border-red-200";
    if (priority === "medium")
      return "bg-yellow-50 text-yellow-600 border border-yellow-200";
    return "bg-green-50 text-green-600 border border-green-200";
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* HEADER */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        My Tasks
      </h1>

      {/* EMPTY */}
      {mySubtasks.length === 0 && (
        <p className="text-gray-500 text-sm">
          No tasks assigned
        </p>
      )}

      {/* LIST */}
      <div className="space-y-4">
        {mySubtasks.map((s) => (
          <div
            key={s._id}
            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex justify-between items-center"
          >
            {/* LEFT */}
            <div className="flex flex-col gap-2">

              {/* SUBTASK TITLE */}
              <h2 className="text-sm font-semibold text-gray-800">
                {s.title}
              </h2>

              {/* PARENT TASK */}
              <p className="text-xs text-gray-500">
                Task:{" "}
                <span className="font-medium text-gray-700">
                  {s.taskId?.title}
                </span>
              </p>

              {/* META */}
              <div className="flex gap-2 flex-wrap mt-1 text-xs">

                {/* PRIORITY */}
                <span
                  className={`px-3 py-1 rounded-full ${
                    getPriorityStyle(s.taskId?.priority)
                  }`}
                >
                  {s.taskId?.priority}
                </span>

                {/* DEADLINE */}
                <span className="bg-gray-100 px-3 py-1 rounded-full">
                  📅{" "}
                  {s.taskId?.deadline
                    ? new Date(s.taskId.deadline).toLocaleDateString()
                    : "No deadline"}
                </span>

                {/* POINTS */}
                <span className="bg-gray-100 px-3 py-1 rounded-full">
                  ⚡ {s.points} pts
                </span>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col items-end gap-2">

              {/* STATUS */}
              {s.status === "completed" ? (
                <span className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full font-medium">
                  ✔ Completed
                </span>
              ) : (
                <button
                  onClick={() => completeSubtask(s._id)}
                  className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1.5 rounded-full hover:scale-105 transition"
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