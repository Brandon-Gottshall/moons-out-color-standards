# Fleet Ops Console — Copy & Tone Contract

**Status**: First-pass UX spec
**Date**: 2026-04-03

## Voice

Fleet Ops Console speaks like a **calm, competent colleague** — someone who's been doing this work for years, respects your time, and never talks down to you.

### Personality attributes

- **Observant**: Notices what matters. Doesn't dump everything at you.
- **Competent**: Knows the domain. Doesn't explain basics unless asked.
- **Warm but not performative**: Supportive without being chirpy or over-enthusiastic.
- **Honest without editorializing**: States reality. Doesn't soften hard truths into meaninglessness, and doesn't add unnecessary alarm.

### The voice is NOT

- Parental ("You should really...")
- Corporate HR ("Per our alignment on...")
- Productivity-coach ("Crush your goals today!")
- Anxious ("Alert! Warning! Action required immediately!")
- Passive-aggressive ("Just a friendly reminder...")

## Naming Conventions

### App and product

| Term | Usage |
|---|---|
| Fleet Ops Console | The app name. Used in title bar, login, about screen. |
| Fleet | Acceptable short form in conversation and UI labels. |
| Fleet Management System | System-of-record term only. Not in user-facing app chrome. |
| OpenClaw | Never visible to users. Internal runtime detail only. |

### Areas

Use the exact area names from the IA spec. No abbreviations in labels.

| Area name | Acceptable | Not acceptable |
|---|---|---|
| Today | "Today" | "Dashboard", "Home", "Overview" |
| Chat | "Chat", "Fleet Chat" | "Threads", "Messages", "Comms" |
| Inbox | "Inbox" | "Queue", "Triage", "Action Items" |
| Plan | "Plan" | "Planner", "Schedule", "To-Do" |
| Contexts | "Contexts" | "CRM", "Contacts & Projects", "Relationships" |
| Ops | "Ops" | "Admin", "Control Panel", "System" |
| Ops Live | "Ops Live" | "Live Feed", "Logs", "Monitoring" |

### Status language

| State | Copy | Not |
|---|---|---|
| Everything working | "All systems healthy" | "No issues found!" |
| Partial degradation | "Knowledge sync running behind" | "WARNING: Sync delayed" |
| Something failed | "Agent 'content-writer' stopped unexpectedly" | "CRITICAL ERROR!" |
| Overloaded day | "Today's full. Here's what could move." | "You're overbooked!" |
| Coming back after absence | "Welcome back. Here's what changed." | "You missed 47 notifications!" |

## Interaction Copy

### Recommendations

Every recommendation the system makes should imply 4-5 possible responses. The copy should make the user feel in control, not managed.

**Pattern**:
> [System observation]. [Proposed action]. [One calm sentence of reasoning].

**Example**:
> "You have 4 hours of meetings and 6 hours of planned work today. Move 'Brand deck review' to tomorrow — it has the most flexible deadline."

**Action labels**:
- **Accept** — Do the proposed thing. Label: "Accept" or "Sounds good"
- **Edit** — Modify the proposal. Label: "Edit" or "Adjust"
- **Not now** — Defer without dismissing. Label: "Not now" or "Later"
- **Dismiss** — This isn't relevant. Label: "Dismiss" or "Not relevant"
- **Undo / Teach** — Reverse a decision and optionally explain why. Label: "Undo" (then optional "This was wrong because...")

### Empty states

Empty states should feel like calm readiness, not failure.

| Context | Copy |
|---|---|
| Empty inbox | "Inbox is clear. Nice." |
| No upcoming items | "Nothing scheduled. Open time ahead." |
| No search results | "Nothing matching that. Try different terms?" |
| New area, no data | "This area will fill in as you work. No setup needed." |

### Error states

Errors should be honest and actionable, never alarming or vague.

**Pattern**:
> [What happened]. [What you can do].

**Examples**:
- "Couldn't reach the broker. Check if the service is running, or try again."
- "Knowledge sync failed — source repo may be unreachable. Retry?"
- "This action requires operator access you don't have. Contact your admin."

### Loading states

- Brief: Show nothing special for <200ms
- Short: Subtle skeleton or pulse animation for 200ms-2s
- Long: "Loading [thing]..." with optional progress indicator after 2s
- Never: Spinner without context. Users should always know what's loading.

## Overload & Recovery

### Overload language

When the user has too much to do, the system acknowledges reality without judgment.

**Do**:
- "Today's full. Here's what could move."
- "3 items are overdue. Start with the one that unblocks others?"
- "You've been heads-down for 4 hours. Good time for a break?"

**Don't**:
- "You're behind on 12 tasks!"
- "Warning: Productivity declining"
- "You need to prioritize better"

### Recovery language

When the user returns after absence, recovery should feel safe and non-punitive.

**Pattern**:
> "Welcome back. [Time away]. [Count of changes]. [One suggested starting point]."

**Example**:
> "Welcome back. You've been away 3 days. 12 new items arrived, 2 are time-sensitive. Start with the Meridian contract review?"

### Context-switching language

When showing items across contexts, be clear about which context an item belongs to without making it feel like an intrusion.

**Do**:
- "Personal: Mom's birthday is next week"
- "Work: Meridian deliverable review due tomorrow"
- "Blended: Your 3pm is personal, but there's a work call at 4"

**Don't**:
- "PERSONAL ALERT"
- "Switching to work mode..."
- "This item is from your personal life"

## Typography Patterns

### Headings

- Section headings: `text-xs uppercase tracking-widest text-muted-foreground font-medium`
- Page titles: `text-2xl font-semibold text-foreground`
- Card titles: `text-sm font-medium text-foreground`

### Body text

- Primary: `text-sm text-foreground`
- Secondary: `text-sm text-muted-foreground`
- Timestamps: `text-xs text-muted-foreground font-mono`

### Status indicators

- Inline dot: `w-2 h-2 rounded-full` with semantic color
- Badge: `rounded-full px-2 py-0.5 text-xs font-medium`
- Chip: `rounded-full px-3 py-1 text-xs` with subtle background

## Capitalization

- Sentence case for everything except proper nouns and the app name
- Area names are proper nouns in navigation: "Today", "Chat", "Plan"
- Status badges: lowercase ("running", "completed", "overdue")
- Buttons: Sentence case ("Accept", "Not now", "Try again")
