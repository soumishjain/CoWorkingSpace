import { useState } from "react";

export const useDepartmentState = () => {

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return {
    departments,
    setDepartments,
    loading,
    setLoading,
    error,
    setError
  };
};