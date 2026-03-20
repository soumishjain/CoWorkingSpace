import React, { useEffect } from "react";

import { useNotificationState } from "../state/useNotificationState";
import { useNotification } from "../hooks/useNotification";

const UserNotificationsPage = () => {

  const state = useNotificationState();
  const { fetchUserNotifications } = useNotification(state);

  useEffect(() => {
    fetchUserNotifications();
  }, []);

  return (
    <div className="p-6">

      <h1 className="text-2xl font-semibold mb-6">
        Notifications
      </h1>

      {/* 🔄 LOADING */}
      {state.loading && (
        <p className="text-sm text-gray-500">Loading...</p>
      )}

      {/* ❌ ERROR */}
      {state.error && (
        <p className="text-red-500 text-sm">{state.error}</p>
      )}

      {/* 🔥 LIST */}
      {!state.loading && !state.error && (
        <div className="space-y-3">

          {state.notifications.length > 0 ? (
            state.notifications.map((n) => (
              <div
                key={n._id}
                className="p-4 border rounded-lg bg-white shadow-sm"
              >
                <p className="text-sm text-gray-800">
                  {n.message}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">
              No notifications
            </p>
          )}

        </div>
      )}

    </div>
  );
};

export default UserNotificationsPage;