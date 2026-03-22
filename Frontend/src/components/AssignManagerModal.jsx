import React, { useEffect, useState } from "react";
import { getAllDepartmentMembers } from "../api/department.api";
import { Search } from "lucide-react";

const AssignManagerModal = ({
  workspaceId,
  departmentId,
  onClose,
  onAssignManager,
}) => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const res = await getAllDepartmentMembers(workspaceId, departmentId);
    setMembers(res.members || []);
  };

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">

      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-5">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Assign Manager
            </h2>
            <p className="text-xs text-gray-500">
              Select a member to assign
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg"
          >
            ✕
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative mb-4">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* LIST */}
        <div className="max-h-72 overflow-y-auto space-y-2 pr-1">

          {filtered.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              No members found
            </p>
          ) : (
            filtered.map((m) => (
              <div
                key={m._id}
                className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50 transition"
              >

                {/* LEFT */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-semibold">
                    {m.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {m.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {m.email}
                    </p>
                  </div>
                </div>

                {/* BUTTON */}
                <button
                  onClick={() => {
                    onAssignManager(departmentId, m._id);
                    onClose();
                  }}
                  className="text-xs bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-lg transition"
                >
                  Assign
                </button>

              </div>
            ))
          )}

        </div>

      </div>
    </div>
  );
};

export default AssignManagerModal;