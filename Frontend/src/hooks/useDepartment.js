import { useEffect } from "react";
import {
  getAllDepartments,
  createDepartment,
  joinDepartment,
  deleteDepartment,
} from "../api/department.api";

export const useDepartment = (state) => {

  const {
    setDepartments,
    setLoading,
    setError,
  } = state;

  // 🔥 FETCH ALL DEPARTMENTS
  const fetchDepartments = async (workspaceId) => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllDepartments(workspaceId);

      setDepartments(data.departments);

    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 CREATE DEPARTMENT
  const handleCreateDepartment = async (workspaceId, payload) => {
    try {
      setLoading(true);
      setError(null);

      await createDepartment(workspaceId, payload);

      await fetchDepartments(workspaceId); // refresh

    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 JOIN DEPARTMENT
  const handleJoinDepartment = async (workspaceId, departmentId) => {
    try {
      setLoading(true);
      setError(null);

      await joinDepartment(workspaceId, departmentId);

      // optional refresh
      await fetchDepartments(workspaceId);

    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 DELETE DEPARTMENT
  const handleDeleteDepartment = async (workspaceId, departmentId) => {
    try {
      setLoading(true);
      setError(null);

      await deleteDepartment(workspaceId, departmentId);

      // 🔥 simple approach (no headache)
      await fetchDepartments(workspaceId);

    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchDepartments,
    handleCreateDepartment,
    handleJoinDepartment,
    handleDeleteDepartment,
  };
};