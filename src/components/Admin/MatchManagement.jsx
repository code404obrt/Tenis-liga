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

  // eslint-disable-next-line react-hooks/set-state-in-effect -- async fetch on mount
  useEffect(() => { fetchMatches(); }, []);

  async function handleVoid(id) {
    setError(null);
    const { error: err } = await supabase.from("matches").update({ status: "voided" }).eq("id", id);
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
    pending: "text-amber-400",
    confirmed: "text-success",
    disputed: "text-destructive",
    voided: "text-muted-foreground",
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-gradient-card">
        <h3 className="font-display text-2xl">Matches</h3>
      </div>

      <div className="p-4 space-y-3">
        {error && <p className="text-xs text-destructive">{error}</p>}

        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : matches.length === 0 ? (
          <p className="text-sm text-muted-foreground">No matches yet</p>
        ) : (
          <div>
            {matches.map((m) => (
              <div key={m.id} className="flex items-center justify-between py-2.5 border-b border-border last:border-0 gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {m.player_a?.name} vs {m.player_b?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {m.played_at ? format(parseISO(m.played_at), "d MMM yyyy") : "—"} · {m.surface}
                    {" · "}
                    <span className={statusColor[m.status] ?? "text-muted-foreground"}>
                      {m.status}
                    </span>
                  </p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  {m.status !== "voided" && (
                    <Button size="sm" variant="secondary" onClick={() => handleVoid(m.id)}>Void</Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    className="bg-destructive/10 text-destructive hover:bg-destructive/20 shadow-none"
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
    </div>
  );
}
