import { useState } from "react";

export const useNotificationState = () => {

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 NEW (IMPORTANT)
  const [unreadCount, setUnreadCount] = useState(0);

  return {
    notifications,
    setNotifications,

    loading,
    setLoading,

    error,
    setError,

    // 🔥 expose
    unreadCount,
    setUnreadCount,
  };
};