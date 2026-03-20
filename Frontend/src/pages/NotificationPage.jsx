import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useNotificationState } from "../state/useNotificationState";
import { useNotification } from "../hooks/useNotification";

const NotificationsPage = () => {

  const { workspaceId } = useParams();

  const state = useNotificationState();
  const {
    fetchWorkspaceNotifications,
    handleApprove,
    handleReject
  } = useNotification(state);

  const { role } = state;

  const [activeTab, setActiveTab] = useState("user");

  useEffect(() => {
    if (workspaceId) {
      fetchWorkspaceNotifications(workspaceId);
    }
  }, [workspaceId]);

  return (
    <div className="p-6 space-y-6">

      {/* 🔥 TITLE */}
      <h1 className="text-2xl font-semibold">
        Notifications
      </h1>

      {/* 🔥 TABS */}
      <div className="flex gap-6 border-b pb-2">

        <button
          onClick={() => setActiveTab("user")}
          className={`text-sm pb-2 ${
            activeTab === "user"
              ? "border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]"
              : "text-gray-500"
          }`}
        >
          User Notifications
        </button>

        {role === "admin" && (
          <button
            onClick={() => setActiveTab("workspace")}
            className={`text-sm pb-2 ${
              activeTab === "workspace"
                ? "border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]"
                : "text-gray-500"
            }`}
          >
            Workspace Requests
          </button>
        )}

      </div>

      {/* 🔄 LOADING */}
      {state.loading && (
        <p className="text-sm text-gray-500">Loading...</p>
      )}

      {/* ❌ ERROR */}
      {state.error && (
        <p className="text-red-500 text-sm">{state.error}</p>
      )}

      {/* 🔥 USER NOTIFICATIONS */}
      {!state.loading && activeTab === "user" && (
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

      {/* 🔥 WORKSPACE REQUESTS (ADMIN ONLY) */}
      {!state.loading &&
        activeTab === "workspace" &&
        role === "admin" && (
          <div className="space-y-3">

            {state.requests.length > 0 ? (
              state.requests.map((req) => (
                <div
                  key={req._id}
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
                >

                  {/* LEFT */}
                  <div className="flex items-center gap-3">

                    <img
                      src={
                        req.userId.profileImage ||
                        `https://ui-avatars.com/api/?name=${req.userId.name}`
                      }
                      alt="user"
                      className="w-10 h-10 rounded-full object-cover"
                    />

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {req.userId.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {req.userId.email}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        Requested to join workspace
                      </p>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center gap-2">

                    <button
                      onClick={() => handleApprove(req._id)}
                      className="bg-green-500 hover:bg-green-600 active:scale-95 text-white px-3 py-1.5 text-xs rounded-lg transition"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleReject(req._id)}
                      className="bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 px-3 py-1.5 text-xs rounded-lg transition"
                    >
                      Reject
                    </button>

                  </div>

                </div>
              ))
            ) : (
              <div className="text-center text-sm text-gray-500 py-10">
                No pending requests
              </div>
            )}

          </div>
        )}

    </div>
  );
};

export default NotificationsPage;