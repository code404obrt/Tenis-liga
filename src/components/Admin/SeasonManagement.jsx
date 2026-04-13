import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import Button from "../Common/Button";
import { format } from "date-fns";

export default function SeasonManagement() {
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function fetchSeasons() {
    const { data } = await supabase
      .from("seasons")
      .select("*")
      .order("start_date", { ascending: false });
    setSeasons(data ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchSeasons(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const { error: err } = await supabase.from("seasons").insert({
      name,
      start_date: startDate,
      is_active: false,
    });
    setSaving(false);
    if (err) { setError(err.message); return; }
    setName("");
    setCreating(false);
    fetchSeasons();
  }

  async function handleActivate(id) {
    setError(null);
    // Deactivate all, then activate selected
    await supabase.from("seasons").update({ is_active: false }).neq("id", "00000000-0000-0000-0000-000000000000");
    const { error: err } = await supabase.from("seasons").update({ is_active: true }).eq("id", id);
    if (err) setError(err.message);
    else fetchSeasons();
  }

  async function handleClose(id) {
    setError(null);
    const { error: err } = await supabase.from("seasons").update({ is_active: false, end_date: format(new Date(), "yyyy-MM-dd") }).eq("id", id);
    if (err) setError(err.message);
    else fetchSeasons();
  }

  return (
    <div className="bg-white rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-tennis-dark">Seasons</h3>
        <Button size="sm" onClick={() => setCreating((v) => !v)}>
          {creating ? "Cancel" : "+ New season"}
        </Button>
      </div>

      {creating && (
        <form onSubmit={handleCreate} className="space-y-2 border border-gray-100 rounded-xl p-3">
          <input
            type="text"
            placeholder="Season name (e.g. Spring 2026)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            required
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            required
          />
          <Button type="submit" size="sm" disabled={saving}>
            {saving ? "Creating…" : "Create season"}
          </Button>
        </form>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : seasons.length === 0 ? (
        <p className="text-sm text-gray-400">No seasons yet</p>
      ) : (
        <div className="space-y-2">
          {seasons.map((s) => (
            <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <div>
                <p className="text-sm font-medium">
                  {s.name}
                  {s.is_active && (
                    <span className="ml-2 text-xs text-tennis-light font-semibold">ACTIVE</span>
                  )}
                </p>
                <p className="text-xs text-gray-400">
                  Started {format(new Date(s.start_date), "d MMM yyyy")}
                  {s.end_date ? ` · Ended ${format(new Date(s.end_date), "d MMM yyyy")}` : ""}
                </p>
              </div>
              <div className="flex gap-2">
                {!s.is_active && !s.end_date && (
                  <Button size="sm" variant="secondary" onClick={() => handleActivate(s.id)}>
                    Activate
                  </Button>
                )}
                {s.is_active && (
                  <Button size="sm" variant="secondary" onClick={() => handleClose(s.id)}>
                    Close
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
