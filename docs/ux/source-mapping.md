# Fleet Ops Console — Production Source Mapping

**Status**: First-pass UX spec
**Date**: 2026-04-03

## Purpose

This document maps prototype UX concepts back to the canonical Fleet production source at `/Users/Shared/fleet-management-system`. It identifies where existing components can be reused, where shell-level changes are sufficient, and where new route-specific work is required.

## Canonical Source Reference

| Source | Path | Notes |
|---|---|---|
| Production repo | `/Users/Shared/fleet-management-system` | `origin/main` is authoritative. Local `main` may be stale. |
| Compatibility shell | `/Users/fleetadmin/worktrees/mac-control-plane-live-main/control-surface` | Bridge only. Not the design source. |
| Disposable prototype | `/Users/fleetadmin/worktrees/fleet-ops-workspace-ux-prototype` | This repo. Throw-away after spec extraction. |

## Shell Mapping

### What changes at the shell level

| Prototype concept | Current production source | Change type |
|---|---|---|
| App title "Fleet Ops Console" | `layout.tsx`: title "Fleet Management System" | **Metadata update** — title, description, favicon |
| Forest green unified palette | `globals.css`: already forest green, but Ops uses zinc | **CSS update** — unify Ops color tokens |
| Sidebar nav reorganization | `app-sidebar.tsx`: 4 groups, 15 items | **Component rewrite** — new groups, new items, new ordering |
| Context switcher | `workspace-switcher.tsx`: Media/Labs switcher | **Component rewrite** — replace workspace concept with personal/work/blended context model |
| Global header simplification | `global-header.tsx`: hamburger + search + timer + user | **Component update** — remove timer from header, add context dot |
| Default landing → Today | `page.tsx`: thread-first inbox at `/` | **Route change** — root becomes Today Runway, threads move to `/chat` |

### What stays the same at the shell level

- Session/auth flow structure (SessionProvider → AppShell → redirect logic)
- LeadSheetProvider and similar overlay providers
- CommandPalette integration pattern
- Mobile sidebar overlay pattern
- `h-dvh` viewport layout with sidebar + header + content

## Route / Area Mapping

### Today (`/` → prototype: `app/page.tsx`)

| Prototype element | Production mapping |
|---|---|
| Greeting + date | New component. No current equivalent. |
| Next Up card | Derived from: thread priority, calendar next event, inbox urgency. Requires a new aggregation layer. |
| Nearby Pressure | Derived from: inbox count, knowledge sync status, waiting-on items. Mix of existing APIs. |
| Today's Shape | Derived from: calendar events + task estimates. Reuses calendar data, new timeline rendering. |
| Recovery prompt | New component. Needs session history for "days since last visit" detection. |

**Effort**: New page. Aggregation from existing data sources. No new backend APIs required if client-side composition is acceptable for v1.

### Fleet Chat (`/chat` → prototype: `app/chat/page.tsx`)

| Prototype element | Production source |
|---|---|
| Thread list with filters | `app/page.tsx` left panel + `components/thread/inbox-filters.tsx` |
| Thread detail + timeline | `app/thread/[threadId]/page.tsx` + `components/thread/thread-timeline.tsx` |
| Slash composer | `components/thread/slash-composer.tsx` |
| Context sidebar | `components/thread/entity-sidebar.tsx` |
| Mail review panel | `components/thread/mail-review-panel.tsx` |

**Effort**: **Route move, not rewrite.** The current thread-first home page is structurally what Chat needs. Move it from `/` to `/chat`, adjust the layout to work within the new shell, and update imports.

**Overlap risk**: Both `components/thread/*` (21 files) and `components/threads/*` (5 files) exist. The production follow-up must reconcile these into one thread component family.

### Inbox (`/inbox` → prototype: `app/inbox/page.tsx`)

| Prototype element | Production source |
|---|---|
| Inbox list | `app/inbox/page.tsx` exists but is legacy scaffold (Packet B) |
| Classification chips | New. No current equivalent. |
| Smart Inline triage actions | New. Current inbox is a basic list with links. |

**Effort**: **Significant rewrite.** Current inbox page is a minimal scaffold. The Smart Inline pattern with editable classification is new UX that needs new components.

### Plan (`/plan` → prototype: `app/plan/page.tsx`)

| Prototype element | Production source |
|---|---|
| Fixed Reality column | Derived from: `app/calendar/page.tsx` events + external calendar integration |
| Movable Work column | Derived from: tasks, thread priorities, project deadlines |
| Proposals section | New. No current equivalent. Requires recommendation engine or rule-based suggestion system. |

**Effort**: **New page.** Calendar and task data exist, but the Split Authority / Diff-First UX is entirely new. This is the highest-effort new area.

### Contexts (`/contexts` → prototype: `app/contexts/page.tsx`)

| Prototype element | Production source |
|---|---|
| People column | `app/contacts/page.tsx` + contact data |
| Obligations column | `app/projects/page.tsx` + task data |
| Waiting-ons column | New. Needs waiting-on tracking or derivation from thread/task state. |
| Cross-column connections | New. Requires entity relationship model. |

