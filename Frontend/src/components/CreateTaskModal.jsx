import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTask } from "../hooks/useTask";
import { getAllDepartmentMembers } from "../api/department.api";
import toast from "react-hot-toast";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays } from "lucide-react";

// 🔥 ONLY ADDITION
import { useDebounce } from "../hooks/useDebounce";

const CreateTaskModal = ({ onClose }) => {
  const { workspaceId, departmentId } = useParams();
  const { createTask } = useTask(workspaceId, departmentId);

  const [members, setMembers] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // 🔥 ONLY ADDITION
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const initialForm = {
    title: "",
    description: "",
    priority: "medium",
    deadline: "",
    assignedMembers: [],
    subtasks: [{ title: "", description: "" }],
  };

  const [form, setForm] = useState(initialForm);

  // ================= FETCH MEMBERS =================
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

  // ================= INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= MEMBERS =================
  const addMember = (id) => {
    setForm((prev) => ({
      ...prev,
      assignedMembers: [...prev.assignedMembers, id],
    }));
    setOpenDropdown(false);
    setSearch(""); // 🔥 reset search
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

  // 🔥 ONLY ADDITION (FILTER WITH DEBOUNCE)
  const filteredMembers = availableMembers.filter((m) =>
    m.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    m.email.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  // ================= SUBTASK =================
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

  // ================= SUBMIT =================
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

    try {
  const res = await createTask(payload);

  if (res) {
    toast.success("Task created 🚀");
    setForm(initialForm);
    setSelectedDate(null);
    onClose();
  }
} catch (err) {
  toast.error("Something went wrong");
}
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-[#0f172a] text-white w-[650px] rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Create Task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        {/* TITLE */}
        <input
          name="title"
          value={form.title}
          placeholder="Task title..."
          className="w-full bg-[#1e293b] p-3 rounded-lg mb-3 outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          value={form.description}
          placeholder="Description..."
          className="w-full bg-[#1e293b] p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
        />

        {/* ROW */}
        <div className="flex gap-3 mb-5">
          <select
            name="priority"
            value={form.priority}
            className="flex-1 bg-[#1e293b] p-3 rounded-lg"
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <div className="relative flex-1">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              placeholderText="Select deadline"
              dateFormat="dd MMM yyyy"
              className="w-full pl-10 pr-3 py-3 bg-[#1e293b] border border-[#334155] rounded-xl text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* MEMBERS */}
        <div className="mb-6 relative">
          <p className="text-sm text-gray-400 mb-2">Assign Members</p>

          <div className="flex flex-wrap gap-2 mb-2">
            {form.assignedMembers.map((id) => {
              const user = members.find((m) => m._id === id);
              return (
                <div key={id} className="flex items-center gap-2 bg-blue-600 px-3 py-1 rounded-full text-sm">
                  <img
                    src={user?.profileImage || "https://i.pravatar.cc/40"}
                    className="w-5 h-5 rounded-full"
                  />
                  {user?.name}
                  <span onClick={() => removeMember(id)}>✕</span>
                </div>
              );
            })}
          </div>

          <div
            onClick={() => {
              setOpenDropdown(!openDropdown);
              setSearch(""); // 🔥 reset search
            }}
            className="bg-[#1e293b] p-3 rounded-lg cursor-pointer"
          >
            Select members...
          </div>

          {openDropdown && (
            <div className="absolute w-full bg-[#1e293b] mt-2 rounded-lg shadow max-h-52 overflow-y-auto z-50">

              {/* 🔥 SEARCH BAR */}
              <div className="p-2 border-b border-[#334155]">
                <input
                  type="text"
                  placeholder="Search members..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#0f172a] p-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {filteredMembers.length === 0 && (
                <p className="text-center text-gray-400 py-3">No members found</p>
              )}

              {filteredMembers.map((m) => (
                <div
                  key={m._id}
                  onClick={() => addMember(m._id)}
                  className="flex items-center justify-between p-3 hover:bg-[#334155] cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={m.profileImage || "https://i.pravatar.cc/40"}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-sm">{m.name}</p>
                      <p className="text-xs text-gray-400">{m.email}</p>
                    </div>
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      m.pendingTasks > 3
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}
                  >
                    {m.pendingTasks ?? 0} pending
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SUBTASKS */}
        <div>
          <p className="text-sm text-gray-400 mb-2">Subtasks</p>

          {form.subtasks.map((s, i) => (
            <div key={i} className="bg-[#1e293b] p-3 rounded-lg mb-3">
              <input
                value={s.title}
                placeholder="Subtask title"
                className="w-full bg-transparent outline-none mb-2"
                onChange={(e) =>
                  handleSubtaskChange(i, "title", e.target.value)
                }
              />
              <input
                value={s.description}
                placeholder="Description"
                className="w-full bg-transparent outline-none text-sm text-gray-400"
                onChange={(e) =>
                  handleSubtaskChange(i, "description", e.target.value)
                }
              />
              <button
                onClick={() => removeSubtask(i)}
                className="text-red-400 text-xs mt-2"
              >
                Remove
              </button>
            </div>
          ))}

          <button onClick={addSubtask} className="text-blue-400 text-sm">
            + Add Subtask
          </button>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-700 rounded-lg">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Create Task
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateTaskModal;