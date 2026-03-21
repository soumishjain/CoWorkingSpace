import { useState } from "react";

export const useNotificationState = () => {

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 workspace role (admin / member)
  const [role, setRole] = useState("");

  // 🔥 unread count (future use)
  const [unreadCount, setUnreadCount] = useState(0);

  return {
    // data
    notifications,
    role,
    unreadCount,
    loading,
    error,

    // setters
    setNotifications,
    setRole,
    setUnreadCount,
    setLoading,
    setError,
  };
};