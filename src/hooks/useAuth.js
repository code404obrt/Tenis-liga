import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/authStore";

// Fetches the player row for the given auth user and stores it.
async function fetchPlayer(userId, setPlayer) {
  const { data } = await supabase
    .from("players")
    .select("*")
    .eq("user_id", userId)
    .single();
  setPlayer(data ?? null);
}

// Call this ONCE at the app root. Every other component reads from the store.
export function useAuth() {
  const { setSession, setLoading, setPlayer, reset } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      setLoading(false);
      if (data.session?.user) fetchPlayer(data.session.user.id, setPlayer);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (!mounted) return;
      if (session) {
        setSession(session);
        fetchPlayer(session.user.id, setPlayer);
      } else {
        reset();
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [setSession, setLoading, setPlayer, reset]);

  return useAuthStore();
}

export async function signIn(email, password) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  return supabase.auth.signOut();
}
