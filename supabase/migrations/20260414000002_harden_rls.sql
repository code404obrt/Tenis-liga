-- Harden match update RLS: prevent submitter from self-confirming.
-- Only player_b (opponent) can set status to 'confirmed' or 'disputed'.
-- player_a (submitter) can only update non-status fields on pending matches.

drop policy if exists "Players can update their own pending matches" on matches;

create policy "Players can update their own pending matches"
  on matches for update
  to authenticated
  using (
    -- old row: caller must be a participant, match must be pending or disputed
    (
      player_a_id = (select id from players where user_id = auth.uid())
      or player_b_id = (select id from players where user_id = auth.uid())
    )
    and status in ('pending', 'disputed')
  )
  with check (
    -- new row: caller must still be a participant
    (
      player_a_id = (select id from players where user_id = auth.uid())
      or player_b_id = (select id from players where user_id = auth.uid())
    )
    and (
      -- Either status is unchanged (editing other fields)
      status = 'pending'
      or status = 'disputed'
      -- Or caller is player_b (opponent) and is confirming/disputing
      or (
        player_b_id = (select id from players where user_id = auth.uid())
        and status in ('confirmed', 'disputed')
      )
    )
  );

-- Harden disputes: only player_b on a pending match can create a dispute.

drop policy if exists "Opponent can create a dispute" on disputes;

create policy "Opponent can create a dispute"
  on disputes for insert
  to authenticated
  with check (
    rejected_by = (select id from players where user_id = auth.uid())
    and exists (
      select 1 from matches m
      where m.id = disputes.match_id
        and m.player_b_id = (select id from players where user_id = auth.uid())
        and m.status = 'pending'
    )
  );
