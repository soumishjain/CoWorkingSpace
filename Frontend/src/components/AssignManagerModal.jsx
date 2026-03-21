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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await getAllDepartmentMembers(workspaceId, departmentId);
      setMembers(res.members || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter((m) =>
    m.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">

      {/* MODAL */}
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-5">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Assign Manager
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            ✕
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* LIST */}
        <div className="max-h-64 overflow-y-auto space-y-2">

          {loading ? (
            <p className="text-sm text-gray-500">Loading members...</p>
          ) : filteredMembers.length === 0 ? (
            <p className="text-sm text-gray-400">No members found</p>
          ) : (
            filteredMembers.map((m) => (
              <div
                key={m._id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition"
              >

                {/* LEFT: avatar + name */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                    {m.name?.charAt(0).toUpperCase()}
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

                {/* RIGHT: button */}
                <button
                  onClick={() => {
                    onAssignManager(departmentId, m._id);
                    onClose();
                  }}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 text-xs rounded-md transition"
                >
                  Assign
                </button>

              </div>
            ))
          )}

        </div>

        {/* FOOTER */}
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

export default AssignManagerModal;