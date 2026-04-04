# Fleet Ops Console — Screen-by-Screen UX Spec

**Status**: First-pass UX spec
**Date**: 2026-04-03

## Shared Shell

### Sidebar (`app-sidebar`)

| Property | Value |
|---|---|
| Width (expanded) | 256px (16rem) |
| Width (collapsed) | 56px (3.5rem) |
| Background | `bg-card/80 backdrop-blur-xl` |
| Border | `border-r border-border` |
| Logo | Fleet Ops SVG mark + "Fleet Ops" text |
| Context switcher | Below logo. Shows current context dot + label. Dropdown for switching. |
| Nav groups | Core (Today, Chat, Inbox), Work (Plan, Contexts, Calendar, Projects, Knowledge), Ops (Ops, Ops Live), More (secondary, collapsed) |
| Active item | `bg-accent-subtle text-accent` |
| Hover item | `bg-muted/30` |
| Collapse toggle | Bottom, icon-only button, Cmd+B / Ctrl+B |
| Mobile | Overlay with `bg-black/40` backdrop. Slide-in from left. |

### Header (`global-header`)

| Property | Value |
|---|---|
| Height | 48px (3rem) |
| Background | `bg-card/60 backdrop-blur-md` |
| Border | `border-b border-border` |
| Position | Sticky, z-40 |
| Left | Mobile menu toggle (hidden md+) |
| Center | Search trigger: "Search or jump to..." + Cmd+K |
| Right | Context dot + User avatar (initials circle) |

### Login (`/login`)

| Property | Value |
|---|---|
| Layout | Centered card, `min-h-dvh flex items-center justify-center` |
| Background | `bg-background` (no app chrome) |
| Card | `max-w-sm rounded-xl border border-border bg-card/40 p-8` |
| Logo | `h-16 w-16` Fleet Ops mark |
| Title | "Fleet Ops Console" — `text-2xl font-semibold` |
| Primary auth | Google SSO button (full width, accent background) |
| Secondary auth | "Emergency Access" — expandable section with password field |
| Footer | "Secured by Fleet Auth" — muted text |

---

## Today Runway (`/`)

The default landing. Calm, focused, one-screen summary.

### Layout

- Max width: `max-w-3xl`, centered horizontally
- Generous vertical spacing between sections: `space-y-8`
- Padding: `p-6 md:p-10`

### Sections

#### Greeting
- Time-appropriate greeting: "Good morning" / "Good afternoon" / "Good evening"
- Current date: "Thursday, April 3"
- Style: `text-2xl font-semibold` for greeting, `text-sm text-muted-foreground` for date

#### Next Up (single card)
- One highlighted card with the single most important thing
- Left accent border: `border-l-2 border-accent`
- Content: Title, time/countdown, one-line context, primary action button
- Card: `rounded-xl bg-card/30 p-5 border border-border`

#### Nearby Pressure (2-3 compact items)
- Section heading: `text-xs uppercase tracking-widest text-muted-foreground`
- Items as slim rows: icon + text + count/status + link
- No bloated cards — keep it scannable

#### Today's Shape
- Minimal vertical timeline showing the day's structure
- Fixed items: meetings, deadlines (solid left-border, accent)
- Open blocks: available time (dashed left-border, muted)
- Item: time + title + duration estimate

#### Recovery (conditional)
- Only shown after prolonged absence
- Subtle card with: "Welcome back" header, days away, change summary, suggested start point
- Card: `rounded-xl bg-card/30 p-5 border border-border`
- Tone: calm and helpful, never punitive

---

## Fleet Chat (`/chat`)

Thread-first workspace communication.

### Layout

- 3-panel split: left (thread list) + center (detail) + right (context sidebar)
- Left: `w-80` fixed
- Center: `flex-1`
- Right: `w-72`, hidden below xl

### Left Panel — Thread List
- Search input at top
- Filter tabs: "All", "Active", "Needs Action", "By Client"
- Thread items: avatar/icon, title, preview, timestamp, status dot
- Active thread: `bg-accent-subtle` highlight
- Hover: `bg-muted/20`

