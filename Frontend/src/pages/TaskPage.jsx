import { useState, useMemo, useEffect } from "react";
import { useTask } from "../hooks/useTask";
import { useParams } from "react-router-dom";
import CreateTaskModal from "../components/CreateTaskModal";
import TaskCard from "../components/TaskCard";

const TaskPage = () => {
  const { workspaceId, departmentId } = useParams();

  const {
    tasks = [],
    loading,
    role,
    approveTask,
    rejectTask,
  } = useTask(workspaceId, departmentId);

  const [openModal, setOpenModal] = useState(false);

  const isManager = role === "manager" || role === "admin";
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (isManager) {
      setFilter("awaiting-approval");
    } else {
      setFilter("all");
    }
  }, [isManager]);

  const handleApprove = async (taskId) => {
    try {
      await approveTask(taskId);
    } catch (err) {
      console.error("Approve failed", err);
    }
  };

  const handleReject = async (taskId) => {
    try {
      await rejectTask(taskId);
    } catch (err) {
      console.error("Reject failed", err);
    }
  };

  const filteredTasks = useMemo(() => {
    if (!tasks.length) return [];

    let baseTasks = tasks;

    if (!isManager) {
      baseTasks = tasks.filter((t) => t.isAssignedToMe === true);
    }

    if (filter === "all") return baseTasks;

    return baseTasks.filter((t) => t.status === filter);
  }, [tasks, filter, isManager]);

  return (
    <div className="p-6 min-h-screen">

      {/* 🔥 HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-2xl font-semibold text-black tracking-tight">
            Tasks
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage and track your workflow efficiently
          </p>
        </div>

        <div className="flex items-center gap-3">

          {/* 🔥 FILTER */}
          <div className="relative">
            <div className="flex gap-2 flex-wrap">

  {[
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "In Progress", value: "in-progress" },
    { label: "Completed", value: "completed" },
    { label: "Approval", value: "awaiting-approval" },
  ].map((item) => (
    <button
      key={item.value}
      onClick={() => setFilter(item.value)}
      className={`px-4 py-1.5 text-sm rounded-full border transition-all duration-200
        ${
          filter === item.value
            ? "bg-indigo-500 text-white border-indigo-500 shadow-md"
            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
        }
      `}
    >
      {item.label}
    </button>
  ))}

</div>
          </div>

          {/* 🔥 CREATE BUTTON */}
          {isManager && (
            <button
              onClick={() => setOpenModal(true)}
              className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              <span className="text-lg leading-none">＋</span>
              Create Task
            </button>
          )}

        </div>
      </div>

      {/* 🔥 LOADING */}
      {loading && (
        <p className="text-gray-400 text-sm">Loading tasks...</p>
      )}

      {/* 🔥 EMPTY */}
      {!loading && filteredTasks.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-lg">No tasks found</p>
          <p className="text-sm mt-1">Try changing filters or create a new task</p>
        </div>
      )}

      {/* 🔥 TASK GRID */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            userRole={role}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ))}
      </div>

      {/* 🔥 MODAL */}
      {openModal && (
        <CreateTaskModal onClose={() => setOpenModal(false)} />
      )}
    </div>
  );
};

export default TaskPage;