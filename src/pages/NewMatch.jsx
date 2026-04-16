import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import MatchScoreboard from "../components/Match/MatchScoreboard";
import ResultValidation from "../components/Match/ResultValidation";
import Button from "../components/Common/Button";
import { useAuthStore } from "../store/authStore";
import { usePlayers } from "../hooks/usePlayers";
import { validateMatch } from "../lib/validation";
import { submitMatch } from "../hooks/useMatches";
import { getActiveSeason } from "../hooks/useLeaderboard";
import { SURFACES, DEFAULT_SURFACE } from "../lib/constants";

const EMPTY_SET = { me: null, opp: null, tiebreak: null };

function emptySets() {
  return [{ ...EMPTY_SET }, { ...EMPTY_SET }, { ...EMPTY_SET }];
}

export default function NewMatch() {
  const navigate = useNavigate();
  const player = useAuthStore((s) => s.player);
  const { players } = usePlayers();
  const opponents = players.filter((p) => p.id !== player?.id);

  const [sets, setSets] = useState(emptySets());
  const [opponentId, setOpponentId] = useState("");
  const [surface, setSurface] = useState(DEFAULT_SURFACE);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [activeSeason, setActiveSeason] = useState(null);

  useEffect(() => {
    getActiveSeason().then(({ data }) => setActiveSeason(data ?? null));
  }, []);

  const filledSets = sets.filter((s) => s.me !== null && s.opp !== null);
  const validation = filledSets.length >= 2 ? validateMatch(filledSets) : { valid: false };
  const scoresValid = validation.valid;
  const canSubmit = scoresValid && opponentId && activeSeason;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit || !player) return;

    setSubmitting(true);
    setError(null);

    const { setsWonMe, setsWonOpp } = validation;

    const { error: err } = await submitMatch({
      season_id: activeSeason.id,
      player_a_id: player.id,
      player_b_id: opponentId,
      submitted_by: player.id,
      sets: filledSets,
      sets_won_a: setsWonMe,
      sets_won_b: setsWonOpp,
      surface,
      location: location || null,
      played_at: date,
      status: "pending",
    });

    setSubmitting(false);
    if (err) {
      setError(err.message);
    } else {
      navigate("/");
    }
  }

  const selectedOpponent = players.find((p) => p.id === opponentId);

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm">
          <ArrowLeft size={18} /> Back
        </Link>
        <h2 className="font-display text-2xl">New Match</h2>
        <div className="w-16" />
      </div>

      {/* Scoreboard */}
      <MatchScoreboard
        sets={sets}
        onChange={setSets}
        myName={player?.name}
        oppName={selectedOpponent?.name}
      />

      {/* Result checks */}
      <section>
        <h3 className="font-display text-xl mb-2">Result Checks</h3>
        <ResultValidation scoresValid={scoresValid} reason={validation.reason} />
      </section>

      {/* Details */}
      <section className="space-y-3">
        <h3 className="font-display text-xl">Details</h3>

        {/* Opponent */}
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Opponent</label>
          <select
            value={opponentId}
            onChange={(e) => setOpponentId(e.target.value)}
            className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-secondary text-foreground"
            required
          >
            <option value="">Select opponent…</option>
            {opponents.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Surface */}
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Surface</label>
          <div className="flex gap-2 flex-wrap">
            {SURFACES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSurface(s)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition ${
                  surface === s
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary text-foreground border-border hover:bg-muted"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={format(new Date(), "yyyy-MM-dd")}
            className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-secondary text-foreground"
            required
          />
        </div>

        {/* Location (optional) */}
        <div>
          <label className="block text-xs text-muted-foreground mb-1">
            Location <span className="text-muted-foreground/60">(optional)</span>
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. TC Salata"
            className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-secondary text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </section>

      {!activeSeason && (
        <p className="text-sm text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-xl px-3 py-2">
          No active season. Ask the admin to create one before submitting matches.
        </p>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" size="lg" disabled={!canSubmit || submitting}>
        {submitting ? "Submitting…" : "Submit result"}
      </Button>
    </form>
  );
}
