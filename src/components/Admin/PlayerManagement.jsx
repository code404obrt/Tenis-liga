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
    const { data: { session } } = await supabase.auth.getSession();
    const { data, error: fnErr } = await supabase.functions.invoke("create-player", {
      body: { name: newName, email: newEmail },
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });
    setSaving(false);
    if (fnErr) { setError(fnErr.message + (data?.error ? `: ${data.error}` : "")); return; }
    if (data?.error) { setError(data.error); return; }
    setNewName("");
    setNewEmail("");
    setCreating(false);
    refetch();
  }

  async function handleEditSave(id) {
    setSaving(true);
    setError(null);
    const { error: err } = await supabase.from("players").update({ name: editName }).eq("id", id);
    setSaving(false);
    if (err) { setError(err.message); return; }
    setEditingId(null);
    refetch();
  }

  async function handleToggleActive(id, current) {
    setError(null);
    const { error: err } = await supabase.from("players").update({ is_active: !current }).eq("id", id);
    if (err) setError(err.message);
    else refetch();
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-card">
        <h3 className="font-display text-2xl">Players</h3>
        <Button size="sm" variant="secondary" onClick={() => setCreating((v) => !v)}>
          {creating ? "Cancel" : "+ New player"}
        </Button>
      </div>

      <div className="p-4 space-y-3">
        {creating && (
          <form onSubmit={handleCreate} className="space-y-2 border border-border rounded-xl p-3 bg-secondary">
            <input
              type="text"
              placeholder="Full name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground placeholder:text-muted-foreground"
              required
            />
            <p className="text-xs text-muted-foreground">
              A temporary password will be set to their email address. They should change it on first login.
            </p>
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? "Creating…" : "Create player"}
            </Button>
          </form>
        )}

        {error && <p className="text-xs text-destructive">{error}</p>}

        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div>
            {players.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2.5 border-b border-border last:border-0 gap-2">
                {editingId === p.id ? (
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 border border-border rounded-lg px-2 py-1 text-sm bg-secondary text-foreground"
                    autoFocus
                  />
                ) : (
                  <div className="min-w-0">
                    <p className={`text-sm font-medium ${!p.is_active ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {p.name}
                      {p.role === "admin" && (
                        <span className="ml-1.5 text-xs text-primary">admin</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">ELO {p.elo}</p>
                  </div>
                )}

                <div className="flex gap-1.5 shrink-0">
                  {editingId === p.id ? (
                    <>
                      <Button size="sm" onClick={() => handleEditSave(p.id)} disabled={saving}>Save</Button>
                      <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="secondary" onClick={() => { setEditingId(p.id); setEditName(p.name); }}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant={p.is_active ? "destructive" : "secondary"}
                        className={p.is_active ? "bg-destructive/10 text-destructive hover:bg-destructive/20 shadow-none" : ""}
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
    </div>
  );
}