### Center Panel — Thread Detail
- **Header**: Thread title, participants count, status badge, action buttons (snooze, assign, close)
- **Timeline**: Scrollable list of messages
  - User messages: right-aligned, `bg-accent-subtle rounded-xl`
  - Agent messages: left-aligned, `bg-card rounded-xl`
  - System events: centered, `text-xs text-muted-foreground`
  - Each message: avatar, name, timestamp, content
- **Composer**: Text input, slash command hint, send button
  - Placeholder: "Reply or /command..."
  - Send: accent-colored button

### Right Panel — Context Sidebar
- Sections: Client info, Linked project, Next steps, Attached files
- Each section: heading + compact content
- Heading style: `text-xs uppercase tracking-widest text-muted-foreground`

---

## Inbox (`/inbox`)

Smart Inline pattern — fast, decisive, not bureaucratic.

### Layout

- Single column, `max-w-4xl` centered
- Header: "Inbox" + count badge + filter tabs

### Filter Tabs
- "All", "Needs Triage", "Snoozed", "Done"
- Tab style: underline-active, `border-b-2 border-accent text-accent` when active

### Inbox Items
- Full-width cards: `rounded-xl border border-border bg-card/20 p-4`
- **Classification chip**: `rounded-full px-3 py-1 bg-accent-subtle text-accent text-xs` — shows system's guess (editable)
- **Source indicator**: Small icon/text showing where item came from
- **Preview text**: `text-sm text-foreground`, 2 lines max
- **Action row**: 4 icon buttons
  - Accept (Check icon) — confirm classification, archive
  - Edit (Pencil icon) — opens inline re-classification picker
  - Not Now (Clock icon) — snooze
  - Dismiss (X icon) — remove

### Inline Re-classification
- When "Edit" is clicked, the classification chip becomes an inline dropdown
- Options: predefined categories + "Custom..." option
- No modal, no settings page, no navigation away

---

## Plan (`/plan`)

Split Authority with Diff-First. Fixed vs movable.

### Layout

- 2-column on desktop: `grid grid-cols-1 lg:grid-cols-2 gap-6`
- Below columns: Proposals section
- Max width: `max-w-6xl`

### Left Column — Fixed Reality
- Heading: "Fixed" — `text-xs uppercase tracking-widest`
- Items that cannot move: meetings, hard deadlines, appointments
- Item card: `border-l-2 border-accent rounded-r-lg bg-card/20 p-4`
- Content: time, title, duration, source (calendar/external)
- Visual: solid, grounded feel — these are immovable

### Right Column — Movable Work
- Heading: "Movable" — `text-xs uppercase tracking-widest`
- System-suggested order for flexible tasks
- Item card: `rounded-lg bg-card/30 p-4 border border-border-subtle`
- Content: title, estimated duration badge, context chip
- Actions per item: Accept position, Defer, Edit
- Visual: grab handle dots (⋮⋮) on left — suggests reorderable

### Proposals Section
- Heading: "Proposals" — system suggestions shown as diffs
- Each proposal: `rounded-xl bg-card/20 p-5 border border-border`
  - Proposal text: what the system suggests + one sentence of reasoning
  - Action buttons: Accept (green tint), Reject (muted), Edit (accent)
- Max 3 proposals visible — "See more" if additional

---

## Contexts (`/contexts`)

Blended relationship map. NOT card soup.

### Layout

- 3-column on desktop: `grid grid-cols-1 lg:grid-cols-3 gap-4`
- Full width with padding

### Left Column — People
- Heading: "People"
- Compact rows: name, role/relationship, last interaction, status dot, context chip
- Mix of personal and work contacts
- Hover highlights connected items in other columns

### Center Column — Projects & Obligations
- Heading: "Obligations"
- Grouped by context: work obligations, personal obligations
- Each: title, status, open item count, deadline if applicable
- Context chip: "Personal" (blue bg) or "Work" (gold bg)

