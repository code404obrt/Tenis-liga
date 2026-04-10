import { ELO_K } from "./constants";

// Expected score for player A vs player B
export function expectedScore(ratingA, ratingB) {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

// Returns new ratings after a match. `winner` is "a" or "b".
// Note: authoritative ELO recalculation happens server-side in a
// Supabase Edge Function. This client-side helper is for previews only.
export function updateElo(ratingA, ratingB, winner, k = ELO_K) {
  const expA = expectedScore(ratingA, ratingB);
  const expB = 1 - expA;
  const scoreA = winner === "a" ? 1 : 0;
  const scoreB = 1 - scoreA;
  return {
    a: Math.round(ratingA + k * (scoreA - expA)),
    b: Math.round(ratingB + k * (scoreB - expB)),
  };
}
