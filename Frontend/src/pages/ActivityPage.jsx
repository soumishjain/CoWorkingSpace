import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ActivityItem from "../components/ActivityItem";
import { useActivityState } from "../state/useActivityState";
import { useActivity } from "../hooks/useActivity";
import { Activity, Loader2 } from "lucide-react";

const ActivityPage = () => {
  const { workspaceId, departmentId } = useParams();

  const state = useActivityState();
  const { loadActivities, initSocket, cleanupSocket } = useActivity(
    state,
    workspaceId,
    departmentId
  );

  useEffect(() => {
    if (!workspaceId) return;
    state.reset();
    loadActivities();
  }, [workspaceId, departmentId]);

  useEffect(() => {
    if (!workspaceId) return;
    initSocket();
    return cleanupSocket;
  }, [workspaceId, departmentId]);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-4 py-10">

      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10 flex justify-center">
        <div className="w-[600px] h-[600px] 
                        bg-[radial-gradient(circle,rgba(255,106,0,0.15),transparent_70%)] 
                        blur-3xl opacity-40" />
      </div>

      <div className="max-w-2xl mx-auto">

        {/* 🔥 HEADER */}
        <div className="flex items-center gap-4 mb-10">

          <div className="p-3 rounded-xl 
                          bg-[var(--accent)]/20 
                          text-[var(--accent)] 
                          border border-[var(--accent)]/20">
            <Activity size={18} />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-[var(--text-primary)]">
              Activity Feed
            </h1>

            <p className="text-sm text-[var(--text-secondary)]">
              Everything happening in your workspace
            </p>
          </div>

        </div>

        {/* 🔥 EMPTY STATE */}
        {!state.loading && state.activities.length === 0 && (
          <div className="text-center mt-20">

            <div className="w-14 h-14 rounded-full 
                            bg-[var(--bg-secondary)] 
                            border border-[var(--border)] 
                            flex items-center justify-center mx-auto mb-4">

              <Activity size={18} className="text-[var(--text-secondary)]" />

            </div>

            <p className="text-sm text-[var(--text-secondary)]">
              No activity yet
            </p>

          </div>
        )}

        {/* 🔥 ACTIVITY LIST */}
        <div className="relative space-y-4">

          {/* 🔥 TIMELINE LINE */}
          {state.activities.length > 0 && (
            <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-[var(--border)] opacity-50" />
          )}

          {state.activities.map((activity) => (
            <ActivityItem key={activity._id} activity={activity} />
          ))}

        </div>

        {/* 🔥 LOADING */}
        {state.loading && (
          <div className="flex justify-center mt-8">
            <Loader2
              className="animate-spin text-[var(--accent)]"
              size={22}
            />
          </div>
        )}

        {/* 🔥 LOAD MORE */}
        {state.hasMore && !state.loading && state.activities.length > 0 && (
          <button
            onClick={loadActivities}
            className="mt-8 w-full py-3 rounded-xl 
                       bg-[var(--bg-secondary)] 
                       border border-[var(--border)] 
                       text-sm font-medium 
                       text-[var(--text-primary)]
                       hover:bg-[var(--bg-hover)] 
                       hover:border-[var(--accent)] 
                       transition"
          >
            Load More Activity
          </button>
        )}

      </div>

    </div>
  );
};

export default ActivityPage;