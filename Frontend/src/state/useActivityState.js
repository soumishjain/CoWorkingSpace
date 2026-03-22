import { create } from "zustand";

export const useActivityState = create((set) => ({
  activities: [],
  page: 1,
  hasMore: true,
  loading: false,

  setActivities: (data) =>
    set((state) => ({
      activities: typeof data === "function" ? data(state.activities) : data,
    })),

  appendActivities: (data) =>
    set((state) => ({
      activities: [...state.activities, ...data],
    })),

  setLoading: (val) => set({ loading: val }),

  setPage: (val) =>
    set((state) => ({
      page: typeof val === "function" ? val(state.page) : val,
    })),

  setHasMore: (val) => set({ hasMore: val }),

  reset: () =>
    set({
      activities: [],
      page: 1,
      hasMore: true,
      loading: false,
    }),
}));