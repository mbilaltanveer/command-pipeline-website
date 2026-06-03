# Command Pipeline — Complete Project Context
_This document is the authoritative reference for everything about Command Pipeline: the company, the service, the brand, the repo, and the website. Written to be fully self-explanatory for any developer, designer, or AI agent coming in cold._

---

## Table of Contents

1. [Company Overview](#1-company-overview)
2. [Origin Story & Rebrand](#2-origin-story--rebrand)
3. [The CP-OS Repo — Purpose & Structure](#3-the-cp-os-repo--purpose--structure)
4. [Service Offering](#4-service-offering)
5. [Ideal Customer Profile (ICP)](#5-ideal-customer-profile-icp)
6. [The 5-Layer Technical Architecture](#6-the-5-layer-technical-architecture)
7. [Internal Tool Stack](#7-internal-tool-stack)
8. [Signal Targeting Library](#8-signal-targeting-library)
9. [Campaign Performance Metrics & Benchmarks](#9-campaign-performance-metrics--benchmarks)
10. [GEX Copywriting Method](#10-gex-copywriting-method)
11. [Brand Guidelines](#11-brand-guidelines)
12. [The Marketing Website — Origin & Design](#12-the-marketing-website--origin--design)
13. [Website Sections (Full Breakdown)](#13-website-sections-full-breakdown)
14. [Competitive Reference Studies](#14-competitive-reference-studies)
15. [Operational Standards](#15-operational-standards)

---

## 1. Company Overview

**Command Pipeline** is an operator-built B2B demand generation agency. We run multi-channel cold outreach campaigns — email and LinkedIn — for clients, delivering predictable outbound pipeline at scale.

**What Command Pipeline is not:**
- Not a SaaS product or software tool
- Not a marketing agency (we do demand generation, not brand marketing)
- Not a consulting firm that hands over a playbook

**What Command Pipeline is:**
- A services business with deeply built internal automation infrastructure
- A system that turns real-time market signals into booked meetings
- An operator-led agency where the founders have done the actual work (carried quotas, ran outbound teams, built GTM from zero)

**One-liner:** Operator-built outbound systems that turn market signal into predictable pipeline.

**Motto:** Command your pipeline. Command your revenue.

**Scale (as of 2026):**
- ~$82K MRR across ~11 active client campaigns
- 7-person core team: 2 founders, 2 developers, 3 GTM operators
- 500+ campaigns run across all clients
- 2M+ emails sent
- 35K+ LinkedIn connection requests sent
- 579 interested replies analyzed to validate ICP (Sep 2025 – Jan 2026)

---

## 2. Origin Story & Rebrand

Command Pipeline was originally founded under the name **AICRO** (AI Chief Revenue Officer). The AICRO name reflected the early positioning: AI-augmented revenue operations that act like a fractional CRO.

As the business matured, the positioning sharpened. AICRO was a product name; Command Pipeline is an outcome name — it describes exactly what clients get: a commanded, predictable pipeline. The rebrand happened in early 2026.

**What changed:**
- Company name: AICRO → Command Pipeline
- Brand colors: Sky Blue `#21A8F2` primary → Amber Gold `#E8A000` primary
- Accent: Coral `#FF8559` retained as CTA color
- Logo: Updated to Command Pipeline wordmark with CP monogram
- Motto: Updated from generic tagline → "Command your pipeline. Command your revenue."
- Website: Rebuilt from scratch with new brand system

**What did NOT change:**
- The core service model (multi-channel email + LinkedIn outreach)
- The tech stack and internal tooling
- The team, clients, and operational processes
- The performance benchmarks and metric definitions

The CP-OS repo still contains some legacy references to `aicro-*` in filenames and MCP keys — these are being migrated gradually and do not affect the live system.

---

## 3. The CP-OS Repo — Purpose & Structure

### Purpose

The CP-OS repo (this repository) is a **compounding knowledge system and operational OS** for Command Pipeline's entire go-to-market operation. It serves multiple functions simultaneously:

1. **Client delivery system** — Campaign briefs, enrichment pipelines, copy generation, and outreach execution for client campaigns all run through this repo.
2. **Knowledge base** — Everything the team learns about outbound, ICP targeting, copywriting, and client behavior is captured as atomic knowledge nodes and compounded over time.
3. **AI agent runtime** — Claude Code operates within this repo as the primary AI assistant, using the MCP layer to interact with live tools (Supabase, Airtable, EmailBison, HeyReach, Slack).
4. **Institutional memory** — Client intelligence, campaign history, and operational decisions are persisted in structured folders rather than scattered across Slack threads and email chains.

### Philosophy

> Context is primary. The system structures and compounds it. Plain English is code.

Every piece of operational knowledge is written to be readable by a human and actionable by an AI. No black boxes. No tribal knowledge.

### Three-Layer Architecture

| Layer | Location | Purpose |
|-------|----------|---------|
| **Layer 1: Atomic Knowledge** | `knowledge_base/` | Single-concept files with YAML frontmatter and wiki-links. The authoritative definitions for all terms, processes, and benchmarks. |
| **Layer 2: Strategic Docs** | `00_foundation/` | Positioning, ICP, operational standards. Composes Layer 1 concepts — never redefines them. |
| **Layer 3: Domain Operations** | `01_clients/`, `02_product/`, `03_gtm/` | Per-client context, product engineering, GTM execution. Compounds over time. |

### Folder Structure

```
cp-os/
├── CLAUDE.md                     # Master instructions for AI agents
├── _mcp/                         # Custom MCP servers (Supabase, Airtable, EmailBison, HeyReach)
├── knowledge_base/               # Layer 1: Atomic knowledge nodes
│   ├── technical/                # Tool integrations, data architecture
│   ├── business/                 # Company, clients, metrics, ICP
│   └── methodology/              # Processes, playbooks, SOPs
├── 00_foundation/                # Layer 2: Strategic docs
│   ├── positioning/              # Value prop, ICP, differentiators
│   └── operations/               # Operational standards
├── 01_clients/                   # Layer 3: Per-client intelligence
├── 02_product/                   # Product & engineering ops
├── 03_gtm/                       # GTM operations
├── active/                       # Working data (gitignored): CSVs, exports
├── execution/                    # Python enrichment pipeline scripts
│   └── clients/icps/             # Per-client ICP YAML configs
├── scripts/                      # Utility scripts
├── raw_context/                  # Unprocessed transcripts, docs, data dumps
├── website/                      # Marketing website (Vite + React)
└── _system/                      # Governance: taxonomy.yaml, ontology.yaml
```

### How the Outbound Motion Flows Through the Repo

```
Client onboarded → /client-ingest {slug}
                 → Client intelligence files populated in 01_clients/
                 → ICP config created in execution/clients/{client}/icps/

Campaign starts  → /qualify {client}     — domain → DNC → classify → grade leads
                 → /surface {client}     — enrich with signals
                 → /copywrite {client}   — GEX method copy generation
                 → Sheet loaded into EmailBison + HeyReach via MCPs
                 → Campaign live

Reporting        → /client-report {slug} — pulls Airtable data → structured report
                 → /gtm-standup          — daily GTM update to Slack
```

---

## 4. Service Offering

### Core Service: Multi-Channel Cold Outreach

Command Pipeline runs coordinated outbound campaigns across two channels simultaneously:

**Email Channel**
- 3-touch email sequences (Email 1 → Email 2 → Email 3) written with the GEX method
- 75+ warmed domains per client — infrastructure built to protect deliverability
- Primary sending tool: EmailBison
- Target: ≥25% Positive Reply Rate, ≤5% bounce rate

**LinkedIn Channel**
- Connection request + 2 follow-up message sequences
- Personalized per cluster/segment — not templated blasts
- Primary tool: HeyReach
- Target: ≥40% Positive Reply Rate, >25% connection acceptance

**What "multi-channel by default" means in practice:**
- The same lead may be in an email sequence AND a LinkedIn sequence simultaneously
- Cross-channel coordination prevents double-messaging (DNC checks apply across both)
- Email and LinkedIn have separate but coordinated copy — the messaging is complementary, not identical
- If a lead replies on one channel, they're removed from the other

### What Clients Get

| Deliverable | Detail |
|-------------|--------|
| Signal-based lead lists | ICP-qualified, enriched with intent signals, A/B/C/D graded |
| Email sequences | 3 emails per sequence, 3 variants (A/B/C), GEX method |
| LinkedIn sequences | Connection request + 2 DMs, platform-native tone |
| Infrastructure | 75+ warmed domains, healthy inboxes, DNC-compliant |
| AI reply agents | Replies handled within 5 minutes, categorized, routed |
| CRM sync | Every email sent, LinkedIn view, connection request logged to client CRM |
| Weekly reporting | PRR, E2P, campaign health, Tier classification |
| Attribution | Direct (caused a reply) + influence (touched a closed deal) attribution |

### What CP Replaces

Clients who work with Command Pipeline typically had one of three previous states:
1. **DIY outbound** — Founder doing their own outreach via Apollo or LinkedIn Sales Nav, burning hours, inconsistent results
2. **In-house SDR team** — $180–240K per SDR + $120K manager + $30–50K tools per year; slow to ramp, high turnover
3. **Previous agency** — Single-channel, no signal intelligence, spray-and-pray, poor deliverability

CP replaces 2–3 SDRs at ~$7,500/mo flat fee with better infrastructure, signal-based targeting, and AI-augmented execution.

---

## 5. Ideal Customer Profile (ICP)

_Data-validated from 579 interested replies across 20+ campaigns, Sep 2025 – Jan 2026._

Command Pipeline uses a **multi-segment ICP** with three distinct buyer types:

### Segment 1: B2B SaaS (Primary — ~80% of positive replies)

| Dimension | Criteria |
|-----------|----------|
| Industry | B2B SaaS — Sales/GTM SaaS, AI Platforms, Vertical SaaS, Fintech |
| Titles | CEO, Founder, CRO, VP Sales, Head of Growth (73% C-Suite/Founders, 15% VP-level) |
| Company size | 15–50 employees (sweet spot); up to 100 acceptable |
| Revenue | $500K–$20M ARR |
| Funding | Seed to Series B, $3M+ raised, within last 12 months |
| Geography | United States (primary); some Canada |
| Buying signals | Hiring VP Sales/CRO/Head of Marketing, recently funded, founder-led sales, posting for SDR/BDR |
| Primary channel | Email (90% of replies), LinkedIn (10%) |

**Sub-sector tiers:**
- Tier 1: Sales/GTM SaaS, AI Platforms, Vertical SaaS with complex sales cycles
- Tier 2: Fintech, PropTech SaaS
- Tier 3: Healthcare SaaS, HR Tech, Data/Analytics

### Segment 2: PropTech (High-Affinity — ~20% of positive replies)

| Dimension | Criteria |
|-----------|----------|
| Industry | PropTech SaaS — property management, CRE tech, construction tech, real estate fintech |
| Titles | CEO/Founder, CRO, VP Sales |
| Company size | 15–75 employees |
| Revenue | $1M–$20M ARR |
| Funding | Seed to Series B |
| Why high-affinity | Founders have deep PropTech operator credibility (Crexi $70M, Hemlane CRO, Pacaso $100M+, JLL) |

### Segment 3: VC Firms (Channel Multiplier — leverage play)

| Dimension | Criteria |
|-----------|----------|
| Firm type | Early-stage VCs investing in B2B SaaS and/or PropTech |
| Titles | General Partner, Managing Partner, Partner |
| Why use | 1 VC = 15–50 portfolio company introductions |
| Approach | Relationship-first, not cold volume; warm intros through shared portfolio connections |

### Who We Do NOT Sell To

- Large enterprises (>100 employees) — established GTM teams, long procurement cycles
- Pre-revenue / pre-seed startups (<10 employees) — too early, no budget
- Post-Series C / mature SaaS — internal RevOps already in place
- Companies with >5 SDRs — already have the infrastructure
- B2C companies — our approach is B2B-specific
- SDR/BDR-level contacts — can't buy
- Companies in active fundraising mode — track as nurture ("reach out in 90 days" pattern)

### Why They Buy

1. No outbound infrastructure — want pipeline but haven't built it
2. Tried and failed — previous outbound underperformed due to bad targeting, poor deliverability, or single-channel
3. Speed — building in-house takes 6+ months; CP delivers in weeks
4. Scale without headcount — SDR cost structure is prohibitive at early stage

---

## 6. The 5-Layer Technical Architecture

Command Pipeline's internal infrastructure runs on five distinct layers that compound over time:

```
Layer 1: Data & Enrichment
  → Lead sourcing: RevenueBase, Clay, Apollo, Apify
  → Signal detection: Clay (funding, hiring, tech stack, conference attendance)
  → Grading: A/B/C/D per company and person
  → DNC check: Supabase blocklist (email + domain)

Layer 2: Campaign Execution
  → Email sending: EmailBison (primary), SmartLead (legacy)
  → LinkedIn automation: HeyReach
  → Infrastructure: 75+ warmed domains per client

Layer 3: Operations & Management
  → Campaign tracking: Airtable (campaigns, leads, replies, metrics)
  → Task management: Airtable
  → Client comms: Slack

Layer 4: Data Storage & Intelligence
  → Operational database: Supabase (PostgreSQL)
  → DNC/blocklist: Supabase public.dnc table
  → Reporting: Airtable + custom reporting views

Layer 5: Automation & Integration
  → Workflow automation: n8n
  → AI reply agents: Claude-based agents handling reply triage
  → CRM sync: HubSpot, Salesforce (client-dependent)
  → Notifications: Slack webhooks
```

---

## 7. Internal Tool Stack

| Category | Tool | Purpose |
|----------|------|---------|
| Email sending | EmailBison | Primary email campaign tool for all clients |
| Email sending (legacy) | SmartLead | Used for Capitalize only (legacy) |
| LinkedIn automation | HeyReach | Connection requests + message sequences |
| Lead enrichment | Clay | Multi-signal enrichment, AI grading, lead scoring |
| Lead database | RevenueBase | Primary B2B contact database (via Gigasheet) |
| Additional sourcing | Apollo, Apify | Supplementary lead sourcing |
| Operations/CRM | Airtable | Campaign management, task tracking, client health |
| Database | Supabase | Operational data store, DNC list, custom querying |
| Workflow automation | n8n | Connecting tools, triggered workflows |
| AI assistant | Claude (Anthropic) | Campaign building, copywriting, reporting, analysis |
| Client CRM | HubSpot / Salesforce | Client-side CRM sync (varies by client) |
| Communication | Slack | Internal ops + client reply channel monitoring |

---

## 8. Signal Targeting Library

Every Command Pipeline campaign targets prospects based on intent signals — real-time behavioral triggers that transform cold outreach into timely, relevant conversations.

**Core principle:** Every campaign includes at least one Tier 1 or Tier 2 signal. Pure cold-list campaigns without signal enrichment are never launched.

### Signal Tiers

**Tier 1 — Highest Impact (3x+ conversion vs cold ICP)**
| Signal | Description |
|--------|-------------|
| Conference/Event Attendance | Prospect is attending or recently attended a relevant industry event |
| Customer Competitor Targeting | Prospect uses a competitor's product |
| Lookalike Audience Modeling | Prospect matches the profile of existing high-value customers |

_Conference campaigns specifically achieve 6.5x better efficiency than evergreen outreach (median 1:112 emails to positive vs 1:728 for evergreen). Average PRR: 53%._

**Tier 2 — High Impact (1.5–2.9x conversion)**
| Signal | Description |
|--------|-------------|
| New Executive Hires | Company recently hired C-suite or VP-level leadership |
| Recently Funded | Company received funding within last 90 days |
| Hiring Intent | Company is hiring for sales, marketing, or GTM roles |
| Social Listening Triggers | Prospect engaged with relevant content on LinkedIn or social |

**Tier 3 — Moderate Impact (1.2–1.5x conversion)**
- Job postings (growth signal)
- Technology stack changes
- Partnership announcements

**Tier 4 — Supporting (1.1–1.3x)**
- Company news/PR
- Website visit intent
- Content engagement

**Tier 5 — Contextual (variable)**
- Seasonal timing
- Market/regulatory events
- Industry cycle triggers

### Signal Stacking

Campaigns that combine multiple signals compound their impact:
- Tier 1 + Tier 1 → Highest conversion ("ICSC attendees who are competitor customers")
- Tier 1 + Tier 2 → Strong conversion with urgency ("Conference attendees who recently hired")
- Tier 2 + Tier 3 → Reliable moderate conversion

---

## 9. Campaign Performance Metrics & Benchmarks

_Derived from 500+ campaigns, 2M+ emails, 35K+ LinkedIn connection requests. These are the canonical definitions — all reporting must use these exactly._

### Core Metrics

**Email**
| Metric | Formula | Notes |
|--------|---------|-------|
| Positive Reply Rate (PRR) | Interested Replies / Total Replies | Primary performance metric |
| Emails to Positive (E2P) | Emails Sent / Interested Replies | Efficiency ratio (whole number) |
| Total Reply Rate | All Replies / Leads Contacted | Deliverability signal only (must be >1%) |
| Bounce Rate | Bounces / Emails Sent | Must be ≤5% |

**LinkedIn**
| Metric | Formula | Notes |
|--------|---------|-------|
| Positive Reply Rate | Interested Replies / Total Replies | Primary performance metric |
| Messages to Positive | Messages Sent / Interested Replies | Efficiency ratio |
| Connection Acceptance Rate | Connections Accepted / Requests Sent | Target >25% |

**Critical rule:** Reply Rate denominator is always **Leads Contacted**, never emails sent. Multi-touch sequences mean one lead gets 2–4 emails — using emails sent deflates the rate.

### Performance Tiers

**Email Campaign Benchmarks**
| Tier | Positive Reply Rate | Emails to Positive |
|------|--------------------|--------------------|
| Excellent | ≥35% | <300 |
| Great | 25–35% | 300–600 |
| Good | 15–25% | 600–1,000 |
| Monitor | 8–15% | 1,000–1,500 |
| Attention | <8% | >1,500 |

**LinkedIn Campaign Benchmarks**
| Tier | Positive Reply Rate | Messages to Positive | Connection Acceptance |
|------|--------------------|--------------------|----------------------|
| Excellent | ≥60% | <7 | ≥35% |
| Great | 40–60% | 7–12 | 25–35% |
| Good | 25–40% | 12–25 | 15–25% |
| Monitor | 10–25% | 25–50 | 10–15% |
| Attention | <10% | >50 | <10% |

### Campaign Type Efficiency Rankings

| Campaign Type | Efficiency vs Evergreen | PRR Range |
|--------------|------------------------|-----------|
| Conference/Event | **6.5x** | 39–95% |
| Retargeting/Reactivation | 1.5–2x | 33–74% |
| Founder Story Narrative | ~1x | 32–53% |
| Signal-Based | 1–3x | 26–45% |
| Core/Broad Evergreen | Baseline | 20–38% |
| Offer-Led | Below baseline | 5–15% |

### Positive-to-Meeting Conversion Rate

Across all clients, ~20–21% of interested replies convert to a booked meeting. This is consistent regardless of client, industry, or deal size. Use 20% as the standard planning assumption.

---

## 10. GEX Copywriting Method

Every piece of cold email and LinkedIn copy at Command Pipeline is written using the GEX Method — a direct response framework built for B2B outbound.

### The Core Principle

Every cold email answers one question: **What's in it for them?**

Every B2B offer does one of four things:
1. Save money
2. Make more money
3. Save time
4. Reduce risk

### The 4-Sentence Email Structure

```
Sentence 1: Why you, why now — the relevance trigger (signal reference)
Sentence 2: Poke the bear OR explain how you help
Sentence 3: Social proof with specific numbers ($, %, ratio)
Sentence 4: Low-friction CTA
```

**Target length:** Under 75 words. Never more than 100.

### Sequence Structure

| Touch | Format | Purpose |
|-------|--------|---------|
| Email 1 | Net new, with subject line | Introduce offer, answer "why you, why now" |
| Email 2 | Threaded reply | Add context, different angle or proof point |
| Email 3 | Net new, with subject line | Change value prop angle, lower friction CTA |
| Email 4 (optional) | Threaded reply | Find the right person, not a desperate breakup |

### Hard Rules

- Write like a sales rep, not a marketer or AI
- Under 75 words — the highest reply rates come from short emails
- Subject lines: 2–4 words maximum, peer-to-peer tone
- Quantify everything — specific numbers (3.72x, $847K, 37%) beat round numbers
- No AI tells: no "I hope this finds you well," no "I wanted to reach out," no corporate jargon
- Low-friction CTAs: "Worth a quick chat?" not "Would love to schedule a call to discuss"
- LinkedIn: tweet-length (<280 chars), references the email, feels like a quick DM
- Variants A, B, C must take distinctly different angles — not the same email with swapped words

---

## 11. Brand Guidelines

### Brand Positioning

Command Pipeline is positioned as an **operator-built agency** — practitioners who have run outbound before building the system, not consultants selling frameworks or SaaS tools selling features.

The brand communicates:
- Credibility through operational specificity ("579 interested replies," "≥25% PRR")
- Sophistication without arrogance
- Signal-first thinking — every claim backed by data
- Action-oriented — pipeline now, not someday

### Color System

#### Primary Palette (Amber Gold — Active Brand)

| Token | Hex | Role |
|-------|-----|------|
| **Amber Gold** | `#E8A000` | Primary brand accent — headlines, key highlights, icons |
| **Amber Light** | `#FBBF24` | Secondary accent — supporting highlights |
| **Coral** | `#FF8559` | CTA color only — primary buttons, call-to-action elements |
| **Dark Navy** | `#1C1C24` | Dark section backgrounds, card surfaces in dark mode |
| **Deeper Dark** | `#0D0F14` | Cinematic/dramatic section backgrounds |
| **Dark Slate** | `#1E293B` | Primary text on light backgrounds |
| **Medium Slate** | `#475569` | Body text, secondary content |
| **Muted Slate** | `#94A3B8` | Captions, metadata, tertiary content |
| **Light Background** | `#F1F5F9` | Card surfaces, section alternates on light pages |
| **Border Gray** | `#E2E8F0` | Dividers, card borders |
| **Success Green** | `#4ADE80` | Live indicators, positive status |

#### Usage Rules

- Amber Gold (`#E8A000`) is the brand identity color — used on headlines, accents, icons, stat callouts
- Coral (`#FF8559`) is reserved exclusively for CTAs — never used decoratively
- The dark palette (`#1C1C24`, `#0D0F14`) is used for dramatic sections, hero dark panels, dark cards
- Never use Amber Gold as a background fill for large areas — it's an accent, not a base
- Light sections use white (`#FFFFFF`) or near-white (`#F8FAFC`) — never warm grey

#### Legacy Palette (AICRO — Retired)

The original AICRO brand used Sky Blue `#21A8F2` as the primary accent. This color may still appear in older client deliverables, docs, and internal files. It is retired from the website and all new materials.

### Typography

| Context | Font | Weight | Notes |
|---------|------|--------|-------|
| Headlines, hero text | Montserrat | 700–800 | Tight letter-spacing (-0.02em), clamp() for responsive sizing |
| Key metrics, stat callouts | Space Grotesk | 700 | Used for large number displays (25%, 240K, etc.) |
| Body copy, labels, nav | Inter | 400–600 | Clean, functional, neutral |

**Font loading:** All three fonts are loaded via Google Fonts. No custom font files in the repo.

**Type sizing principles:**
- Hero H1: `clamp(36px, 4.5vw, 54px)` — scales fluidly
- Section H2: `clamp(26px, 3.5vw, 36px)`
- Body: 15–17px, line-height 1.6–1.65
- Labels/overlines: 11–13px, `letter-spacing: 0.08–0.16em`, uppercase

### Logo

- Primary logo: `cp-logo-full.png` — wordmark with CP mark
- Light background: full color version
- Dark background: white version
- Do not alter aspect ratio, add effects, or recolor
- Logo lives in `/website/public/` for web use

### Voice & Tone

| Attribute | Do | Don't |
|-----------|-----|-------|
| Operator-built | "We run these systems daily" | "Our proprietary AI methodology" |
| Signal-first | "Triggered by a hiring spike signal" | "Leveraging our advanced platform" |
| Metric-grounded | "34% positive reply rate" | "Industry-leading results" |
| Direct | "Here's what happened this week" | "We're pleased to report" |
| Specific | "579 interested replies" | "Hundreds of data points" |
| Active | "We build your outbound system" | "Your outbound system will be built" |

**Hard writing rules (all external copy):**
- No em dashes (— or –). Use commas or periods instead.
- No filler openers ("I wanted to reach out," "I hope this finds you well")
- No AI buzzwords: leverage, streamline, cutting-edge, robust, seamless, empower
- Active voice always
- No sign-offs on LinkedIn InMails

---

## 12. The Marketing Website — Origin & Design

### How the Website Came to Be

The Command Pipeline website was built as part of the rebrand from AICRO to Command Pipeline in 2026. The site needed to reflect the new brand positioning — operator-built, signal-first, outcome-oriented — while being visually competitive with top GTM/outbound agency sites.

**The design process:**

1. **Competitor research** — Full design teardowns of two key competitors:
   - [C17 Lab](https://www.c17.ai/) — light background, editorial serif typography, electric purple accent, floating testimonial widget
   - [StackOptimise](https://www.stackoptimise.com/) — dark site, Switzer font, blue accent, email input in hero, tool constellation diagram

2. **Design direction chosen** — A middle path: dark accent sections (hero, typewriter, Why Us, CTA) combined with light content sections. Amber Gold as the unique brand color — neither C17's purple nor StackOptimise's blue.

3. **Visual inspirations studied** — Google's Antigravity website was studied for motion design patterns. Full-page screenshots were captured via Playwright.

4. **Tech stack chosen** — Vite + React + Tailwind CSS v4. Lightweight, fast, no server needed.

5. **Key design decisions made:**
   - Mouse-parallax particle background in hero (350 particles: navy dots, amber +, coral ×)
   - Typewriter cinematic section between Problem and How It Works
   - Pipeline carousel with wave motion (Lucide SVG icons, not Unicode)
   - Sticky How It Works panel
   - Dark sections with radial gradient orbs for depth

### Tech Stack (Website)

| Technology | Version | Role |
|-----------|---------|------|
| Vite | ^8.0 | Build tool and dev server |
| React | ^19.2 | UI framework |
| Tailwind CSS | ^4.3 | Utility-first CSS |
| Lucide React | latest | SVG icon library (carousel icons) |
| Google Fonts | CDN | Montserrat, Inter, Space Grotesk |

### Design System (Website-Specific)

**Animation keyframes defined in `index.css`:**

| Name | Effect | Used On |
|------|--------|---------|
| `feedSlide` | Slide + fade in from bottom | Dashboard feed items on load |
| `floatCard` | Gentle up-down float (5s loop) | Hero dashboard widget |
| `pulseDot` | Scale + opacity pulse | Live indicator dots |
| `carouselScroll` | Horizontal translateX(-33.333%) | Pipeline carousel track |
| `waveFloat` | Vertical translateY(-12px) sine wave (2.4s) | Carousel items (staggered) |
| `observe-fade` | Opacity + translateY scroll reveal | All major sections |

**CSS variables and breakpoints:**
- Tailwind v4 uses `@layer base`, `@layer utilities` — unlayered CSS overrides both regardless of specificity
- Preview renders at ~846px default; use `preview_resize 1280` to trigger `lg:` breakpoints
- Observe-fade animations replay on every scroll pass (both enter and exit)

---

## 13. Website Sections (Full Breakdown)

The marketing website (`website/src/App.jsx`) contains the following sections in order:

### Navbar
- Fixed, `z-50`, white background
- Logo (`cp-logo-full.png`), nav links, coral CTA button ("Book a Strategy Session")
- Mobile hamburger menu with full dropdown

### Hero
- White background with amber dot grid (masked radial gradient)
- Mouse-parallax particle canvas (350 particles, 3 shapes, depth-based parallax)
- Left column: badge pill, H1 headline, body copy, dual CTAs (coral button + ghost link)
- Right column: live campaign activity dashboard widget (dark card, floating animation, live feed items)
- Bottom: animated stats bar — ≥25% Email PRR, ≥40% LinkedIn PRR, 240K+ Active Leads, 12+ Campaigns

### Problem Section
- Light `#F8FAFC` background
- 3 cards: No signal intelligence, Single-channel thinking, Built by marketers not operators
- Each card has coral top border and card-hover lift effect

### Typewriter Section
- Full-width dark `#0D0F14` background — cinematic break
- Heading types out on scroll with blinking amber cursor
- Text: "Command Pipeline turns buying signals into closed pipeline."
- Radial ambient glow behind the text

### Pipeline Carousel
- Dark `#0D0F14` background continuation
- 10 Lucide SVG icons in dark circular pills, scrolling horizontally
- **Endless loop:** 30 items (3× the 10 originals), `translateX(-33.333%)` animation
- **Wave motion:** Each item has a staggered `waveFloat` animation creating a rolling wave
- **Hover behavior:** Both the wave AND horizontal scroll pause on hover (via `:has()` CSS selector)
- Icons: Antenna, Target, Mail, UserPlus, Bot, TrendingUp, RefreshCw, ShieldCheck, Share2, Award

### How It Works
- White background
- Sticky left panel (desktop only) with step index
- Scrolling right column: 5 step cards with left accent border + gradient halo per step color
- Steps: Signal Intelligence, Precision Targeting, Multi-Channel Sequences, AI-Augmented Execution, Pipeline Attribution

### Why Us
- Dark `#1C1C24` background with large central spotlight orb
- Edge accent glows (amber bottom-right, coral top-left)
- 2×2 grid of differentiator cards: Operator-Built, System-as-Product, Multi-Channel by Default, AI Where It Matters
- Feature badge strip below: 6 amber pill badges

### Results
- White background
- 2 large metric cards: ≥25% Email PRR, ≥40% LinkedIn PRR
- Dark bottom bar with cost comparison copy + coral CTA

### Who It's For
- Light `#F8FAFC` background
- 3 ICP segment cards: B2B SaaS (Primary), PropTech (High-Affinity), VC Firms (Channel Multiplier)
- "Not a fit if you are" exclusion chips in coral-tinted style

### CTA Section
- White background with dense dot grid pattern
- Dark `#1C1C24` card with gradient top bar, ambient glow, corner accent glows
- H2: "Ready to Command Your Pipeline?"
- Coral button: "Book an Outbound Strategy Session"
- Current CTA link: `mailto:hello@commandpipeline.com` → **replace with Calendly URL before going live**

### Footer
- Dark `#1C1C24` background
- Logo + tagline + nav links + copyright + "All systems operational" green dot

---

## 14. Competitive Reference Studies

Full design teardowns are saved in `website/Reference/`. Key findings:

### C17 Lab (c17.ai) — Reference Study
- **Background:** Light off-white `#F6F6F6` — not dark
- **Accent:** Electric purple `#6C47FF`
- **Typography:** `Pp Editorial New` serif (italic for key phrase in headline) + Inter
- **Signature move:** Floating testimonial widget always visible in bottom-left corner
- **Proof method:** Real email screenshots from NBA, Feastables, Miro
- **CTA strategy:** No-cost pilot campaign — radical risk reversal
- **What CP can borrow:** Persistent social proof widget concept; editorial confidence in copy

### StackOptimise (stackoptimise.com) — Reference Study
- **Background:** Full dark `#201E29` charcoal-purple
- **Accent:** Electric blue `#2D62FF` on purple family
- **Typography:** `Switzer` geometric sans (modern, distinctive)
- **Signature move:** Email input in hero instead of button — lowest possible friction
- **Proof method:** Tool constellation diagram, video testimonials, real email reply screenshots
- **CTA strategy:** Free custom action plan (no meeting required)
- **What CP can borrow:** Tool/tech visualization concept; workflow split diagram ("We take care of / You just show up")

### Key Differentiators from Competitors

| Dimension | Command Pipeline | C17 | StackOptimise |
|-----------|-----------------|-----|---------------|
| Background | Light hero + dark accents | Light throughout | Full dark |
| Color | Amber Gold `#E8A000` | Purple `#6C47FF` | Blue `#2D62FF` |
| Font | Montserrat + Inter | Editorial New + Inter | Switzer |
| Proof style | Stats + live dashboard | Video + email screenshots | Screenshots + video testimonials |
| Hero CTA | Coral button | Button + pulse shadow | Email input field |

---

## 15. Operational Standards

### Non-Negotiable Rules

1. **Always check blocklist before contacting any lead** — both email AND domain, across both channels
2. **Always specify `channel_source` when adding to blocklist**
3. **Never store API keys in code** — load from `.env` only
4. **Client name matching in MCPs is case-sensitive** — verify with `list_clients` first
5. **Query before mutating** — before any write/delete via MCP, first read current state
6. **All campaigns follow the full launch flow** — no shortcuts past ICP validation, blocklist check, and sequence review
7. **All metrics use the canonical definitions** — Positive Reply Rate = Interested Replies / Total Replies (not emails sent)

### Campaign Launch Checklist

1. ICP defined in campaign config YAML
2. Lead list sourced and enriched via Clay
3. DNC/blocklist check run against `public.dnc` in Supabase
4. Company + person graded A/B/C/D; only A/B proceed to outreach
5. Email copy written per GEX method, QA'd via stop-slop
6. LinkedIn copy written (tweet-length, references email)
7. Sequences uploaded to EmailBison + HeyReach
8. Campaign launched with daily volume limits set
9. Reporting view created in Airtable

### Writing Standards (All External Copy)

- No em dashes (— or –)
- No filler phrases: "I wanted to reach out," "I hope this finds you well," "Just following up"
- No buzzwords: leverage, streamline, cutting-edge, robust, seamless
- Active voice always
- No sign-offs on LinkedIn InMails
- Run stop-slop QA before any external prose is delivered

### Metric Reporting Standards

- Always use Positive Reply Rate as the headline metric
- Always include Emails to Positive (or Messages to Positive for LinkedIn)
- Always classify campaigns into their performance Tier (Excellent / Great / Good / Monitor / Attention)
- Never report "Reply Rate" calculated from emails sent — use Leads Contacted as denominator
- Use the standard table format: `Campaign | Contacted | Replies | PRR | Interested | E2P | Tier`

---

_Last updated: June 2026 — reflects Command Pipeline brand (post-AICRO rebrand), Amber Gold color system, and the current website build._
