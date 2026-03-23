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

  // 🔥 INITIAL LOAD + RESET (FIXED)
  useEffect(() => {
    if (!workspaceId) return;

    state.reset();

    // reset ke baad load (safe)
      loadActivities();
 

  }, [workspaceId, departmentId]);

  // 🔥 SOCKET (FIXED)
  useEffect(() => {
    if (!workspaceId) return;

    initSocket();

    return () => {
      cleanupSocket();
    };
  }, [workspaceId, departmentId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-black text-white">
            <Activity size={18} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Activity Feed
            </h1>
            <p className="text-xs text-gray-500">
              Track everything happening in your workspace
            </p>
          </div>
        </div>

        {/* EMPTY */}
        {!state.loading && state.activities.length === 0 && (
          <div className="text-center mt-16">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity size={18} className="text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">
              No activity yet
            </p>
          </div>
        )}

        {/* LIST */}
        <div className="space-y-3">
          {state.activities.map((activity) => (
            <ActivityItem key={activity._id} activity={activity} />
          ))}
        </div>

        {/* LOADING */}
        {state.loading && (
          <div className="flex justify-center mt-6">
            <Loader2 className="animate-spin text-gray-500" size={20} />
          </div>
        )}

        {/* LOAD MORE */}
        {state.hasMore && !state.loading && state.activities.length > 0 && (
          <button
            onClick={loadActivities}
            className="mt-6 w-full py-2.5 text-sm font-medium bg-black text-white rounded-xl hover:bg-gray-800"
          >
            Load More
          </button>
        )}

      </div>
    </div>
  );
};

export default ActivityPage;