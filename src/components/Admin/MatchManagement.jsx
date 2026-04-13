import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { format, parseISO } from "date-fns";
import Button from "../Common/Button";

export default function MatchManagement() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchMatches() {
    const { data } = await supabase
      .from("matches")
      .select("*, player_a:player_a_id(name), player_b:player_b_id(name)")
      .order("played_at", { ascending: false })
      .limit(30);
    setMatches(data ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchMatches(); }, []);

  async function handleVoid(id) {
    setError(null);
    const { error: err } = await supabase
      .from("matches")
      .update({ status: "voided" })
      .eq("id", id);
    if (err) setError(err.message);
    else fetchMatches();
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this match permanently?")) return;
    setError(null);
    const { error: err } = await supabase.from("matches").delete().eq("id", id);
    if (err) setError(err.message);
    else fetchMatches();
  }

  const statusColor = {
    pending: "text-amber-500",
    confirmed: "text-tennis-light",
    disputed: "text-red-500",
    voided: "text-gray-400",
  };

  return (
    <div className="bg-white rounded-2xl p-4 space-y-3">
      <h3 className="font-semibold text-tennis-dark">Matches</h3>
      {error && <p className="text-xs text-red-500">{error}</p>}

      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : matches.length === 0 ? (
        <p className="text-sm text-gray-400">No matches yet</p>
      ) : (
        <div className="space-y-0">
          {matches.map((m) => (
            <div key={m.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {m.player_a?.name} vs {m.player_b?.name}
                </p>
                <p className="text-xs text-gray-400">
                  {m.played_at ? format(parseISO(m.played_at), "d MMM yyyy") : "—"} · {m.surface}
                  {" · "}
                  <span className={statusColor[m.status] ?? "text-gray-400"}>
                    {m.status}
                  </span>
                </p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                {m.status !== "voided" && (
                  <Button size="sm" variant="secondary" onClick={() => handleVoid(m.id)}>
                    Void
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="secondary"
                  className="border-red-200 text-red-500 hover:bg-red-50"
                  onClick={() => handleDelete(m.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
