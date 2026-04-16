import { useState } from "react";
import { format, parseISO } from "date-fns";
import { confirmMatch, rejectMatch } from "../../hooks/useMatches";
import Button from "../Common/Button";

export default function PendingConfirmationCard({ match, onAction }) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitterName = match.submitter?.name ?? "Unknown";
  const playedAt = match.played_at
    ? format(parseISO(match.played_at), "d MMM yyyy")
    : "—";

  const sets = Array.isArray(match.sets)
    ? match.sets.map((s) => ({ me: s.opp, opp: s.me, tiebreak: s.tiebreak }))
    : [];

  async function handleConfirm() {
    setLoading(true);
    setError(null);
    const { error: err } = await confirmMatch(match.id);
    setLoading(false);
    if (err) setError(err.message);
    else onAction();
  }

  async function handleReject() {
    setLoading(true);
    setError(null);
    const { error: err } = await rejectMatch(match.id, reason || null);
    setLoading(false);
    if (err) setError(err.message);
    else onAction();
  }

  return (
    <div className="rounded-xl bg-primary/10 border border-primary/30 p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-primary font-medium uppercase tracking-wide">
            Pending confirmation
          </p>
          <p className="text-sm text-foreground mt-0.5">
            <span className="font-semibold">{submitterName}</span> submitted a result
          </p>
        </div>
        <span className="text-xs text-muted-foreground">{playedAt}</span>
      </div>

      {/* Score display */}
      <div className="bg-secondary rounded-xl px-4 py-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>Player</span>
          <div className="flex gap-4">
            {sets.map((_, i) => (
              <span key={i} className="w-6 text-center">S{i + 1}</span>
            ))}
            <span className="w-6 text-center">W</span>
          </div>
        </div>
        <ScoreRow name="You" sets={sets} field="me" setsWon={match.sets_won_b} isMe />
        <ScoreRow name={submitterName} sets={sets} field="opp" setsWon={match.sets_won_a} />
      </div>

      <p className="text-xs text-muted-foreground">
        Surface: <span className="font-medium text-foreground">{match.surface}</span>
        {match.location && (
          <> · Location: <span className="font-medium text-foreground">{match.location}</span></>
        )}
      </p>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {rejecting ? (
        <div className="space-y-2">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for rejection (optional)"
            className="w-full border border-border bg-secondary text-foreground rounded-xl px-3 py-2 text-sm resize-none placeholder:text-muted-foreground"
            rows={2}
          />
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="flex-1" onClick={() => setRejecting(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" className="flex-1" onClick={handleReject} disabled={loading}>
              {loading ? "Rejecting…" : "Confirm rejection"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button variant="destructive" size="sm" className="flex-1 bg-destructive/10 text-destructive hover:bg-destructive/20 shadow-none" onClick={() => setRejecting(true)} disabled={loading}>
            Reject
          </Button>
          <Button size="sm" className="flex-1" onClick={handleConfirm} disabled={loading}>
            {loading ? "Confirming…" : "Confirm result"}
          </Button>
        </div>
      )}
    </div>
  );
}

function ScoreRow({ name, sets, field, setsWon, isMe }) {
  return (
    <div className="flex items-center justify-between text-sm py-1">
      <span className={isMe ? "font-semibold text-primary" : "text-foreground"}>
        {name}
      </span>
      <div className="flex gap-4">
        {sets.map((s, i) => (
          <span key={i} className="w-6 text-center font-mono text-foreground">
            {s[field]}
          </span>
        ))}
        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
          setsWon > (field === "me" ? sets.length - setsWon : setsWon)
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}>
          {setsWon ?? "—"}
        </span>
      </div>
    </div>
  );
}
