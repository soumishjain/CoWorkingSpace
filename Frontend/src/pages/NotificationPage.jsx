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

  useEffect(() => {
    fetchAllNotifications();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-6 py-8">

      <div className="max-w-3xl mx-auto">

        {/* 🔥 HEADER */}
        <div className="mb-6 flex items-center gap-3">

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] p-2 rounded-lg">
            <Bell size={18} className="text-[var(--accent)]" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
              Notifications
            </h1>

            <p className="text-sm text-[var(--text-secondary)]">
              All activity & requests in one place
            </p>
          </div>

        </div>

        {/* 🔥 LOADING */}
        {loading && <Loader />}

        {/* 🔥 ERROR */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl 
                          bg-red-500/10 border border-red-500/20 
                          text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* 🔥 LIST */}
        {!loading && (
          <div className="space-y-3">

            {notifications?.length > 0 ? (
              notifications.map((item) => {

                // 🔥 REQUEST CARD
                if (item.type === "REQUEST") {
                  return (
                    <div
                      key={item._id}
                      className="flex items-center justify-between p-4 
                                 bg-[var(--bg-secondary)] 
                                 border border-[var(--border)] 
                                 rounded-2xl 
                                 shadow-sm 
                                 hover:shadow-lg 
                                 transition"
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
                          <p className="text-sm font-semibold text-[var(--text-primary)]">
                            {item.user?.name}
                          </p>

                          <p className="text-xs text-[var(--text-secondary)]">
                            {item.user?.email}
                          </p>

                          <p className="text-xs text-[var(--text-secondary)] mt-1">
                            {item.departmentId
                              ? `requested to join ${item.departmentId?.name} department`
                              : "requested to join workspace"}
                          </p>
                        </div>

                      </div>

                      {/* 🔥 ACTIONS */}
                      <div className="flex gap-2">

                        <button
                          onClick={() => handleApprove(item)}
                          className="flex items-center gap-1 
                                     bg-green-500/10 
                                     border border-green-500/20 
                                     text-green-400 
                                     px-3 py-1.5 text-xs rounded-lg 
                                     hover:bg-green-500 
                                     hover:text-white 
                                     transition-all duration-300"
                        >
                          <Check size={14} />
                          Approve
                        </button>

                        <button
                          onClick={() => handleReject(item)}
                          className="flex items-center gap-1 
                                     bg-[var(--bg-hover)] 
                                     border border-[var(--border)] 
                                     text-[var(--text-secondary)] 
                                     px-3 py-1.5 text-xs rounded-lg 
                                     hover:bg-red-500 
                                     hover:text-white 
                                     transition-all duration-300"
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
                    className="flex items-start gap-3 p-4 
                               bg-[var(--bg-secondary)] 
                               border border-[var(--border)] 
                               rounded-2xl 
                               shadow-sm 
                               hover:shadow-lg 
                               transition"
                  >

                    <div className="bg-[var(--bg-hover)] p-2 rounded-lg mt-1">
                      <Bell size={14} className="text-[var(--accent)]" />
                    </div>

                    <div>
                      <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                        {item.message}
                      </p>

                      <p className="text-xs text-[var(--text-secondary)] mt-2">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>

                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-20 
                              border border-dashed border-[var(--border)] 
                              rounded-2xl bg-[var(--bg-secondary)]/50">

                <p className="text-[var(--text-primary)] text-lg">
                  No notifications yet
                </p>

                <p className="text-sm text-[var(--text-secondary)] mt-1">
                  You’re all caught up 🎉
                </p>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default NotificationsPage;