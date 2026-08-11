# Session Context
_Last updated: 2026-08-10 16:05_

## Project
**Name:** Command Pipeline Website
**What it is:** Marketing site for Command Pipeline, an operator-built B2B outbound agency running multi-channel cold outreach (email + LinkedIn). Single-page React app plus a `/onboarding` client intake form, converting visitors into booked calls via Calendly.
**Stack:** Vite 8 + React 19 + Tailwind v4 + lucide-react. Vercel serverless functions in `api/`. Deployed on Vercel.
**Repo:** git@github-personal:mbilaltanveer/command-pipeline-website.git
**Branch:** main (clean, in sync with origin)
**Live:** https://commandpipeline.com (domain at Dynadot, DNS → Vercel)

## What Was Done This Session

- **Pricing modal now qualifies leads (latest).** Added three dropdowns — *What's your outbound today? / Expected email outreach / Expected budget* — on top of name + email. API forwards them to Slack and also logs the **email domain** separately, since that's the field to enrich before replying.
- **Replaced the modal's native `<select>`s with a custom listbox.** macOS draws select popups over the trigger (aligning the selected option with the box) and no CSS can move it. The custom control opens *below*, matches the dark theme, and keeps parity: keyboard open/arrow/Enter, Escape, click-outside, aria combobox/listbox/option roles. **Custom controls don't do HTML validation**, so submit now checks the three answers explicitly and shows an inline message.
- **Fixed mobile nav bug.** Page rendered **568px wide in a 390px viewport**, pushing the hamburger off-canvas until you pinch-zoomed. Cause: screenshots at `min-width: 480px` inside flex/grid items that default to `min-width: auto`, so the card sized to the image and stretched the document. Fixed with `min-width: 0`. Desktop verified unchanged.
- **Copy pass** — "B2B companies", Email PRR **≥25% → ≥8%** (industry avg ~5% → ~3%), RevenueBase → **AiArk**, Google Maps added to lead sourcing, **30-75+** warmed domains, **2 & 3-touch** sequences.
- **Replaced placeholder testimonials with real proof** — 4 unedited Smartlead screenshots (Investor Audience 33.05% PRR, IMN West 58.33%, CRUX #4 15.13%, ICSC Vegas 13.51%) plus Cameron Legge (CCO, LeanScale) recommendation, with click-to-expand lightbox.
- **Went live** — Vercel deploy, `commandpipeline.com` via Dynadot DNS (A `216.198.79.1`, CNAME `www`), SSL verified. All booking CTAs → Calendly.
- **Full external design review — all 9 items shipped.** Sections 15 → 13. Signal Advantage rebuilt as one static fold (marquee + `waveFloat` removed, 3× duplication killed), Full Scope merged into Division of Labor, client results merged into benchmarks, ICP moved after Division of Labor, active-step highlighting + stage imagery in How It Works.
- **Client onboarding form** at `/onboarding` — 6 steps, ~37 fields, posts to Slack with chunking for the 3000-char block limit. Path-based routing in `main.jsx` (no router).
- **Brand assets + tablet nav fix** — logos swapped/de-backgrounded/cropped, LinkedIn covers produced, nav breakpoint `md` → `lg`.
- **Off-repo:** drafted the Gratefully AI contract (`~/Desktop/Work/Contracts/*.docx`), analysed their onboarding submission, and set up Smartlead warmup for 15 mailboxes.

## Current State

Site is live and deployed; working tree clean, `main` in sync with `origin/main`. Lint and production build pass. Mobile and desktop both render with no horizontal overflow. Two serverless endpoints live and tested end-to-end, delivering to Slack. `/onboarding` works including hard refresh.

**One known bug remains open** (found in an earlier snapshot sweep, still unfixed): two stale `≥25%` Email PRR references contradict the site's ≥8%.

Off-repo, two threads are mid-flight: the **Gratefully AI contract** is drafted but unsigned with ~23 blanks, and **email warmup** is running in Smartlead (15 mailboxes / 5 domains) with a 21-day hold before real sending.

## Key Files & Paths

| Path | Purpose |
|------|---------|
| `src/App.jsx` | Entire marketing site — 13 sections; data arrays at top (`NAV_LINKS`, `STEPS`, `STATS`, `INCLUDED_ITEMS`, `CAROUSEL_ITEMS`, `RESULTS_SCREENSHOTS`, `FAQ_ITEMS`, `COMPARISON_ROWS`) |
| `src/App.jsx:309` + `:609` | **The open bug** — stale `≥25%` Email PRR in FAQ answer and HeroDashboard mock card |
| `src/App.jsx:1508` | `SelectField` — reusable custom dropdown (reusable in OnboardingForm if wanted) |
| `src/App.jsx:1658` | `Results` — benchmarks + campaign proof + pricing modal, all in one section |
| `src/App.jsx:1797` `:1941` `:2004` | `minWidth: 0` — the mobile-overflow fixes; **do not remove** |
| `src/OnboardingForm.jsx` | 6-step intake form; `STEPS` array is the field schema. Still uses **1 native `<select>`** (same macOS popup behaviour) |
| `src/main.jsx` | Path-based routing — `/onboarding` → form, else App |
| `api/notify-pricing-click.js` | Pricing modal → Slack (name, email, domain, 3 qualifiers) |
| `api/submit-onboarding.js` | Onboarding → Slack. `SECTIONS` must stay in sync with the form's field names |
| `COMMAND_PIPELINE_CONTEXT.md` | 756-line authoritative context — ICP, metrics, methodology, service model |
| `~/Desktop/Work/Contracts/Command-Pipeline-x-Gratefully-AI-Services-Agreement.docx` | First client contract (unsigned) |

## Open Work / Next Steps

**Site — one confirmed bug, still unfixed:**
- [ ] **Two stale `≥25%` Email PRR references contradict the site's ≥8%** — `src/App.jsx:309` (FAQ) and `src/App.jsx:609` (HeroDashboard mock card). ~2-line fix.
- [ ] *(optional)* Apply `SelectField` to the onboarding form's remaining native `<select>` for consistent dropdown behaviour.

**Contract (blocking first client):**
- [ ] Fill ~23 blanks. Decide **legal entity**: registered company vs `Muhammad Bilal Tanveer, trading as "Command Pipeline"` — signing as a non-existent entity is the main risk.
- [ ] Get Gratefully AI's registered legal name, entity type/jurisdiction, address, signatory.
- [ ] §16 — Delaware chosen for law + courts. **Arbitration half of 16.3 still needs deleting** (filled with "the State of Delaware", not an arbitration ruleset).
- [ ] §3.8 — decide if domains/tool seats are included or billed at cost. Material at $1,000/mo.
- [ ] Legal review before signing (cross-border).

**Gratefully AI launch prep (from their onboarding submission):**
- [ ] **Reset the 30 meetings/month target.** At ~20% reply→meeting that needs ~150 positives/month ≈ 45k–150k emails; 15 mailboxes ≈ 10k/month. Realistic combined output is ~10–20/month. Agree in writing before month 2.
- [ ] **Their signals need nonprofit translation** — "funding rounds" doesn't apply; use grant awards, capital campaigns, Form 990 growth. "Hiring for sales" → Development Director / Major Gift Officer postings. Their own note (*new development leadership 3–18mo in role*) is the strongest signal.
- [ ] Get substantiation for the "20% increase in donations" / "10hrs saved" claims — pre-revenue with no nameable logos, so unsupported claims can't go in copy.
- [ ] Get their live CRM/platform integration list — it's a hard ICP filter, not a nice-to-have.
- [ ] Get suppression exports (Instantly all-time, HeyReach, HubSpot contacts + open deals) — they have prior outbound and no suppression file.
- [ ] Get Andrew Johnson's direct booking link + email (current link is a `/request-demo` form, worse for cold traffic).
- [ ] Nonprofit data sourcing needs Form 990 (ProPublica/Candid) — Apollo is weak here.

**Infrastructure — warmup running, 21-day hold (started ~2026-08-10):**
- [ ] No real sending until ~2026-08-31. Smartlead Daily Limit stays `0/15`.
- [ ] Verify SPF/DKIM/DMARC on all 5 domains; 301 redirect → commandpipeline.com.
- [ ] Day 3–4: confirm warmup volume is *climbing* (2→4→6…). If pinned ≤7, the randomise band (1–7) is capping the ramp — widen upper handle to ~15.
- [ ] Day 7 + 14: seed tests (Mail-Tester / GlockApps) — warmup reputation only measures Smartlead's own pool.

**Hardening (inferred, not urgent):**
- [ ] Set `SLACK_ONBOARDING_WEBHOOK_URL` to a dedicated channel — currently falls back to the pricing-alert channel.
- [ ] Onboarding data lands in Slack only; no searchable record. Airtable = one-file change.
- [ ] `/api/submit-onboarding` is public with no rate limiting.

## Recent Git Log

```
cd4981f Replace pricing modal selects with a custom dropdown
58be6bb Add qualification dropdowns to the pricing breakdown modal
677eb67 Update session context after mobile overflow fix
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
```

## Notes

- **The Browser pane cannot deliver `IntersectionObserver` or `requestAnimationFrame` callbacks.** A plain observer fires zero times and rAF never runs, because the pane isn't rendering. This causes blank screenshots (`observe-fade` starts at `opacity: 0` and depends on IO) and makes `getComputedStyle` return **stale** values while inline styles stay correct. **Verify UI by reading inline styles / element counts / geometry, not screenshots.** A fresh `navigate` at scroll 0 usually renders once; JS-driven scrolling then breaks it. The pane can also collapse to a 0×0 viewport — check `window.innerWidth` before trusting any layout measurement.
- **`min-width: auto` trap.** Flex and grid items refuse to shrink below their content's intrinsic width. Any wide fixed-width child inside an `overflow-x: auto` wrapper stretches the whole document instead of scrolling, unless the *item* gets `min-width: 0`. `ComparisonTable` (`minWidth: 640px`) is the same shape — currently contained by an `overflow: hidden` ancestor, but it's the next candidate if overflow reappears.
- **Diagnosing overflow:** compare `document.documentElement.scrollWidth` to `clientWidth`, then walk sections for one whose `scrollWidth > viewport` **and** `overflow-x: visible`. Sections with `overflow: hidden` (decorative radial gradients) measure wide but are clipped — don't chase them.
- **Native `<select>` popups can't be repositioned with CSS** — macOS draws the list over the trigger so the selected option aligns with the box. Only a custom listbox fixes it. When replacing a native control, remember it silently drops HTML form validation.
- Because of the IO/rAF limitation, How It Works active-step tracking uses a **plain scroll listener** measuring 5 nodes — also works in background tabs.
- **Anchor targets must not be animated elements.** `#pricing` is a separate zero-height marker with `top: -104px`, not the `observe-fade` box, because the fade transform destabilises smooth-scroll targeting. 104px = 40px announcement bar + 64px nav.
- `SLACK_WEBHOOK_URL` set in Vercel (Production, Sensitive). Channel `#command-pipeline-pricing-query`. Three `[TEST]` messages sent during verification — safe to delete.
- Nav breakpoint is `lg`, not `md` — reverting reintroduces tablet-width overflow.
- Contract uses Calibri, not Montserrat/Inter, so it renders identically anywhere; brand carried by colour + embedded logo. LibreOffice is not installed — `.docx` can't be rendered to images; verify structurally (valid zip, well-formed XML, text extraction).
- Domains warming: commandsalespipeline.com, commpipeline.com, commandyoursales.com, commandrevenue.com, commandyourpipeline.com. Smartlead: 30/day cap, +2/day rampup, randomise 1–7, reply rate 30, weekday-only, auto-adjust on.
- GitHub pushes use the `github-personal` SSH host alias — new remotes must use `git@github-personal:...`.
