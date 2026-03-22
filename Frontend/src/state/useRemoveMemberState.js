import { useState } from "react";

export const useRemoveMemberState = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  return {
    query,
    setQuery,
    users,
    setUsers,
    loading,
    setLoading,
  };
};