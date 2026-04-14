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

  // From opponent's (player_b) perspective, swap me/opp labels
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
    <div className="rounded-2xl bg-tennis-light/10 border border-tennis-light p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-tennis-dark font-medium uppercase tracking-wide">
            Pending confirmation
          </p>
          <p className="text-sm text-gray-700 mt-0.5">
            <span className="font-semibold">{submitterName}</span> submitted a result
          </p>
        </div>
        <span className="text-xs text-gray-400">{playedAt}</span>
      </div>

      {/* Score display */}
      <div className="bg-white rounded-xl px-4 py-3">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>Player</span>
          <div className="flex gap-4">
            {sets.map((_, i) => (
              <span key={i} className="w-6 text-center">S{i + 1}</span>
            ))}
            <span className="w-6 text-center">W</span>
          </div>
        </div>
        <ScoreRow
          name="You"
          sets={sets}
          field="me"
          setsWon={match.sets_won_b}
          isMe
        />
        <ScoreRow
          name={submitterName}
          sets={sets}
          field="opp"
          setsWon={match.sets_won_a}
        />
      </div>

      <p className="text-xs text-gray-500">
        Surface: <span className="font-medium">{match.surface}</span>
        {match.location && (
          <> · Location: <span className="font-medium">{match.location}</span></>
        )}
      </p>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {rejecting ? (
        <div className="space-y-2">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for rejection (optional)"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none"
            rows={2}
          />
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={() => setRejecting(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-red-600 hover:bg-red-700"
              onClick={handleReject}
              disabled={loading}
            >
              {loading ? "Rejecting…" : "Confirm rejection"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
            onClick={() => setRejecting(true)}
            disabled={loading}
          >
            Reject
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={handleConfirm}
            disabled={loading}
          >
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
      <span className={isMe ? "font-semibold text-tennis-dark" : "text-gray-700"}>
        {name}
      </span>
      <div className="flex gap-4">
        {sets.map((s, i) => (
          <span key={i} className="w-6 text-center font-mono">
            {s[field]}
          </span>
        ))}
        <span
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
            setsWon > (field === "me" ? sets.length - setsWon : setsWon)
              ? "bg-tennis-dark text-white"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          {setsWon ?? "—"}
        </span>
      </div>
    </div>
  );
}
