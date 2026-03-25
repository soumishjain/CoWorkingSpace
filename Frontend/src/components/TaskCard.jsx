import { useNavigate } from "react-router-dom";

const TaskCard = ({ task }) => {
  const navigate = useNavigate();

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

  return (
    <div
      onClick={() => navigate(`task/${task._id}`)}
      className="group relative bg-white border border-gray-200 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >

      {/* 🔥 TOP */}
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

      {/* 🔥 DESCRIPTION */}
      <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
        {task.description || "No description"}
      </p>

      {/* 🔥 PROGRESS */}
      <div className="mb-4">

        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Progress</span>
          <span>{task.progress}%</span>
        </div>

        <div className="h-[6px] w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${task.progress}%` }}
          />
        </div>

      </div>

      {/* 🔥 FOOTER */}
      <div className="flex justify-between items-center text-xs text-gray-400">

        <span>
          {new Date(task.deadline).toLocaleDateString()}
        </span>

        <span className="capitalize">
          {task.status.replace("-", " ")}
        </span>

      </div>

      {/* 🔥 HOVER LIGHT */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl" />

    </div>
  );
};

export default TaskCard;