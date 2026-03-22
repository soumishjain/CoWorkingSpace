import React, { useEffect } from "react";
import { Check, X, Bell } from "lucide-react";

import { useNotificationState } from "../state/useNotificationState";
import { useNotification } from "../hooks/useNotification";
import Loader from "../components/Loader";

const NotificationsPage = () => {

  const state = useNotificationState();
  const {
    fetchAllNotifications,
    handleApprove,
    handleReject,
  } = useNotification(state);

  const { notifications, loading, error } = state;

  // 🔥 GLOBAL FETCH (NO workspaceId)
  useEffect(() => {
    fetchAllNotifications();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">

      {/* HEADER */}
      <div className="mb-6 flex items-center gap-3">
        <div className="bg-gray-100 p-2 rounded-lg">
          <Bell size={18} />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Notifications
          </h1>
          <p className="text-sm text-gray-500">
            All activity & requests in one place
          </p>
        </div>
      </div>

      {/* LOADING */}
      {loading && <Loader />}

      {/* ERROR */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* LIST */}
      {!loading && (
        <div className="space-y-3">

          {notifications?.length > 0 ? (
            notifications.map((item) => {

              // 🔥 REQUEST CARD
              if (item.type === "REQUEST") {
                return (
                  <div
                    key={item._id}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition"
                  >

                    {/* LEFT */}
                    <div className="flex items-center gap-3">

                      <img
                        src={
                          item.user?.profileImage ||
                          `https://ui-avatars.com/api/?name=${item.user?.name}`
                        }
                        className="w-10 h-10 rounded-full object-cover"
                      />

                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {item.user?.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {item.user?.email}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          {item.departmentId
                            ? `requested to join ${item.departmentId?.name} department`
                            : "requested to join workspace"}
                        </p>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-2">

                      <button
                        onClick={() => handleApprove(item)}
                        className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 text-xs rounded-lg transition"
                      >
                        <Check size={14} />
                        Approve
                      </button>

                      <button
                        onClick={() => handleReject(item)}
                        className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 text-xs rounded-lg transition"
                      >
                        <X size={14} />
                        Reject
                      </button>

                    </div>

                  </div>
                );
              }

              // 🔔 NORMAL NOTIFICATION
              return (
                <div
                  key={item._id}
                  className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition"
                >

                  <div className="bg-gray-100 p-2 rounded-lg mt-1">
                    <Bell size={14} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-800 leading-relaxed">
                      {item.message}
                    </p>

                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500 text-sm py-10">
              No notifications yet
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default NotificationsPage;