### Right Column — Waiting-ons
- Heading: "Waiting on"
- Each: who, what, how long, status
- Overdue items: `text-warning` tint
- Items link to people in left column and obligations in center

### Connection visualization
- When an item is hovered/focused, connected items in other columns get a subtle `ring-2 ring-accent/30` highlight
- This makes the relationship map feel alive

---

## Ops (`/ops`)

Fleet system dashboard. Same visual language as the rest of the workspace.

### Layout

- Max width: `max-w-7xl`, centered
- Sections: Health summary → Agent grid → Recent jobs → Quick actions

### Fleet Health Summary
- 4 compact stat cards in a row: `grid grid-cols-2 md:grid-cols-4 gap-4`
- Each: icon, label, value, status dot
- Card: `rounded-xl bg-card/30 p-4 border border-border`

### Agent Grid
- 2-3 columns: `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4`
- Agent card: name, status badge, last action, uptime
- Status badge colors: success (active), warning (idle), danger (error)

### Recent Jobs Table
- Simple table with subtle row separators: `divide-y divide-border-subtle`
- Columns: Job, Status, Started, Duration
- Status badges: `rounded-full px-2 py-0.5 text-xs`
- Colors: success (completed), warning (running), muted (queued), danger (failed)

### Quick Actions
- Row of buttons: `flex gap-3`
- Each: icon + label, `rounded-lg border border-border bg-card/30 px-4 py-2 hover:bg-accent-subtle`

---

## Ops Live (`/ops/live`)

Real-time event feed.

### Layout

- 2-panel: Feed (left, flex-1) + System Snapshot (right, w-72)

### Live Feed
- Header: "Ops Live" + pulsing green dot + "Live" badge
- Scrollable event list, newest first
- Event row: `font-mono text-xs` timestamp + category icon + message + severity dot
- Severity colors: info (muted), success (green), warning (amber), error (red)
- Feed container: `max-h-[calc(100dvh-var(--header-height)-4rem)] overflow-y-auto`

### System Snapshot
- Compact list of system components with status dots
- Sections: Services, Agents, Knowledge, Tunnels
- Each: name + status dot + brief status text

---

## Calendar (`/calendar`)

Week view by default. Supports Plan, doesn't replace it.

### Layout

- Top bar: navigation + view toggle
- Body: Queue panel (w-48, left) + Calendar grid (flex-1)

### Week Grid
- 7 columns (Mon-Sun), hourly rows (8am-8pm)
- Events as colored blocks: `rounded-lg bg-accent-subtle text-xs p-1`
- Current time marker: horizontal line with dot, `bg-accent`

### Queue Panel
- Unscheduled items that could be placed
- Each: title + estimated duration
- Draggable-looking but no real drag in prototype

---

## Projects (`/projects`)

Project overview.

### Layout

- Max width: `max-w-6xl`
- Header + filter bar + grid

### Project Cards
- `grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4`
- Card: title, client, status badge, progress bar, team avatars, last activity
- Card: `rounded-xl bg-card/30 p-5 border border-border`

---

## Knowledge (`/knowledge`)

Knowledge hub.

### Layout

- Max width: `max-w-5xl`
- Tab bar: "Sources" | "Inspector"

### Sources Tab
- List of knowledge sources
- Each: name, sync status dot, last synced, item count
- Row style: `rounded-lg bg-card/20 p-4 border border-border-subtle`

### Inspector Tab
- Query input + results area
- Simple text input + "Run" button
- Results as formatted text blocks

---

## Unavailable / Retry States

### Broker Offline
- Full-area message: icon + "Couldn't reach the fleet broker" + "Check if the service is running, or try again."
- Retry button: `rounded-lg bg-accent px-4 py-2`

### Partial Failure
- Affected section shows inline warning: warning icon + "This data may be stale" + "Last updated [time]" + Retry link
- Rest of the page remains functional

### Loading
- Skeleton placeholders matching the final layout shape
- Subtle pulse animation on skeleton blocks
- No spinners without context
