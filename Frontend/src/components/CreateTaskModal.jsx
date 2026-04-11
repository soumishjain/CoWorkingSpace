import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTask } from "../hooks/useTask";
import { getAllDepartmentMembers } from "../api/department.api";
import toast from "react-hot-toast";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays } from "lucide-react";

import { useDebounce } from "../hooks/useDebounce";

const CreateTaskModal = ({ onClose }) => {
  const { workspaceId, departmentId } = useParams();
  const { createTask } = useTask(workspaceId, departmentId);

  const [members, setMembers] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const initialForm = {
    title: "",
    description: "",
    priority: "medium",
    assignedMembers: [],
    subtasks: [{ title: "", description: "" }],
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    const fetchMembers = async () => {
      const res = await getAllDepartmentMembers(
        workspaceId,
        departmentId
      );

      let filtered = (res.members || []).filter((m) => !m.isManager);

      filtered = filtered.map((m) => ({
        ...m,
        pendingTasks: m.pendingTasks ?? 0,
      }));

      filtered.sort((a, b) => b.pendingTasks - a.pendingTasks);

      setMembers(filtered);
    };

    fetchMembers();
  }, [workspaceId, departmentId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addMember = (id) => {
    setForm((prev) => ({
      ...prev,
      assignedMembers: [...prev.assignedMembers, id],
    }));
    setOpenDropdown(false);
    setSearch("");
  };

  const removeMember = (id) => {
    setForm((prev) => ({
      ...prev,
      assignedMembers: prev.assignedMembers.filter((m) => m !== id),
    }));
  };

  const availableMembers = members.filter(
    (m) => !form.assignedMembers.includes(m._id)
  );

  const filteredMembers = availableMembers.filter((m) =>
    m.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    m.email.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleSubtaskChange = (index, field, value) => {
    const updated = [...form.subtasks];
    updated[index][field] = value;
    setForm({ ...form, subtasks: updated });
  };

  const addSubtask = () => {
    setForm({
      ...form,
      subtasks: [...form.subtasks, { title: "", description: "" }],
    });
  };

  const removeSubtask = (index) => {
    const updated = form.subtasks.filter((_, i) => i !== index);
    setForm({ ...form, subtasks: updated });
  };

  const handleSubmit = async () => {
    if (!form.title || !selectedDate) {
      toast.error("Fill required fields");
      return;
    }

    if (!form.assignedMembers.length) {
      toast.error("Assign at least one member");
      return;
    }

    const payload = {
      ...form,
      deadline: selectedDate.toISOString(),
    };

    const res = await createTask(payload);

    if (res?.success) {
      toast.success("Task created 🚀");
      setForm(initialForm);
      setSelectedDate(null);
      onClose();
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

      <div
        className="w-[650px] max-h-[90vh] overflow-y-auto rounded-2xl p-6"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
        }}
      >

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 style={{ color: "var(--text-primary)" }}>
            Create Task
          </h2>
          <button onClick={onClose} style={{ color: "var(--text-secondary)" }}>
            ✕
          </button>
        </div>

        {/* TITLE */}
        <input
          name="title"
          value={form.title}
          placeholder="Task title..."
          className="input mb-3"
          onChange={handleChange}
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          value={form.description}
          placeholder="Description..."
          className="input mb-4"
          onChange={handleChange}
        />

        {/* PRIORITY + CALENDAR */}
        <div className="grid grid-cols-2 gap-3 mb-5">

          <select
            name="priority"
            value={form.priority}
            className="input"
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)] z-10" />

            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              placeholderText="Deadline"
              dateFormat="dd MMM yyyy"
              wrapperClassName="w-full"
              popperPlacement="bottom-start"
              className="w-full pl-9 pr-3 py-3 rounded-xl border text-sm"
              style={{
                background: "var(--bg-hover)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
            />
          </div>
        </div>

        {/* MEMBERS */}
        <div className="mb-6 relative">
          <p className="text-xs mb-2" style={{ color: "var(--text-secondary)" }}>
            Assign Members
          </p>

          <div className="flex flex-wrap gap-2 mb-2">
            {form.assignedMembers.map((id) => {
              const user = members.find((m) => m._id === id);
              return (
                <div
                  key={id}
                  className="flex items-center gap-2 px-2 py-1 rounded-md text-xs"
                  style={{
                    background: "var(--bg-hover)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {user?.name}
                  <span onClick={() => removeMember(id)}>✕</span>
                </div>
              );
            })}
          </div>

          <div
            onClick={() => setOpenDropdown(!openDropdown)}
            className="input cursor-pointer"
          >
            Select members...
          </div>

          {openDropdown && (
            <div
              className="absolute w-full mt-2 rounded-xl overflow-hidden z-50"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
              }}
            >
              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input border-none rounded-none"
              />

              {filteredMembers.map((m) => (
                <div
                  key={m._id}
                  onClick={() => addMember(m._id)}
                  className="p-3 cursor-pointer hover:bg-[var(--bg-hover)] text-sm flex justify-between"
                >
                  {m.name}
                  <span className="text-xs">{m.pendingTasks} pending</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SUBTASKS */}
        <div>
          <p className="text-xs mb-2" style={{ color: "var(--text-secondary)" }}>
            Subtasks
          </p>

          {form.subtasks.map((s, i) => (
            <div
              key={i}
              className="p-3 rounded-xl mb-2"
              style={{
                background: "var(--bg-hover)",
                border: "1px solid var(--border)",
              }}
            >
              <input
                value={s.title}
                placeholder="Subtask title"
                className="input mb-2"
                onChange={(e) =>
                  handleSubtaskChange(i, "title", e.target.value)
                }
              />
              <input
                value={s.description}
                placeholder="Description"
                className="input"
                onChange={(e) =>
                  handleSubtaskChange(i, "description", e.target.value)
                }
              />
            </div>
          ))}

          <button
            onClick={addSubtask}
            className="text-sm"
            style={{ color: "var(--accent)" }}
          >
            + Add Subtask
          </button>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm"
            style={{
              background: "var(--bg-hover)",
              color: "var(--text-secondary)",
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-md text-sm"
            style={{
              background: "var(--accent)",
              color: "white",
            }}
          >
            Create Task
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateTaskModal;