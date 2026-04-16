# Design Update Plan — Lovable-Inspired Redesign

## Goal

Restyle the Tennis League App to match the visual identity of the Lovable reference app
(`https://github.com/code404obrt/tennis-match-tracker`), while keeping **all existing
features, pages, logic, and data flows** unchanged.

Think of it as: **our app's skeleton + Lovable's clothes.**

## Scope

### In scope (visual / styling only)
- Tailwind color palette & theme tokens
- Typography (add Bebas Neue for headings)
- Card surfaces (dark, rounded, glow, gradients)
- Buttons, inputs, badges — restyled to new tokens
- Leaderboard rank icons (Trophy / Medal for top 3)
- W/L color treatment (success-green / destructive-red)
- ELO flash animations retuned for dark background

### Out of scope (explicitly NOT changing)
- App logic, features, pages, routes
- Database schema, RLS, Edge Functions
- State management (Zustand stores)
- Authentication flow
- Match submission / confirmation / dispute flows
- ELO calculation
- Admin panel functionality
- Component structure — only `className`s change, not JSX structure

## Reference Design System (from Lovable app)

### Colors (HSL, dark theme)
| Token                 | Value                    | Purpose                    |
| --------------------- | ------------------------ | -------------------------- |
| `--background`        | `220 20% 8%`             | App background (near-black navy) |
| `--foreground`        | `60 10% 95%`             | Primary text               |
| `--card`              | `220 18% 12%`            | Card surfaces              |
| `--primary`           | `68 100% 50%`            | Tennis-ball yellow-green   |
| `--primary-foreground`| `220 20% 8%`             | Text on primary            |
| `--secondary`         | `220 15% 18%`            | Secondary surfaces         |
| `--muted`             | `220 15% 20%`            | Muted backgrounds          |
| `--muted-foreground`  | `220 10% 55%`            | Muted text                 |
| `--accent`            | `68 80% 45%`             | Accent / hover             |
| `--destructive`       | `0 72% 51%`              | Errors, losses             |
| `--success`           | `142 72% 45%`            | Success, wins              |
| `--border`            | `220 15% 20%`            | Borders                    |
| `--ring`              | `68 100% 50%`            | Focus rings                |
| `--court-green`       | `142 50% 25%`            | Tennis court green accent  |
| `--court-clay`        | `20 60% 45%`             | Clay court accent          |
| `--gold`              | `45 93% 47%`             | Rank 1                     |
| `--silver`            | `0 0% 70%`               | Rank 2                     |
| `--bronze`            | `30 60% 45%`             | Rank 3                     |
| `--radius`            | `0.75rem`                | Default corner radius      |

### Gradients / shadows
- `--gradient-primary`: `linear-gradient(135deg, hsl(68 100% 50%), hsl(80 100% 40%))`
- `--gradient-dark`: `linear-gradient(180deg, hsl(220 20% 10%), hsl(220 20% 6%))`
- `--gradient-card`: `linear-gradient(145deg, hsl(220 18% 14%), hsl(220 18% 10%))`
- `--shadow-glow`: `0 0 30px hsl(68 100% 50% / 0.2)`
- `--shadow-card`: `0 4px 24px hsl(0 0% 0% / 0.4)`

### Typography
- **Body:** Inter (already in use — kept)
- **Headings (h1–h6):** Bebas Neue, letter-spacing 0.02em (new)
- Google Fonts import added to `index.css`

### Animations
- `fadeIn`, `slideUp`, `scaleIn` — entrance animations
- `pulse-glow` — for primary-highlighted elements (e.g. live status)
- `accordion-down`/`accordion-up` — Radix-style collapsibles

### Icons
- `lucide-react` — already in use, **no changes needed**
- New usage: `Trophy` for rank 1, `Medal` for ranks 2–3

---

## Phased Implementation

### Phase 1 — Foundation (config + theme tokens)
**Files:**
- `tennis-league-app/tailwind.config.js`
- `tennis-league-app/src/index.css`

