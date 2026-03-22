import { useState } from "react";

export const useNotificationState = () => {

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return {
    notifications,
    setNotifications, // ✅ MUST
    loading,
    setLoading,
    error,
    setError,
  };
};