// Validate a single tennis set score. Best-of-3 match, regular sets must
// end 6-x (x <= 4) or 7-5, and a tiebreak set ends 7-6 with a loser tiebreak
// score recorded separately.
export function isValidSet(me, opp, tiebreak) {
  if (me == null || opp == null) return false;
  if (me < 0 || opp < 0) return false;

  const hi = Math.max(me, opp);
  const lo = Math.min(me, opp);

  if (hi === 7 && lo === 6) {
    // Tiebreak set — loser tiebreak score required (>= 0)
    return tiebreak != null && tiebreak >= 0;
  }
  if (hi === 7 && lo === 5) return true;
  if (hi === 6 && lo <= 4) return true;
  return false;
}

export function winnerOfSet(me, opp) {
  if (me > opp) return "me";
  if (opp > me) return "opp";
  return null;
}

// Validate an array of sets for a best-of-3 match.
// Returns { valid, setsWonMe, setsWonOpp, reason }
export function validateMatch(sets) {
  if (!Array.isArray(sets) || sets.length < 2 || sets.length > 3) {
    return { valid: false, reason: "Match must have 2 or 3 sets" };
  }

  let setsWonMe = 0;
  let setsWonOpp = 0;

  for (let i = 0; i < sets.length; i++) {
    const s = sets[i];
    if (!isValidSet(s.me, s.opp, s.tiebreak)) {
      return { valid: false, reason: `Set ${i + 1} is invalid` };
    }
    const w = winnerOfSet(s.me, s.opp);
    if (w === "me") setsWonMe++;
    else if (w === "opp") setsWonOpp++;
  }

  // Best of 3: first to 2 sets wins, and no extra sets after that.
  if (sets.length === 2 && !(setsWonMe === 2 || setsWonOpp === 2)) {
    return { valid: false, reason: "2-set match must be 2-0" };
  }
  if (sets.length === 3 && !(setsWonMe === 2 || setsWonOpp === 2)) {
    return { valid: false, reason: "3-set match must have a winner" };
  }
  if (sets.length === 3 && (setsWonMe === 2) !== (setsWonOpp < 2)) {
    // sanity
  }

  return { valid: true, setsWonMe, setsWonOpp };
}
