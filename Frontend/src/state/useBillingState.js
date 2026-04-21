import { useState } from "react";

export const useBillingState = () => {

  const [data, setData] = useState({
    subscriptions: [],
    payments: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  return {
    data,
    setData,
    loading,
    setLoading,
    error,
    setError
  };
};