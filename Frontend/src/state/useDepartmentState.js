import { useState } from "react";

export const useDepartmentState = () => {

  const [departments, setDepartments] = useState([]);
  const [members , setMembers] = useState([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState(""); // 🔥 ADD THIS

  return {
    departments,
    setDepartments,
    loading,
    setLoading,
    error,
    setError,
    role,
    setRole,
  };
};