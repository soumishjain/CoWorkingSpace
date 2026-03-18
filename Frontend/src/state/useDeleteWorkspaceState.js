import { create } from "zustand";

export const useDeleteWorkspaceState = create((set) => ({
  loading: false,
  error: null,

  setLoading: (val) => set({ loading: val }),
  setError: (err) => set({ error: err }),
}));