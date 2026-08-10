# Session Context
_Last updated: 2026-08-10 15:10_

## Project
**Name:** Command Pipeline Website
**What it is:** Marketing site for Command Pipeline, an operator-built B2B outbound agency running multi-channel cold outreach (email + LinkedIn). Single-page React app plus a `/onboarding` client intake form, converting visitors into booked calls via Calendly.
**Stack:** Vite 8 + React 19 + Tailwind v4 + lucide-react. Vercel serverless functions in `api/`. Deployed on Vercel.
**Repo:** git@github-personal:mbilaltanveer/command-pipeline-website.git
**Branch:** main (clean, in sync with origin)
**Live:** https://commandpipeline.com (domain at Dynadot, DNS → Vercel)

## What Was Done This Session

- **Fixed mobile nav bug (latest).** Page rendered **568px wide in a 390px viewport**, pushing the right-aligned hamburger off-canvas until you pinch-zoomed. Cause: campaign screenshots at `min-width: 480px` sit inside flex/grid items that default to `min-width: auto`, so the card sized to the image and stretched the whole document instead of letting the `overflow-x: auto` wrapper scroll. Fixed with `min-width: 0` on the results card + lightbox panel. Desktop verified unchanged.
- **Copy pass across the site** — "B2B companies" wording, Email PRR **≥25% → ≥8%** (industry avg ~5% → ~3%), RevenueBase renamed to **AiArk**, Google Maps added to lead sourcing, **30-75+** warmed domains, **2 & 3-touch** sequences.
- **Replaced placeholder testimonials with real proof** — 4 unedited Smartlead screenshots (Investor Audience 33.05% PRR, IMN West 58.33%, CRUX #4 15.13%, ICSC Vegas 13.51%) chosen by highest PRR, with click-to-expand lightbox. Added Cameron Legge (CCO, LeanScale) LinkedIn recommendation + photo.
- **Went live** — Vercel deploy, `commandpipeline.com` connected via Dynadot DNS (A `216.198.79.1`, CNAME `www`), SSL verified. All booking CTAs → `https://calendly.com/commandpipeline/30min`.
- **Lead capture** — "Get a Pricing Breakdown" opens a modal collecting name + work email → Slack via `/api/notify-pricing-click`. Added "Pricing" nav link.
- **Brand assets** — user-provided logos swapped in, white backgrounds stripped (RGBA), cropped tight, enlarged in nav/footer. LinkedIn covers produced (1128×191 company, 1584×396 personal).
- **Full external design review — all 9 items shipped:** bolder hero stats, emojis → lucide icons + left alignment, Signal Advantage rebuilt as one static fold (marquee + `waveFloat` removed, 3× duplication killed, subtext added), active-step highlighting + stage imagery in How It Works, Full Scope merged into Division of Labor with CTA, client results merged into benchmarks, ICP moved after Division of Labor. Sections 15 → 13.
- **Client onboarding form** at `/onboarding` — 6 steps, ~37 fields derived from delivery needs. Posts to Slack via `/api/submit-onboarding` with chunking for Slack's 3000-char limit. Path-based routing in `main.jsx` (no router).
- **Fixed pre-existing tablet nav overflow** — breakpoint `md` → `lg` (row was already breaking 768–1000px before the Onboarding link).
- **Drafted Gratefully AI contract** (first client) — `~/Desktop/Work/Contracts/*.docx`, 18 sections + 2 schedules, brand-themed, docx-js.

## Current State

Site is live and fully deployed; working tree clean, `main` in sync with `origin/main`. All design-review feedback shipped and verified on production. Mobile and desktop both render correctly with no horizontal overflow. Two serverless endpoints live and tested end-to-end (both `200 {"ok":true}`), delivering to Slack. `/onboarding` works including on hard refresh.

**One known bug is still open** (found during a snapshot sweep, not yet fixed): two stale `≥25%` Email PRR references contradict the site's ≥8%.

Off-repo, two threads are mid-flight: the **Gratefully AI contract** is drafted but unsigned with ~23 blanks, and **email warmup** is running in Smartlead (15 mailboxes / 5 domains) with a 21-day hold before real sending.

## Key Files & Paths

| Path | Purpose |
|------|---------|
| `src/App.jsx` | Entire marketing site — 13 sections; data arrays at top (`NAV_LINKS`, `STEPS`, `STATS`, `INCLUDED_ITEMS`, `CAROUSEL_ITEMS`, `RESULTS_SCREENSHOTS`, `FAQ_ITEMS`, `COMPARISON_ROWS`) |
| `src/App.jsx:309` + `:609` | **The open bug** — stale `≥25%` Email PRR in FAQ answer and HeroDashboard mock card |
| `src/App.jsx:1633` + `:1777` | `minWidth: 0` mobile-overflow fix — do not remove |
| `src/OnboardingForm.jsx` | 6-step client intake form; `STEPS` array is the field schema |
| `src/main.jsx` | Path-based routing — `/onboarding` → form, else App |
| `api/submit-onboarding.js` | Onboarding → Slack. `SECTIONS` must stay in sync with the form's field names |
| `api/notify-pricing-click.js` | Pricing-modal lead → Slack |
| `src/index.css` | Tailwind v4 tokens + `observe-fade` / `pulseDot` keyframes |
| `COMMAND_PIPELINE_CONTEXT.md` | 756-line authoritative context — ICP, metrics, methodology, service model |
| `~/Desktop/Work/Contracts/Command-Pipeline-x-Gratefully-AI-Services-Agreement.docx` | First client contract (unsigned) |

## Open Work / Next Steps

**Site — one confirmed bug, still unfixed:**
- [ ] **Two stale `≥25%` Email PRR references contradict the site's ≥8%** — `src/App.jsx:309` (FAQ: "at least 25% Email PRR") and `src/App.jsx:609` (HeroDashboard mock card). Everything else was updated; these were missed. ~2-line fix.

**Contract (blocking first client):**
- [ ] Fill ~23 blanks. Decide **legal entity**: registered company name vs `Muhammad Bilal Tanveer, trading as "Command Pipeline"` — signing as a non-existent entity is the main risk.
- [ ] Get Gratefully AI's registered legal name, entity type/jurisdiction, address, signatory.
- [ ] §16 — Delaware chosen for governing law + courts. **Arbitration half of 16.3 still needs deleting** (filled with "the State of Delaware", which is not an arbitration ruleset).
- [ ] §3.8 — decide if domains/tool seats are included in fee or billed at cost. Material at $1,000/mo.
- [ ] Legal review before signing (cross-border).

**Infrastructure — warmup running, 21-day hold (started ~2026-08-10):**
- [ ] No real campaign sending until ~2026-08-31. Smartlead Daily Limit must stay `0/15`.
- [ ] Verify SPF/DKIM/DMARC live on all 5 domains; 301 redirect them → commandpipeline.com.
- [ ] Day 3–4: confirm warmup volume is *climbing* (2→4→6…). If pinned ≤7, the randomise band (1–7) is capping the ramp — widen upper handle to ~15.
- [ ] Day 7 + 14: seed tests (Mail-Tester / GlockApps) — warmup reputation only measures Smartlead's own pool, not real inboxes.

**Hardening (inferred, not urgent):**
- [ ] Set `SLACK_ONBOARDING_WEBHOOK_URL` to a dedicated channel — onboarding currently falls back to the pricing-alert channel.
- [ ] Onboarding data lands in Slack only; no searchable record. Airtable would be a one-file change.
- [ ] `/api/submit-onboarding` is public with no rate limiting.

## Recent Git Log

```
628be2f Fix horizontal overflow breaking the mobile nav
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
```

## Notes

- **The Browser pane cannot deliver `IntersectionObserver` or `requestAnimationFrame` callbacks.** A plain observer fires zero times and rAF never runs, because the pane isn't rendering. This causes blank screenshots (`observe-fade` elements start at `opacity: 0` and depend on IO) and makes `getComputedStyle` return **stale** values while inline styles stay correct. **Verify UI by reading inline styles / element counts / geometry, not screenshots.** A fresh `navigate` at scroll 0 usually renders once; JS-driven scrolling then breaks it.
- **`min-width: auto` trap (caused the mobile bug).** Flex and grid items refuse to shrink below their content's intrinsic width. Any wide fixed-width child inside an `overflow-x: auto` wrapper will stretch the whole document instead of scrolling, unless the *item* gets `min-width: 0`. `ComparisonTable` (`minWidth: 640px`, ~line 1968) is the same shape — currently contained by an `overflow: hidden` ancestor, so leave it, but it's the next candidate if overflow reappears.
- **Diagnosing overflow:** compare `document.documentElement.scrollWidth` to `clientWidth`, then walk sections looking for one whose `scrollWidth > viewport` **and** `overflow-x: visible`. Sections with `overflow: hidden` (the decorative radial gradients) measure wide but are clipped and harmless — don't chase them.
- Because of the IO/rAF limitation, How It Works active-step tracking uses a **plain scroll listener** measuring 5 nodes rather than IO/rAF — also works in background tabs.
- **Anchor targets must not be animated elements.** `#pricing` is a separate zero-height marker with `top: -104px`, not the `observe-fade` box, because the fade transform destabilises smooth-scroll targeting. 104px = 40px announcement bar + 64px nav.
- `SLACK_WEBHOOK_URL` set in Vercel (Production, Sensitive). Channel `#command-pipeline-pricing-query`. Two `[TEST]` messages sent during verification — safe to delete.
- Nav breakpoint is `lg`, not `md` — reverting reintroduces tablet-width overflow.
- Contract uses Calibri, not Montserrat/Inter, so it renders identically anywhere; brand carried by colour + embedded logo.
- LibreOffice not installed — `.docx` can't be rendered to images; verify structurally (valid zip, well-formed XML, text extraction).
- Domains warming: commandsalespipeline.com, commpipeline.com, commandyoursales.com, commandrevenue.com, commandyourpipeline.com. Smartlead: 30/day cap, +2/day rampup, randomise 1–7, reply rate 30, weekday-only, auto-adjust on.
- GitHub pushes use the `github-personal` SSH host alias — new remotes must use `git@github-personal:...`.
