import { useState } from "react";

export const useNotificationState = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [requests,setRequests] = useState([])
  const [role , setRole] = useState("")

  return {
    notifications,
    setNotifications,
    loading,
    requests,
    role ,
    setRole,
    setRequests,
    setLoading,
    error,
    setError,
  };
};