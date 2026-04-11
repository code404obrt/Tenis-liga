import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ELO_K = 32;

function expectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

function newElo(rating: number, expected: number, score: number): number {
  return Math.round(rating + ELO_K * (score - expected));
}

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const match = payload.record;

    // Only act when a match transitions to 'confirmed'
    if (match.status !== "confirmed") {
      return new Response("Not a confirmation event", { status: 200 });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const playerAId = match.player_a_id;
    const playerBId = match.player_b_id;
    const seasonId = match.season_id;
    const setsWonA = match.sets_won_a ?? 0;
    const setsWonB = match.sets_won_b ?? 0;
    const winnerIsA = setsWonA > setsWonB;

    // Fetch current ELO for both players
    const { data: players, error: playersErr } = await supabase
      .from("players")
      .select("id, elo")
      .in("id", [playerAId, playerBId]);

    if (playersErr) throw playersErr;

    const playerA = players.find((p: any) => p.id === playerAId)!;
    const playerB = players.find((p: any) => p.id === playerBId)!;

    // Calculate new ELO
    const expA = expectedScore(playerA.elo, playerB.elo);
    const expB = 1 - expA;
    const scoreA = winnerIsA ? 1 : 0;
    const scoreB = 1 - scoreA;

    const newEloA = newElo(playerA.elo, expA, scoreA);
    const newEloB = newElo(playerB.elo, expB, scoreB);

    // Update ELO for both players
    await Promise.all([
      supabase.from("players").update({ elo: newEloA }).eq("id", playerAId),
      supabase.from("players").update({ elo: newEloB }).eq("id", playerBId),
    ]);

    // Upsert season_stats for both players
    await supabase.from("season_stats").upsert(
      [
        {
          season_id: seasonId,
          player_id: playerAId,
          wins: winnerIsA ? 1 : 0,
          losses: winnerIsA ? 0 : 1,
          points: winnerIsA ? 3 : 0,
        },
        {
          season_id: seasonId,
          player_id: playerBId,
          wins: winnerIsA ? 0 : 1,
          losses: winnerIsA ? 1 : 0,
          points: winnerIsA ? 0 : 3,
        },
      ],
      { onConflict: "season_id,player_id" }
    );

    return new Response(
      JSON.stringify({ ok: true, eloA: newEloA, eloB: newEloB }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
