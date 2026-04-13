# Email Notifications Plan

## Trigger Events

1. **Match submitted** (INSERT on `matches`) → email player_b: "You have a match to confirm"
2. **Match confirmed** (UPDATE on `matches`, status → `confirmed`) → email player_a: "Your match was confirmed"
3. **Match rejected** (UPDATE on `matches`, status → `disputed`) → email player_a: "Your match was disputed"

## Architecture

- One Edge Function: `send-match-email` — handles all three cases
- Two DB webhooks:
  - `matches` INSERT → triggers notification to player_b
  - `matches` UPDATE → checks `old_record.status` vs `record.status`, sends email only on actual status transitions (pending→confirmed, pending→disputed). Must ignore other updates (e.g. admin voiding) to avoid unwanted emails.
- Existing `on-match-confirmed` webhook (ELO/stats) remains separate — runs in parallel, no conflict.

## Email Provider

- **Resend** (resend.com) — simplest API, 3000 emails/month free
- Start with Resend test domain (`onboarding@resend.dev`) for development — only sends to account owner's email
- Need a real domain before going live with all 20 players

## Email Content

Each email includes:
- Opponent's name
- Match score (formatted sets)
- Date and surface
- Link to the app

Style: simple HTML — clean layout with match details and a CTA button. No heavy templates.

## Setup Steps

1. Sign up at resend.com, get API key
2. Store API key as `RESEND_API_KEY` in Supabase Edge Function secrets
3. Create `supabase/functions/send-match-email/index.ts`
4. Configure two DB webhooks in Supabase dashboard (INSERT and UPDATE on `matches`)
5. Test with Resend test domain
6. Add real domain for production use
