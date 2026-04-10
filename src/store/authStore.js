import { create } from "zustand";

export const useAuthStore = create((set) => ({
  session: null,
  user: null,
  player: null, // joined player row for the logged-in user
  loading: true,
  setSession: (session) => set({ session, user: session?.user ?? null }),
  setPlayer: (player) => set({ player }),
  setLoading: (loading) => set({ loading }),
  reset: () => set({ session: null, user: null, player: null, loading: false }),
}));
