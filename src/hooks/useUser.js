import { useAuthStore } from "../store/authStore";

// Convenience selector for the current logged-in user + joined player row.
export function useUser() {
  const { user, player, loading } = useAuthStore();
  return { user, player, loading, isAdmin: player?.role === "admin" };
}
