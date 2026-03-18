import { useState } from "react";

export const useCreateDepartmentState = () => {

  const [formData, setFormData] = useState({
    name: "",
    description: ""
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