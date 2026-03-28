import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useWorkspaceMembers } from "../hooks/useWorkspaceMembers";
import { Users, Building2, X } from "lucide-react";
import Loader from "./Loader";

const WorkspaceDashboard = ({ workspace }) => {
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  const [showMembers, setShowMembers] = useState(false);

  const { members, loading } = useWorkspaceMembers(workspaceId);

  if (!workspace) return null;

  const {
    name,
    coverImage,
    createdBy,
    totalMembers,
    totalDepartments,
  } = workspace;

  return (
    <>
      {/* 🔥 HERO CARD */}
      <div className="relative w-full h-72 rounded-3xl overflow-hidden shadow-xl group">
        <img
          src={coverImage}
          alt="workspace"
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />

        {/* overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* content */}
        <div className="absolute inset-0 flex flex-col justify-between p-8 text-white">
          {/* top */}
          <div>
            <h2 className="text-3xl font-bold tracking-wide">
              {name}
            </h2>

            <p className="text-sm text-gray-300 mt-1">
              Admin: {createdBy?.name || "Unknown"}
            </p>
          </div>

          {/* bottom stats */}
          <div className="flex gap-5">
            {/* MEMBERS */}
            <div
              onClick={() => setShowMembers(true)}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl cursor-pointer hover:bg-white/20 transition"
            >
              <Users size={18} />
              <div>
                <p className="text-xs text-gray-300">Members</p>
                <p className="text-lg font-semibold">
                  {totalMembers}
                </p>
              </div>
            </div>

            {/* DEPARTMENTS */}
            <div
              onClick={() =>
                navigate(`/dashboard/workspace/${workspaceId}/departments`)
              }
              className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl cursor-pointer hover:bg-white/20 transition"
            >
              <Building2 size={18} />
              <div>
                <p className="text-xs text-gray-300">Departments</p>
                <p className="text-lg font-semibold">
                  {totalDepartments}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 MEMBERS MODAL */}
      {showMembers && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowMembers(false)}
          />

          {/* modal */}
          <div className="relative w-[420px] max-h-[520px] bg-white rounded-3xl shadow-2xl p-6 flex flex-col">
            {/* header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Workspace Members
              </h2>

              <button
                onClick={() => setShowMembers(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* list */}
            <div className="overflow-y-auto flex-1 space-y-2 pr-1">
              {loading ? (
                <Loader />
              ) : members.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No members found
                </p>
              ) : (
                members.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition"
                  >
                    <img
                      src={
                        member.userId?.profileImage ||
                        "https://ui-avatars.com/api/?name=User"
                      }
                      className="w-10 h-10 rounded-full object-cover"
                    />

                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {member.userId?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {member.userId?.email}
                      </p>
                    </div>

                    {/* role */}
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-md capitalize">
                      {member.role}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* footer */}
            <button
              onClick={() => setShowMembers(false)}
              className="mt-4 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkspaceDashboard;