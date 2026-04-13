import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { usePlayers } from "../../hooks/usePlayers";
import Button from "../Common/Button";

export default function PlayerManagement() {
  const { players, loading, refetch } = usePlayers();
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    // Call Edge Function to create auth user + player row
    const { data: { session } } = await supabase.auth.getSession();
    const { data, error: fnErr } = await supabase.functions.invoke("create-player", {
      body: { name: newName, email: newEmail },
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });

    setSaving(false);
    if (fnErr) {
      setError(fnErr.message + (data?.error ? `: ${data.error}` : ""));
      return;
    }
    if (data?.error) {
      setError(data.error);
      return;
    }
    setNewName("");
    setNewEmail("");
    setCreating(false);
    refetch();
  }

  async function handleEditSave(id) {
    setSaving(true);
    setError(null);
    const { error: err } = await supabase
      .from("players")
      .update({ name: editName })
      .eq("id", id);
    setSaving(false);
    if (err) { setError(err.message); return; }
    setEditingId(null);
    refetch();
  }

  async function handleToggleActive(id, current) {
    setError(null);
    const { error: err } = await supabase
      .from("players")
      .update({ is_active: !current })
      .eq("id", id);
    if (err) setError(err.message);
    else refetch();
  }

  return (
    <div className="bg-white rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-tennis-dark">Players</h3>
        <Button size="sm" onClick={() => setCreating((v) => !v)}>
          {creating ? "Cancel" : "+ New player"}
        </Button>
      </div>

      {creating && (
        <form onSubmit={handleCreate} className="space-y-2 border border-gray-100 rounded-xl p-3">
          <input
            type="text"
            placeholder="Full name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            required
          />
          <p className="text-xs text-gray-400">
            A temporary password will be set to their email address. They should change it on first login.
          </p>
          <Button type="submit" size="sm" disabled={saving}>
            {saving ? "Creating…" : "Create player"}
          </Button>
        </form>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : (
        <div className="space-y-0">
          {players.map((p) => (
            <div key={p.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 gap-2">
              {editingId === p.id ? (
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-sm"
                  autoFocus
                />
              ) : (
                <div className="min-w-0">
                  <p className={`text-sm font-medium ${!p.is_active ? "line-through text-gray-400" : ""}`}>
                    {p.name}
                    {p.role === "admin" && (
                      <span className="ml-1.5 text-xs text-tennis-light">admin</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400">ELO {p.elo}</p>
                </div>
              )}

              <div className="flex gap-1.5 shrink-0">
                {editingId === p.id ? (
                  <>
                    <Button size="sm" onClick={() => handleEditSave(p.id)} disabled={saving}>
                      Save
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => { setEditingId(p.id); setEditName(p.name); }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className={p.is_active ? "border-red-200 text-red-500 hover:bg-red-50" : ""}
                      onClick={() => handleToggleActive(p.id, p.is_active)}
                    >
                      {p.is_active ? "Deactivate" : "Activate"}
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
