# Session Context
_Last updated: 2026-08-10 14:30_

## Project
**Name:** Command Pipeline Website
**What it is:** Marketing site for Command Pipeline, an operator-built B2B outbound agency running multi-channel cold outreach (email + LinkedIn). Single-page React app plus a `/onboarding` client intake form, converting visitors into booked calls via Calendly.
**Stack:** Vite 8 + React 19 + Tailwind v4 + lucide-react. Vercel serverless functions in `api/`. Deployed on Vercel.
**Repo:** git@github-personal:mbilaltanveer/command-pipeline-website.git
**Branch:** main (clean, in sync with origin)
**Live:** https://commandpipeline.com (domain at Dynadot, DNS → Vercel)

## What Was Done This Session

- **Copy pass across the site** — "B2B companies" wording, Email PRR changed **≥25% → ≥8%** (industry avg ~5% → ~3%), RevenueBase renamed to **AiArk** everywhere, Google Maps added to lead sourcing, warmed domains changed to **30-75+**, sequences described as **2 & 3-touch**.
- **Replaced placeholder testimonials with real proof** — 4 unedited Smartlead campaign screenshots (Investor Audience 33.05% PRR, IMN West 58.33%, CRUX #4 15.13%, ICSC Vegas 13.51%) picked by highest PRR, with click-to-expand lightbox. Added Cameron Legge (CCO, LeanScale) LinkedIn recommendation + photo.
- **Went live** — deployed to Vercel, connected `commandpipeline.com` via Dynadot DNS (A `216.198.79.1`, CNAME `www`), SSL verified. Wired all booking CTAs to `https://calendly.com/commandpipeline/30min`.
- **Lead capture** — "Get a Pricing Breakdown" now opens a modal collecting name + work email, posting to Slack via `/api/notify-pricing-click`. Added "Pricing" nav link.
- **Brand assets** — swapped in user-provided logo files, removed white backgrounds (RGBA), cropped tight, enlarged in nav/footer. Produced LinkedIn covers (1128×191 company, 1584×396 personal).
- **Full external design review — all 9 items shipped:** bolder hero stats (black numbers / dark-yellow labels), emojis → lucide icons + left alignment, Signal Advantage rebuilt as one static fold (removed marquee + `waveFloat`, killed the 3× item duplication, 5-col grid, added subtext), active-step highlighting + stage imagery in How It Works, merged Full Scope into Division of Labor with CTA, merged client results into the benchmarks section, moved ICP after Division of Labor. Sections went 15 → 13.
- **Client onboarding form** at `/onboarding` — 6-step, ~37 fields derived from what delivery actually needs (offer, ICP, signals, access, suppression). Posts to Slack via `/api/submit-onboarding` with chunking for Slack's 3000-char block limit. Path-based routing in `main.jsx` (no router).
- **Fixed pre-existing nav overflow** — moved breakpoint `md` → `lg`; the row was already breaking between 768–1000px before the Onboarding link was added.
- **Drafted Gratefully AI contract** (first client) — `Desktop/Work/Contracts/*.docx`, 18 sections + 2 schedules, brand-themed, generated via docx-js.

## Current State

The site is live, fully deployed, and the working tree is clean with `main` in sync with `origin/main`. All design-review feedback is shipped and verified on production. Two serverless endpoints are live and tested end-to-end (both return `200 {"ok":true}`), delivering to Slack. The onboarding form works at `commandpipeline.com/onboarding` including on hard refresh.

Off-repo, two threads are mid-flight: the **Gratefully AI contract** is drafted but unsigned and still has ~23 blanks, and **email infrastructure warmup** just started in Smartlead (15 mailboxes across 5 domains) with a 21-day hold before any real sending.

## Key Files & Paths

| Path | Purpose |
|------|---------|
| `src/App.jsx` | Entire marketing site — all 13 sections, data arrays at top (`NAV_LINKS`, `STEPS`, `STATS`, `INCLUDED_ITEMS`, `CAROUSEL_ITEMS`, `RESULTS_SCREENSHOTS`, `FAQ_ITEMS`) |
| `src/OnboardingForm.jsx` | 6-step client intake form; `STEPS` array is the field schema |
| `src/main.jsx` | Path-based routing — `/onboarding` → form, everything else → App |
| `api/submit-onboarding.js` | Onboarding → Slack. `SECTIONS` must stay in sync with the form's field names |
| `api/notify-pricing-click.js` | Pricing-modal lead → Slack |
| `src/index.css` | Tailwind v4 tokens + `observe-fade` / `pulseDot` keyframes |
| `public/results/*.png` | 4 campaign proof screenshots |
| `COMMAND_PIPELINE_CONTEXT.md` | 756-line authoritative context doc — ICP, metrics, methodology, service model |
| `~/Desktop/Work/Contracts/Command-Pipeline-x-Gratefully-AI-Services-Agreement.docx` | First client contract (unsigned) |

## Open Work / Next Steps

**Site — one real bug found this session, not yet fixed:**
- [ ] **Two stale `≥25%` Email PRR references contradict the site's ≥8%** — `src/App.jsx:309` (FAQ answer "at least 25% Email PRR") and `src/App.jsx:609` (HeroDashboard mock card). Everything else was updated; these were missed.

**Contract (blocking first client):**
- [ ] Fill ~23 blanks. Decide **legal entity**: registered company name vs `Muhammad Bilal Tanveer, trading as "Command Pipeline"` — signing as an entity that doesn't exist is the main risk.
- [ ] Get Gratefully AI's registered legal name, entity type/jurisdiction, address, signatory.
- [ ] §16 — user chose **Delaware** for governing law + courts. **Still needs the arbitration half of 16.3 deleted** (they filled it with "the State of Delaware", which isn't an arbitration ruleset).
- [ ] §3.8 — decide whether domains/tool seats are included in fee or billed at cost. Material at $1,000/mo.
- [ ] Legal review before signing (cross-border).

**Infrastructure — warmup running, 21-day hold:**
- [ ] No real campaign sending until ~2026-08-31. Daily Limit must stay `0/15`.
- [ ] Verify SPF/DKIM/DMARC live on all 5 domains; 301 redirect them → commandpipeline.com.
- [ ] Day 3–4: confirm warmup volume is *climbing* (2→4→6…). If pinned ≤7, the randomise band (1–7) is capping the ramp — widen upper handle to ~15.
- [ ] Day 7 + 14: seed tests (Mail-Tester / GlockApps) — warmup reputation only measures Smartlead's own pool, not real inboxes.

**Hardening (inferred, not urgent):**
- [ ] Set `SLACK_ONBOARDING_WEBHOOK_URL` to a dedicated channel — onboarding currently falls back to the pricing-alert channel.
- [ ] Onboarding data lands in Slack only; no searchable record. Airtable would be a one-file change.
- [ ] `/api/submit-onboarding` is public with no rate limiting.

## Recent Git Log

```
9695559 Add Onboarding link to nav and fix nav crowding at tablet widths
25b2112 Add client onboarding form at /onboarding
4f51baf Design review: merge client results proof into the benchmarks section
8980a75 Design review: highlight active step and add stage imagery in How It Works
d165bea Design review: merge Full Scope into Division of Labor, align, add CTA
972905c Design review: rebuild Signal Advantage as a single static section
1fbe851 Design review: bolder hero stats, icons over emojis in Problem section
2824819 Make all booking CTAs consistent in naming and behavior
9d58d14 Make hero stats badge visually prominent
6847277 Mask hero particle pattern away from text content
860755b Add Pricing link to nav, scrolling to the SDR cost comparison box
c57160e Add lead-capture popup to pricing breakdown button
d8921d2 Crop logo files tight and enlarge nav/footer display size
fdcccb0 Remove white background from logo files
6b6b342 Replace logo with user-provided brand assets
```

## Notes

- **The Browser pane cannot deliver `IntersectionObserver` or `requestAnimationFrame` callbacks.** A plain observer fires zero times and rAF never runs, because the pane isn't rendering. This causes blank screenshots (the site's `observe-fade` elements start at `opacity: 0` and depend on IO) and makes `getComputedStyle` return stale values. **Verify UI changes by reading inline styles / element counts / geometry, not screenshots.** A fresh `navigate` at scroll position 0 usually renders once; JS-driven scrolling then breaks it.
- Because of that limitation, How It Works active-step tracking deliberately uses a **plain scroll listener** measuring 5 nodes rather than IO/rAF — also means it works in background tabs.
- **Anchor targets must not be animated elements.** `#pricing` is a separate zero-height marker with `top: -104px`, not the `observe-fade` box itself, because the fade transform destabilises smooth-scroll targeting. 104px = 40px announcement bar + 64px nav.
- `SLACK_WEBHOOK_URL` is set in Vercel (Production, Sensitive). Slack channel: `#command-pipeline-pricing-query`. Two `[TEST]` messages were sent there during verification — safe to delete.
- Nav breakpoint is `lg`, not `md` — reverting it reintroduces the tablet-width overflow.
- Contract fonts are Calibri, not Montserrat/Inter, so it renders identically on any machine; brand carried by colour + embedded logo.
- LibreOffice is not installed, so `.docx` cannot be rendered to images for visual QA — verified structurally instead (valid zip, well-formed XML, text extraction).
- Domains warming: commandsalespipeline.com, commpipeline.com, commandyoursales.com, commandrevenue.com, commandyourpipeline.com. Smartlead settings: 30/day cap, +2/day rampup, randomise 1–7, reply rate 30, weekday-only, auto-adjust on.
- GitHub pushes use the `github-personal` SSH host alias — new remotes must use `git@github-personal:...`.
