import { supabase } from "../lib/supabase";

export async function getPlayerByUserId(userId) {
  return supabase.from("players").select("*").eq("user_id", userId).single();
}

export async function getPlayerById(id) {
  return supabase.from("players").select("*").eq("id", id).single();
}

export async function listPlayers() {
  return supabase.from("players").select("*").order("name");
}
