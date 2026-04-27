// TaskPage.jsx
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
    if (isManager) setFilter("awaiting-approval");
    else setFilter("all");
  }, [isManager]);

  const handleApprove = async (taskId) => {
    try {
      await approveTask(taskId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (taskId) => {
    try {
      await rejectTask(taskId);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTasks = useMemo(() => {
    if (!tasks.length) return [];

    let baseTasks = tasks;

    if (!isManager) {
      baseTasks = tasks.filter((t) => t.isAssignedToMe);
    }

    if (filter === "all") return baseTasks;

    return baseTasks.filter((t) => t.status === filter);
  }, [tasks, filter, isManager]);

  const filters = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "In Progress", value: "in-progress" },
    { label: "Completed", value: "completed" },
    { label: "Approval", value: "awaiting-approval" },
  ];

  return (
    <div className="p-6 min-h-screen">

      {/* 🔥 HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

        {/* LEFT */}
        <div>
          <h1
            className="text-2xl font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Tasks
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Manage and track your workflow efficiently
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex flex-wrap items-center gap-3">

          {/* FILTERS */}
          <div className="flex gap-2 flex-wrap">
            {filters.map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className="px-3 py-1.5 text-xs rounded-md transition"
                style={{
                  background:
                    filter === item.value
                      ? "var(--accent)"
                      : "var(--bg-hover)",
                  color:
                    filter === item.value
                      ? "#fff"
                      : "var(--text-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* CREATE BUTTON */}
          {isManager && (
            <button
              onClick={() => {
                setOpenModal(true)
                console.log("Create Task button clicked")
              }}
              className="px-4 py-2 rounded-md text-sm font-medium transition"
              style={{
                background: "var(--accent)",
                color: "white",
              }}
            >
              + Create Task
            </button>
          )}
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <p
          className="text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Loading tasks...
        </p>
      )}

      {/* EMPTY */}
      {!loading && filteredTasks.length === 0 && (
        <div className="text-center mt-20">
          <p
            className="text-lg"
            style={{ color: "var(--text-primary)" }}
          >
            No tasks found
          </p>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Try changing filters or create a new task
          </p>
        </div>
      )}

      {/* GRID */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* MODAL */}
      {openModal && (
        <CreateTaskModal onClose={() => setOpenModal(false)} />
      )}
    </div>
  );
};

export default TaskPage;