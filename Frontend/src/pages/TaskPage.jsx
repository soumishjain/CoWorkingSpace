import { useState, useMemo, useEffect } from "react";
import { useTask } from "../hooks/useTask";
import { useParams } from "react-router-dom";
import CreateTaskModal from "../components/CreateTaskModal";
import TaskCard from "../components/TaskCard";

const TaskPage = () => {
  const { workspaceId, departmentId } = useParams();
  const { tasks = [], loading, role } = useTask(workspaceId, departmentId);

  const [openModal, setOpenModal] = useState(false);

  const isManager = role === "manager" || role === "admin";

  // 🔥 filter for ALL
  const [filter, setFilter] = useState("all");

  // 🔥 default for manager
  useEffect(() => {
    if (isManager) {
      setFilter("awaiting-approval");
    } else {
      setFilter("all");
    }
  }, [isManager]);

  // 🔥 FINAL FILTER LOGIC
  const filteredTasks = useMemo(() => {
    if (!tasks.length) return [];

    let baseTasks = tasks;

    // 👤 MEMBER → only assigned tasks first
    if (!isManager) {
      baseTasks = tasks.filter((t) => t.isAssignedToMe === true);
    }

    // 🔥 apply status filter
    if (filter === "all") return baseTasks;

    return baseTasks.filter((t) => t.status === filter);

  }, [tasks, filter, isManager]);

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-white">Tasks</h1>

        <div className="flex gap-3">

          {/* 🔥 FILTER (NOW FOR EVERYONE) */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#1e293b] text-white px-3 py-2 rounded-lg outline-none border border-[#334155]"
          >
            <option value="all">All</option>
            <option value="awaiting-approval">Awaiting Approval</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* CREATE (only manager) */}
          {isManager && (
            <button
              onClick={() => setOpenModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + Create Task
            </button>
          )}
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-gray-400">Loading tasks...</p>
      )}

      {/* EMPTY */}
      {!loading && filteredTasks.length === 0 && (
        <p className="text-gray-400">No tasks found</p>
      )}

      {/* TASK LIST */}
      <div className="grid gap-4">
        {filteredTasks.map((task) => (
          <TaskCard key={task._id} task={task}  />
        ))}
      </div>

      {/* MODAL */}
      {openModal && (
        <CreateTaskModal onClose={() => setOpenModal(false)} />
      )}
    </div>
  );
};

export default TaskPage;