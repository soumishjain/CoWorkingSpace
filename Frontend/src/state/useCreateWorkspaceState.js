import { useState } from "react";

export const useCreateWorkspaceState = () => {

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coverImage: null,
    plan: "individual" // 🔥 ADD THIS
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return {
    formData,
    setFormData,
    loading,
    setLoading,
    error,
    setError
  };
};