**Changes:**
1. Replace hardcoded tennis colors (`tennis-dark`, `tennis-light`, `tennis-bg`) with HSL CSS-variable tokens matching Lovable's palette.
2. Add `fontFamily.display` → Bebas Neue.
3. Add `borderRadius.lg/md/sm` → based on `--radius`.
4. Add custom colors: `court.green`, `court.clay`, `rank.gold/silver/bronze`, `success`.
5. Add keyframes + animations (`pulse-glow`, `accordion-*`).
6. Install `tailwindcss-animate` plugin.
7. In `index.css`:
   - Add Google Fonts import (Inter + Bebas Neue).
   - Define all CSS variables under `:root` and `.dark`.
   - Add `@layer base` rules: dark body default, Bebas Neue on headings.
   - Add utility classes: `.text-gradient`, `.bg-gradient-*`, `.shadow-glow`, `.shadow-card`, animation utilities.
   - Update scrollbar styling for dark theme.

**Test:** `npm run dev` — confirm dark theme loads, fonts render, primary color shows as yellow-green. (UI will look broken — that's expected until Phase 2.)

---

### Phase 2 — Component restyle
**Files (probable):**
- `src/components/Header.jsx`
- `src/components/Leaderboard.jsx` (or equivalent)
- `src/components/MatchHistory.jsx`
- `src/components/PendingMatches.jsx`
- `src/pages/Home.jsx`
- `src/pages/NewMatch.jsx`
- `src/pages/PlayerProfile.jsx`
- `src/pages/Admin.jsx`
- All shared UI components (buttons, cards, inputs)

**Changes per component:**
- Replace `bg-tennis-dark|light|bg` → new semantic tokens (`bg-card`, `bg-background`, `bg-primary`, etc.)
- Apply `font-display` to headings.
- Add rounded corners (`rounded-xl`), borders (`border-border`), shadow (`shadow-card`).
- Wins → `text-success`, losses → `text-destructive`.
- Add Trophy/Medal icons on top-3 leaderboard rows.
- Primary CTA buttons: `shadow-glow` or `bg-gradient-primary`.
- Hover states: `hover:bg-secondary/50`, `hover:text-primary`.

**Test after each component:** navigate to its page, check visual result, verify all existing functionality still works.

---

### Phase 3 — Polish & cleanup
1. Retune ELO flash animations for dark bg (green/red glow intensities).
2. Full click-through: every route, every interaction — check contrast, readability, hover/focus states, mobile view.
3. Update `CLAUDE.md` — refresh color palette info in tech stack section.
4. Delete reference clone: `rm -rf /Users/borza/Obrt/tenis/lovable-tenis`.
5. User reviews → merge PR `design-update` → `main`.

---

## Risks & Considerations

- **Dark mode contrast:** some subtle text may become illegible against dark background. Needs manual verification per page.
- **ELO flash colors:** current animations assume light bg. May need brightness adjustment.
- **Bebas Neue is bold:** headings will look dramatically different. User has approved.
- **Mobile-first preserved:** Lovable uses `container mx-auto` + responsive grids — same approach as our app, no layout churn expected.
- **`tennis-*` color class sweep:** `grep`/replace risk — must be done carefully per file, not globally (some files may use these inline in conditional classes).

## Git Workflow

1. Branch off `main`: `git checkout -b design-update`
2. Phase 1 commit: `chore(ui): add dark theme tokens and Bebas Neue typography`
3. Phase 2 commits: one per component cluster (Header+Nav, Leaderboard, Home, Match flow, Profile, Admin)
4. Phase 3 commit: `chore: polish dark-theme contrast and retune animations`
5. Open PR → review → merge.

## Model Recommendation

- **Phase 1:** Opus (config-heavy, high cascade risk)
- **Phase 2:** Sonnet acceptable (mechanical className swaps)
- **Phase 3:** Opus (judgment-heavy polish)