**Effort**: **New page with significant data modeling.** Contact and project data exist but the blended relationship map is new.

### Ops (`/ops` → prototype: `app/ops/page.tsx`)

| Prototype element | Production source |
|---|---|
| Fleet Health summary | `app/ops/page.tsx`: fleet snapshot, agent list |
| Agent Grid | `components/control-surface/operator-dashboard.tsx` |
| Recent Jobs table | Job monitoring from operator dashboard |
| Quick Actions | Action buttons from operator dashboard |
| Santa panel | `app/ops/page.tsx`: Santa summary section |

**Effort**: **Mostly visual unification.** The Ops functionality exists. The main work is:
1. Replace the zinc color palette with the unified green/gold tokens
2. Ensure Ops renders within the shared app shell instead of using its own layout
3. Keep broker API data fetching pattern intact

**Critical note**: Ops currently uses a separate color palette (`bg-zinc-950 text-zinc-100`) and different border radius conventions. The prototype unifies this. Production follow-up must convert these to shared CSS variables.

### Ops Live (`/ops/live` → prototype: `app/ops/live/page.tsx`)

| Prototype element | Production source |
|---|---|
| Live Feed | `app/ops/live/page.tsx`: `LiveSnapshotView` |
| System Snapshot | New sidebar format, but data exists |
| Santa Incident Workspace | `@fleet/operator-ui`: `SantaIncidentWorkspace` |

**Effort**: **Visual update only.** Same treatment as Ops — unify colors, render within shared shell.

### Calendar (`/calendar` → prototype: `app/calendar/page.tsx`)

| Prototype element | Production source |
|---|---|
| Week grid | `app/calendar/page.tsx`: `CalendarGrid` |
| Queue panel | `app/calendar/page.tsx`: `QueuePanel` |
| Navigation + view toggle | Existing in current calendar page |

**Effort**: **Minimal changes.** Calendar page is already well-built. May need:
1. Minor style updates to match unified token system
2. Queue panel positioned to support Plan area integration

### Projects (`/projects` → prototype: `app/projects/page.tsx`)

| Production source | Change needed |
|---|---|
| `app/projects/page.tsx` | Update context filtering to use new context model instead of workspace switcher |
| `components/projects/project-card.tsx` | Style alignment with unified tokens |

**Effort**: **Minor updates.** Page is structurally sound.

### Knowledge (`/knowledge` → prototype: `app/knowledge/page.tsx`)

| Production source | Change needed |
|---|---|
| `app/knowledge/page.tsx` | Rename from "MCP Console" to "Knowledge" |
| `components/knowledge/*` | Style alignment with unified tokens |

**Effort**: **Minor updates.** Rename + style pass.

## Effort Summary

| Area | Effort Level | Primary Work |
|---|---|---|
| Shell (sidebar, header, context) | **Medium** | Component rewrites for sidebar and context switcher |
| Today | **High** | Entirely new page with data aggregation |
| Chat | **Low** | Route move from `/` to `/chat` |
| Inbox | **High** | Full rewrite of scaffold page |
| Plan | **Very High** | Entirely new page with new interaction patterns |
| Contexts | **High** | New page with entity relationship model |
| Ops | **Medium** | Visual unification, no functionality changes |
| Ops Live | **Low** | Visual unification only |
| Calendar | **Low** | Minor style updates |
| Projects | **Low** | Context model update |
| Knowledge | **Low** | Rename + style pass |

## Component Reuse Potential

### High reuse (move + restyle)
- All thread components → Chat area
- Calendar grid + queue panel → Calendar area
- Project card → Projects area
- Knowledge inspector + tool list → Knowledge area
- Operator dashboard → Ops area

### Partial reuse (extract + adapt)
- Entity sidebar → can be generalized for Contexts area
- Inbox filters → foundation for Inbox triage UI
- Calendar events → input to Today Runway timeline

### New components needed
- Today Runway (greeting, next-up, nearby pressure, timeline, recovery)
- Context Switcher (replaces workspace switcher)
- Smart Inline Inbox item with editable classification
- Plan split view with Fixed/Movable/Proposals
- Contexts relationship map with cross-column connections
- Unified Ops stat cards (replacing zinc-specific cards)

## Desktop Constraints

The prototype was designed with these desktop delivery constraints in mind:

| Constraint | How the prototype handles it |
|---|---|
| Single-window desktop app | Shell uses `h-dvh` full viewport. No multi-window assumptions. |
| ~1280x860 window size | Sidebar collapses at this width. Content areas use responsive breakpoints. |
| No browser-only auth | Login page is self-contained. No external redirect choreography. |
| Local transport failures | Unavailable/retry states designed for Ops and data-dependent areas. |

The compatibility shell at `/Users/fleetadmin/worktrees/mac-control-plane-live-main/control-surface` should be updated to visually echo the canonical design after production implementation, but is NOT the design source for these decisions.
