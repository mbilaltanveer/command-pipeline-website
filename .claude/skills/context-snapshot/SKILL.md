---
name: context-snapshot
description: "Two-mode portable context skill. Save mode captures the current project and session state into session-context.md so work can resume in any fresh thread without re-explaining. Load mode reads session-context.md and briefs Claude instantly. Works in any project — React apps, Python scripts, Claude OS repos, anything. Trigger: /context-snapshot save | /context-snapshot load"
---

# context-snapshot

Portable session continuity skill. Two modes: **save** and **load**.

---

## Invocation

```
/context-snapshot save    ← run at end of a session
/context-snapshot load    ← run at start of a fresh thread
```

If no argument is given, ask the user: "Save current session or load existing context?"

---

## SAVE MODE

Goal: capture everything a fresh Claude needs to pick up this work cold.

### Step 1 — Discover project identity

Run these in parallel:
- Check for `CLAUDE.md` at project root → read it (it's the primary project guide)
- If no `CLAUDE.md`, check for `README.md` → read it
- Check for `package.json`, `pyproject.toml`, or `Cargo.toml` → read to get stack/version info
- Run `git remote -v` → get repo name and remote URL

### Step 2 — Capture recent session activity

Run these in parallel:
- `git log --oneline -15` → last 15 commits (recent history)
- `git diff HEAD~1 HEAD --stat` → what changed in the last commit
- `git status` → any uncommitted work
- `git branch --show-current` → current branch

### Step 3 — Scan for open work

Check in order (stop when found):
1. TaskList (if task tool is available) → get in_progress and pending tasks
2. Look for a `TODO.md` or `TASKS.md` at project root
3. Look for open items in `CLAUDE.md` under a "Next Steps" or "TODO" section
4. If nothing found, infer next steps from git log and current branch name

### Step 4 — Identify key paths

Based on what you read in Steps 1–2, identify the 5–10 most important file paths the next Claude should know about. These are the files most likely to be touched in continuing this work. Be specific — actual paths, not folder names.

### Step 5 — Write session-context.md

Write to `session-context.md` at the project root using this exact structure:

```markdown
# Session Context
_Last updated: {YYYY-MM-DD HH:MM}_

## Project
**Name:** {project name}
**What it is:** {1–2 sentences — what this project is and what it does}
**Stack:** {tech stack — e.g. Vite + React + Tailwind v4, Python 3.12 + FastAPI, etc.}
**Repo:** {remote URL or local path}
**Branch:** {current branch}

## What Was Done This Session
{Bullet list of what happened — based on recent git commits and any context from the conversation. Be specific: what changed, what was built, what was fixed. 5–10 bullets max.}

## Current State
{1 paragraph describing where the project stands right now. What works, what's in progress, what's pending. Written so a fresh Claude can orient immediately.}

## Key Files & Paths
| Path | Purpose |
|------|---------|
| {path} | {what it is / why it matters} |

## Open Work / Next Steps
{Bullet list of what to do next. If tasks were found, list them. If inferred, label them as inferred.}

## Recent Git Log
```
{output of git log --oneline -15}
```

## Notes
{Any decisions made this session, gotchas discovered, or context that doesn't fit above. If nothing notable, write "None."}
```

After writing:
- Confirm: "session-context.md written. Use `/context-snapshot load` in any fresh thread to restore this context."
- If `session-context.md` already exists, overwrite it — this is always the latest snapshot.

---

## LOAD MODE

Goal: brief a fresh Claude in under 30 seconds so work can resume immediately.

### Step 1 — Read session-context.md

Read `session-context.md` from the project root. If it doesn't exist, say: "No session-context.md found. Run `/context-snapshot save` in a session where you've done work first."

### Step 2 — Run live checks

Run these in parallel to verify the snapshot is still accurate:
- `git log --oneline -5` → confirm last commit matches snapshot
- `git status` → check for any uncommitted changes since snapshot
- `git branch --show-current` → confirm current branch

### Step 3 — Output the briefing

Output a structured briefing in this format:

---

**Project:** {name} — {one-line what it is}
**Stack:** {stack}
**Branch:** `{branch}`

**Last session ({date from snapshot}):**
{bullet list of what was done — pulled from "What Was Done" section}

**Current state:**
{the "Current State" paragraph from the snapshot}

**Key files:**
{the key files table}

**Pick up here:**
{the "Open Work / Next Steps" list}

{If git log or status shows new commits or changes since the snapshot was written, add:}
> **New since snapshot:** {describe what changed}

---

End with: "Context loaded. What would you like to work on?"

---

## PORTABILITY NOTES

This skill works in any project. To use it in a different repo:
1. Copy this folder (`.claude/skills/context-snapshot/`) into the target project's `.claude/skills/`
2. The skill auto-discovers the project — no configuration needed
3. `session-context.md` lives at the project root and is the transfer artifact

Recommend adding `session-context.md` to `.gitignore` if the file contains anything sensitive. For shared repos, committing it is fine — it's just a plain text brief.
