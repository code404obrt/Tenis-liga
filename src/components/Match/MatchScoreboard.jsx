import clsx from "clsx";
import { winnerOfSet } from "../../lib/validation";

function SetInput({ value, onChange, disabled, isMe }) {
  return (
    <input
      type="number"
      min="0"
      max="7"
      value={value === null ? "" : value}
      onChange={(e) => {
        const v = e.target.value;
        onChange(v === "" ? null : parseInt(v, 10));
      }}
      disabled={disabled}
      className={clsx(
        "w-10 h-10 text-center text-sm font-semibold rounded-lg border outline-none bg-secondary text-foreground",
        "disabled:opacity-30 disabled:cursor-not-allowed",
        isMe
          ? "border-primary focus:ring-2 focus:ring-primary"
          : "border-border focus:ring-2 focus:ring-muted"
      )}
    />
  );
}

function WinsCircle({ wins, isWinner }) {
  return (
    <div className={clsx(
      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
      isWinner ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
    )}>
      {wins}
    </div>
  );
}

export default function MatchScoreboard({ sets, onChange, myName, oppName }) {
  const s1 = sets[0];
  const s2 = sets[1];
  const s3 = sets[2];

  const w1 = s1.me !== null && s1.opp !== null ? winnerOfSet(s1.me, s1.opp) : null;
  const s2Locked = s1.me === null || s1.opp === null;
  const w2 = !s2Locked && s2.me !== null && s2.opp !== null ? winnerOfSet(s2.me, s2.opp) : null;
  const s3Locked = w1 === null || w2 === null || w1 === w2;

  const meWins = [w1, w2, w3(s3, s3Locked)].filter((w) => w === "me").length;
  const oppWins = [w1, w2, w3(s3, s3Locked)].filter((w) => w === "opp").length;

  function update(setIdx, field, value) {
    const next = sets.map((s, i) => (i === setIdx ? { ...s, [field]: value } : s));
    if (setIdx === 0) {
      next[1] = { me: null, opp: null, tiebreak: null };
      next[2] = { me: null, opp: null, tiebreak: null };
    }
    if (setIdx === 1) {
      next[2] = { me: null, opp: null, tiebreak: null };
    }
    onChange(next);
  }

  const showTiebreak1 = s1.me === 7 && s1.opp === 6 || s1.me === 6 && s1.opp === 7;
  const showTiebreak2 = !s2Locked && (s2.me === 7 && s2.opp === 6 || s2.me === 6 && s2.opp === 7);
  const showTiebreak3 = !s3Locked && s3 && (s3.me === 7 && s3.opp === 6 || s3.me === 6 && s3.opp === 7);

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card">
      {/* Header row */}
      <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 items-center px-4 py-2 bg-gradient-card border-b border-border text-xs text-muted-foreground font-medium">
        <span>Player</span>
        <span className="w-10 text-center">S1</span>
        <span className="w-10 text-center">S2</span>
        <span className="w-10 text-center">S3</span>
        <span className="w-8 text-center">W</span>
      </div>

      {/* You row */}
      <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 items-center px-4 py-3 border-b border-border">
        <span className="text-sm font-medium text-primary truncate">{myName ?? "You"}</span>
        <SetInput value={s1.me} onChange={(v) => update(0, "me", v)} isMe />
        <SetInput value={s2.me} onChange={(v) => update(1, "me", v)} isMe disabled={s2Locked} />
        <SetInput value={s3 ? s3.me : null} onChange={(v) => update(2, "me", v)} isMe disabled={s3Locked} />
        <WinsCircle wins={meWins} isWinner={meWins > oppWins} />
      </div>

      {/* Opponent row */}
      <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 items-center px-4 py-3">
        <span className="text-sm text-foreground truncate">{oppName ?? "Opponent"}</span>
        <SetInput value={s1.opp} onChange={(v) => update(0, "opp", v)} />
        <SetInput value={s2.opp} onChange={(v) => update(1, "opp", v)} disabled={s2Locked} />
        <SetInput value={s3 ? s3.opp : null} onChange={(v) => update(2, "opp", v)} disabled={s3Locked} />
        <WinsCircle wins={oppWins} isWinner={oppWins > meWins} />
      </div>

      {/* Tiebreak rows */}
      {(showTiebreak1 || showTiebreak2 || showTiebreak3) && (
        <div className="px-4 py-2 bg-gradient-card border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
          <span>Tiebreak loser score:</span>
          {showTiebreak1 && (
            <label className="flex items-center gap-1">
              S1
              <input
                type="number" min="0" max="6"
                value={s1.tiebreak ?? ""}
                onChange={(e) => update(0, "tiebreak", e.target.value === "" ? null : parseInt(e.target.value, 10))}
                className="w-10 h-8 text-center text-sm border border-border bg-secondary text-foreground rounded-lg"
              />
            </label>
          )}
          {showTiebreak2 && (
            <label className="flex items-center gap-1">
              S2
              <input
                type="number" min="0" max="6"
                value={s2.tiebreak ?? ""}
                onChange={(e) => update(1, "tiebreak", e.target.value === "" ? null : parseInt(e.target.value, 10))}
                className="w-10 h-8 text-center text-sm border border-border bg-secondary text-foreground rounded-lg"
              />
            </label>
          )}
          {showTiebreak3 && (
            <label className="flex items-center gap-1">
              S3
              <input
                type="number" min="0" max="6"
                value={s3?.tiebreak ?? ""}
                onChange={(e) => update(2, "tiebreak", e.target.value === "" ? null : parseInt(e.target.value, 10))}
                className="w-10 h-8 text-center text-sm border border-border bg-secondary text-foreground rounded-lg"
              />
            </label>
          )}
        </div>
      )}
    </div>
  );
}

function w3(s3, locked) {
  if (locked || !s3 || s3.me === null || s3.opp === null) return null;
  return winnerOfSet(s3.me, s3.opp);
}
