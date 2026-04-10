import { create } from "zustand";

// Holds in-progress match entry state for the New Match screen.
export const useMatchStore = create((set) => ({
  draft: null,
  setDraft: (draft) => set({ draft }),
  clearDraft: () => set({ draft: null }),
}));
