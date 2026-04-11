-- The previous update policy applied the status check to both the old AND
-- new row (Postgres default). When confirming a match the new status is
-- 'confirmed', which failed the check. Fix by using a separate WITH CHECK
-- that only verifies the player is a participant.

drop policy if exists "Players can update their own pending matches" on matches;

create policy "Players can update their own pending matches"
  on matches for update
  to authenticated
  using (
    -- old row must be pending or disputed
    (
      player_a_id = (select id from players where user_id = auth.uid())
      or player_b_id = (select id from players where user_id = auth.uid())
    )
    and status in ('pending', 'disputed')
  )
  with check (
    -- new row: player must still be a participant (status can change freely)
    player_a_id = (select id from players where user_id = auth.uid())
    or player_b_id = (select id from players where user_id = auth.uid())
  );
