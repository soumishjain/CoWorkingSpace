import { useParams } from "react-router-dom";
import { useSubtask } from "../hooks/useSubtask";
import { useTask } from "../hooks/useTask";
import SubtaskItem from "../components/SubtaskItem";
import CircularProgress from "../components/CircularProgress";

// 🔥 BIGGER CIRCULAR PROGRESS

const TaskDetailsPage = () => {
  const { taskId, departmentId, workspaceId } = useParams();

  const { subtasks, claimSubtask, completeSubtask } =
    useSubtask(taskId, departmentId);

  const { tasks } = useTask(workspaceId, departmentId);

  const task = tasks.find((t) => t._id === taskId);

  if (!task) return <p className="p-6">Loading...</p>;

  const getPriorityStyle = () => {
    if (task.priority === "high")
      return "bg-red-50 text-red-600 border border-red-200";
    if (task.priority === "medium")
      return "bg-yellow-50 text-yellow-600 border border-yellow-200";
    return "bg-green-50 text-green-600 border border-green-200";
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">

      {/* 🔥 BIG HEADER CARD */}
      <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm flex justify-between gap-8 items-center">

        {/* LEFT SIDE */}
        <div className="flex-1">

          {/* TITLE */}
          <h1 className="text-2xl uppercase font-semibold text-gray-800 mb-3">
            {task.title}
          </h1>

          {/* DESCRIPTION */}
          <p className="text-gray-500 text-sm mb-6 max-w-2xl">
            {task.description || "No description provided"}
          </p>

          {/* META */}
          <div className="flex flex-wrap gap-3 text-sm">

            <span className={`px-4 py-1.5 rounded-full ${getPriorityStyle()}`}>
              {task.priority}
            </span>

            <span className="bg-gray-100 px-4 py-1.5 rounded-full">
              ⚡ {task.totalPoints} pts
            </span>

            <span className="bg-gray-100 px-4 py-1.5 rounded-full">
              📅 {new Date(task.deadline).toLocaleDateString()}
            </span>

            <span className="bg-gray-100 px-4 py-1.5 rounded-full capitalize">
              {task.status.replace("-", " ")}
            </span>
          </div>

          {/* MEMBERS */}
          <div className="flex items-center gap-3 mt-6">
            {task.assignedMembers?.map((user) => (
              <img
                key={user._id}
                src={user.profileImage || "https://i.pravatar.cc/40"}
                className="w-9 h-9 rounded-full border-2 border-white shadow"
              />
            ))}
          </div>
        </div>

        {/* RIGHT SIDE → BIG PROGRESS */}
        <div className="flex flex-col items-center justify-center min-w-[140px]">
          <CircularProgress value={task.progress} />
          <span className="text-sm text-gray-500 mt-2">
            Progress
          </span>
        </div>
      </div>

      {/* SUBTASKS */}
      <div>
        <h2 className="text-md font-semibold text-gray-700 mb-4">
          Subtasks
        </h2>

        <div className="space-y-3">
          {subtasks.map((subtask) => (
            <SubtaskItem
              key={subtask._id}
              subtask={subtask}
              onClaim={claimSubtask}
              onComplete={completeSubtask}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsPage;