# Fleet Ops Console — Workspace Information Architecture

**Status**: First-pass UX spec
**Date**: 2026-04-03
**Prototype**: `/Users/fleetadmin/worktrees/fleet-ops-workspace-ux-prototype`

## App Identity

- **Visible app name**: Fleet Ops Console
- **System/platform name**: Fleet Management System (internal, not user-facing in app chrome)
- **Runtime identity**: OpenClaw remains an internal implementation detail only

## Workspace Model

Fleet Ops Console is **one coherent workspace** — not a collection of separate tools. The design follows the workspace-shell pattern used by Microsoft 365, Google Workspace, and Proton: a persistent shell with a left sidebar, global header, and a scrollable content area that changes per area.

Personal and work are **contexts inside the same workspace**, not separate apps. The user can switch contexts or view blended contexts without leaving the app.

## Navigation Hierarchy

### Level 1: Sidebar Areas

The sidebar contains a single nav list organized into 4 groups. All areas are first-class siblings — no area is "the app" while others are secondary.

| Group | Area | Icon | Route | Role |
|---|---|---|---|---|
| **Core** | Today | Sun | `/` | Default landing. Daily runway. |
| | Chat | MessageSquare | `/chat` | Thread-first workspace communication. |
| | Inbox | Inbox | `/inbox` | Captured items awaiting triage. |
| **Work** | Plan | LayoutList | `/plan` | Fixed vs movable work. Daily/weekly planning. |
| | Contexts | Users | `/contexts` | People, projects, obligations, waiting-ons. |
| | Calendar | CalendarDays | `/calendar` | Time-based view. Supports Plan, doesn't replace it. |
| | Projects | FolderKanban | `/projects` | Project-level overview and navigation. |
| | Knowledge | BookOpen | `/knowledge` | Knowledge sources, sync status, inspector. |
| **Ops** | Ops | Activity | `/ops` | Fleet system dashboard. Agent, service, job monitoring. |
| | Ops Live | Radio | `/ops/live` | Real-time event feed and system snapshot. |
| **More** | Leads | UserPlus | `/leads` | Secondary. |
| | Workforce | HardHat | `/workforce` | Secondary. |
| | Store | ShoppingBag | `/store` | Secondary. |
| | Social | Share2 | `/social` | Secondary. |
| | KPI | BarChart3 | `/kpi` | Secondary. |
| | Apps | Grid3x3 | `/apps` | Secondary. |
| | Automations | Zap | `/automations` | Secondary. |
| | Settings | Settings | `/settings` | Secondary. |

### Level 2: In-area navigation

Each area may have internal tabs, panels, or sub-views, but these are contained within the area's content zone and do not affect the sidebar state. Examples:

- Chat: thread list (left panel) + thread detail (center) + context sidebar (right)
- Knowledge: "Sources" tab + "Inspector" tab
- Ops: dashboard + quick actions
- Calendar: day / week / month view toggle

### Level 3: Entity detail

Drilling into a specific entity (thread, project, contact, job) opens a detail view within the area. Back-navigation returns to the area's list/overview state.

## Context Model

### What are contexts?

Contexts represent the lens through which the user views their workspace. The primary contexts are:

- **Personal**: Home, health, family, personal growth, finances
- **Work**: Fleet operations, clients, projects, team coordination
- **Blended**: Cross-context view showing items from both

### How contexts work

1. **Current context is always visible** — shown as a colored dot in the sidebar and header
2. **Switching is fast** — one click in the context switcher, no page reload
3. **Blended is the default recommendation** — the system shows cross-context items when relevant
4. **No separate apps** — personal and work coexist in every area

### Context behavior per area

| Area | Context effect |
|---|---|
| Today | Runway includes items from current context. Blended shows nearby personal items alongside work. |
| Chat | Threads filtered by context. Blended shows all threads with context badges. |
| Inbox | Items filtered by context. Classification guesses include context assignment. |
| Plan | Fixed reality includes all contexts (a personal appointment is still fixed). Movable work filters by context. |
| Contexts | Always blended — this is the cross-context relationship map. |
| Calendar | Shows events from current context. Blended overlays both. |
| Projects | Filtered by context. |
| Knowledge | Not context-filtered — knowledge is shared. |
| Ops | Not context-filtered — ops is system-level. |

## Default Landing

The default landing is **Today Runway** at `/`. It replaces the current thread-first home page.

Today Runway shows:
1. One clear next action (the single most important thing right now)
2. Nearby pressure (2-3 items needing attention soon)
3. Today's shape (fixed commitments vs open time)
4. Recovery prompt (if re-entering after absence)

## Chat as First-Class Area

Fleet Chat is a **top-level workspace area**, not a sidebar utility or legacy route. It uses the same design language, typography, and interaction patterns as every other area.

Chat is where:
- Thread-based conversations happen
- Agent interactions are visible
- Mail review and approval flows live
- Slash commands trigger workspace actions

## Ops as Sibling Area

Ops uses the **same visual language** as the rest of the workspace — same background, cards, typography, and color tokens. It does NOT use a separate zinc/gray palette. This makes Ops feel like it belongs in the workspace rather than being bolted on from a different app.

## Shell Behavior

### Sidebar

- **Expanded**: 16rem (256px). Shows icon + label for each item.
- **Collapsed**: 3.5rem (56px). Shows icon only. Logo becomes icon only.
- **Mobile**: Hidden by default. Opens as overlay with backdrop on hamburger tap.
- **Keyboard**: Cmd+B / Ctrl+B toggles collapse.
- **Persistence**: Collapse state saved to localStorage.

### Header

- **Height**: 3rem (48px)
- **Content**: Mobile menu toggle (left), search/command trigger (center), context indicator + user avatar (right)
- **Behavior**: Sticky, backdrop-blur, minimal. Recedes visually — content is the star.

### Content Area

- Scrollable main zone below the header
- Areas define their own internal layout (single column, multi-panel, grid, etc.)
- Max-width varies by area:
  - Today, Inbox, Login: max-w-3xl centered
  - Chat, Calendar, Contexts: full width with panels
  - Ops, Projects, Knowledge: max-w-7xl centered

## Anti-patterns (do not do)

- No generic productivity-dashboard card grid as the landing
- No card-soup contexts screen
- No calendar-first micromanagement as the primary planning model
- No three-step clerical inbox funnel
- No punitive overload language
- No separate personal-vs-work app split
- No noisy "smart" status clutter
- No bolted-on ops with a different visual language
