import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useWorkspaceMembers } from "../hooks/useWorkspaceMembers";
import { Users, Building2, Plus, Activity } from "lucide-react";
import Loader from "./Loader";
import { useActivityState } from "../state/useActivityState";
import { useActivity } from "../hooks/useActivity";
import { useEffect } from "react";
import AdminCard from "./AdminCard";

const WorkspaceDashboard = ({ workspace }) => {
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  const [showMembers, setShowMembers] = useState(false);

    const activityState = useActivityState();
  const { loadActivities, initSocket, cleanupSocket } =
    useActivity(activityState, workspaceId);

  const { activities } = activityState;

  useEffect(() => {
    loadActivities();
    initSocket();

    return cleanupSocket;
  }, []);

  const { members, loading } = useWorkspaceMembers(workspaceId);

  if (!workspace) return null;

  const {
    name,
    createdBy,
    totalMembers,
    totalDepartments,
  } = workspace;

  return (
    <div className="space-y-8">

      {/* 🔥 TOP INFO */}
      <div>
        <h1 className="text-2xl uppercase font-semibold text-[var(--text-primary)]">
          {name}
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Managed by {createdBy?.name || "Unknown"}
        </p>
      </div>

      {/* 🔥 STATS CARDS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* MEMBERS */}
        <div
          onClick={() => setShowMembers(true)}
          className="p-5 rounded-2xl 
                     bg-[var(--bg-secondary)] 
                     border border-[var(--border)] 
                     hover:-translate-y-1 hover:shadow-lg 
                     transition cursor-pointer"
        >
          <Users className="text-[var(--accent)] mb-3" />
          <p className="text-sm text-[var(--text-secondary)]">Members</p>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            {totalMembers}
          </h2>
        </div>

        {/* DEPARTMENTS */}
        <div
          onClick={() =>
            navigate(`/dashboard/workspace/${workspaceId}/departments`)
          }
          className="p-5 rounded-2xl 
                     bg-[var(--bg-secondary)] 
                     border border-[var(--border)] 
                     hover:-translate-y-1 hover:shadow-lg 
                     transition cursor-pointer"
        >
          <Building2 className="text-[var(--accent)] mb-3" />
          <p className="text-sm text-[var(--text-secondary)]">
            Departments
          </p>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
            {totalDepartments}
          </h2>
        </div>

          <AdminCard admin={createdBy} />
       
        

      </div>

      {/* 🔥 ACTIVITY SECTION */}
      <div className="p-6 rounded-2xl 
                      bg-[var(--bg-secondary)] 
                      border border-[var(--border)]">

        <div className="flex items-center gap-2 mb-4">
          <Activity className="text-[var(--accent)]" />
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Recent Activity
          </h2>
        </div>

        <div className="space-y-3 text-sm text-[var(--text-secondary)]">

          {activities.map((a, i) => (
            <div key={i} className="flex items-center gap-2">
              <Activity size={16} className="text-[var(--accent)]" />
              <p>{a.message}</p>
            </div>
          ))}


        </div>

      </div>

      {/* 🔥 MEMBERS MODAL */}
      {showMembers && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowMembers(false)}
          />

          <div className="relative w-[420px] max-h-[520px] 
                          bg-[var(--bg-secondary)] 
                          border border-[var(--border)] 
                          rounded-2xl p-6 flex flex-col">

            <h2 className="text-lg font-semibold mb-4">
              Members
            </h2>

            <div className="overflow-y-auto space-y-2">

              {loading ? (
                <Loader />
              ) : members.map((m, i) => (
                <div key={i} className="flex gap-3 items-center">

                  <img
                    src={m.userId?.profileImage}
                    className="w-8 h-8 rounded-full"
                  />

                  <div>
                    <p className="text-sm text-[var(--text-primary)]">
                      {m.userId?.name}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {m.userId?.email}
                    </p>
                  </div>

                </div>
              ))}

            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceDashboard;