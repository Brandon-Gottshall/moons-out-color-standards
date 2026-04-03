# Fleet Ops Console UX Handoff

This repo is a **disposable prototype lane** for UX exploration only.

You are not implementing the canonical product here. You are producing:

- IA/navigation decisions
- screen-by-screen UX specs
- copy/tone rules
- a visually testable prototype
- production mapping notes for Codex to apply later in the real Fleet repo

## Hard Rules

### This repo is disposable

Use this repo to explore the UX safely:

- [`/Users/fleetadmin/worktrees/fleet-ops-workspace-ux-prototype`](/Users/fleetadmin/worktrees/fleet-ops-workspace-ux-prototype)

Do **not** use it as a source of product/backend truth.

### The canonical production repo is read-only reference

Read from:

- [`/Users/Shared/fleet-management-system`](/Users/Shared/fleet-management-system)

Do **not** edit it.

### Do not redesign from the compatibility shell

Do not use the bridge shell as source of truth:

- [`/Users/fleetadmin/worktrees/mac-control-plane-live-main/control-surface`](/Users/fleetadmin/worktrees/mac-control-plane-live-main/control-surface)

That shell exists for parity and delivery glue, not for primary UX authorship.

### Do not do backend or runtime work

Out of scope:

- broker/platform API changes
- route/backend implementation work
- auth-model redesign
- Tauri transport/runtime changes
- bundle identifier cleanup
- bridge-shell-first design

## Product Direction You Must Use

### Visible app identity

- App name: `Fleet Ops Console`
- Do not make `Fleet Management System` the visible primary app label in this pass
- Do not use `OpenClaw` as a visible product/app identity

### Workspace model

Design one coherent workspace shell, not multiple app concepts.

The app should feel closer to:

- Microsoft 365
- Google Workspace
- Proton

than to a loose collection of separate tools.

### Default landing

The default landing model is:

- `Today Runway`

not:

- the current production thread workspace root

### Fleet Chat is first-class

Treat `Fleet Chat` as a top-level workspace area in the first pass.

Do not treat chat as:

- legacy baggage
- a buried route
- a sidebar utility
- a separate app

### Context model

Personal and work are **contexts inside one workspace**, not separate apps.

The shell must support:

- current context visibility
- fast context switching
- related or adjacent context visibility
- cross-context reasoning that still feels explainable and user-controlled

The design must remain useful even if one work identity disappears or changes.

## Current Production Sources To Read

### Shared shell

- [`/Users/Shared/fleet-management-system/apps/web/app/providers.tsx`](/Users/Shared/fleet-management-system/apps/web/app/providers.tsx)
- [`/Users/Shared/fleet-management-system/apps/web/app/layout.tsx`](/Users/Shared/fleet-management-system/apps/web/app/layout.tsx)
- [`/Users/Shared/fleet-management-system/apps/web/app/globals.css`](/Users/Shared/fleet-management-system/apps/web/app/globals.css)
- [`/Users/Shared/fleet-management-system/apps/web/components/sidebar/app-sidebar.tsx`](/Users/Shared/fleet-management-system/apps/web/components/sidebar/app-sidebar.tsx)
- [`/Users/Shared/fleet-management-system/apps/web/components/global-header.tsx`](/Users/Shared/fleet-management-system/apps/web/components/global-header.tsx)
- [`/Users/Shared/fleet-management-system/apps/web/components/sidebar/workspace-switcher.tsx`](/Users/Shared/fleet-management-system/apps/web/components/sidebar/workspace-switcher.tsx)

### Auth

- [`/Users/Shared/fleet-management-system/apps/web/app/(auth)/login/page.tsx`](/Users/Shared/fleet-management-system/apps/web/app/%28auth%29/login/page.tsx)
- [`/Users/Shared/fleet-management-system/apps/web/components/auth/google-sso-button.tsx`](/Users/Shared/fleet-management-system/apps/web/components/auth/google-sso-button.tsx)
- [`/Users/Shared/fleet-management-system/apps/web/components/auth/break-glass-form.tsx`](/Users/Shared/fleet-management-system/apps/web/components/auth/break-glass-form.tsx)

### Thread / chat foundations

- [`/Users/Shared/fleet-management-system/apps/web/app/page.tsx`](/Users/Shared/fleet-management-system/apps/web/app/page.tsx)
- [`/Users/Shared/fleet-management-system/apps/web/app/thread`](/Users/Shared/fleet-management-system/apps/web/app/thread)
- [`/Users/Shared/fleet-management-system/apps/web/components/thread`](/Users/Shared/fleet-management-system/apps/web/components/thread)
- [`/Users/Shared/fleet-management-system/apps/web/components/threads`](/Users/Shared/fleet-management-system/apps/web/components/threads)

### Core areas

- [`/Users/Shared/fleet-management-system/apps/web/app/inbox/page.tsx`](/Users/Shared/fleet-management-system/apps/web/app/inbox/page.tsx)
- [`/Users/Shared/fleet-management-system/apps/web/app/calendar/page.tsx`](/Users/Shared/fleet-management-system/apps/web/app/calendar/page.tsx)
- [`/Users/Shared/fleet-management-system/apps/web/app/projects/page.tsx`](/Users/Shared/fleet-management-system/apps/web/app/projects/page.tsx)
- [`/Users/Shared/fleet-management-system/apps/web/app/knowledge/page.tsx`](/Users/Shared/fleet-management-system/apps/web/app/knowledge/page.tsx)
- [`/Users/Shared/fleet-management-system/apps/web/app/contacts/page.tsx`](/Users/Shared/fleet-management-system/apps/web/app/contacts/page.tsx)

### Ops routes on canonical `origin/main`

- `git show origin/main:apps/web/app/ops/page.tsx`
- `git show origin/main:apps/web/app/ops/live/page.tsx`

Important: the local shared Fleet checkout is stale. The current `/ops` source is on `origin/main`, not the dirty local `main`.

## IA You Must Design

Design one app shell with these first-pass top-level areas:

- `Today`
- `Chat`
- `Inbox`
- `Plan`
- `Contexts`
- `Ops`
- `Calendar`
- `Projects`
- `Knowledge`

Secondary areas can be framed in the shell but visually lighter in the first pass:

- Leads
- Workforce
- Store
- Settings
- Apps
- Automations
- Social
- KPI

### Intended area mapping

- `Today` = the new default landing / runway
- `Chat` = the current thread-first foundation, elevated into a first-class workspace area
- `Inbox` = captured items / triage / editable classification
- `Plan` = fixed commitments vs movable work
- `Contexts` = people, projects, obligations, waiting-ons, and related navigation
- `Ops` = current `/ops` and `/ops/live`

## Personal-Thread UX Rules You Must Inherit

This work must inherit the product direction from thread `019d5191-9800-7d73-b39d-779a8214db06` and the personal prototype.

### Core principles

- `guided autonomy`
- `truth with softened emotional temperature`
- `progressive disclosure`
- `fixed vs movable clarity`
- `blended contexts`
- `humane overload / re-entry`

### Preferred defaults

- `Today`: `Hybrid`
- `Inbox`: `Smart Inline`
- `Plan`: `Split Authority` with `Diff-First` mechanics
- `Contexts`: `Blended`
- `Overload`: `Gentle Reality`

### Required behaviors

- recommendations must be editable
- every key recommendation should imply:
  - accept
  - edit
  - not now
  - dismiss or wrong
  - optionally undo / teach the system
- context can be shown as current + adjacent, not just a hard binary switch
- planning must clearly distinguish:
  - fixed reality
  - system-movable work
- overload must preserve dignity

### Anti-patterns

- no generic productivity-dashboard look
- no card-soup contexts screen
- no calendar-first micromanagement as the main planning model
- no three-step clerical inbox funnel as the default
- no punitive overload language
- no separate personal-vs-work app split

## Required Deliverables

You must produce all of these in this disposable repo:

1. `IA + navigation spec`
2. `screen-by-screen UX spec`
3. `disposable working prototype`
4. `copy/tone contract`
5. `production mapping notes`

## Expected Output Locations

Create these docs as part of the prototype handoff:

- `docs/ux/workspace-ia.md`
- `docs/ux/screen-spec.md`
- `docs/ux/copy-tone-contract.md`
- `docs/ux/source-mapping.md`

Prototype code should live in this repo’s normal surface:

- `app/`
- `components/`
- `public/`

## Workflow Scenarios Your Prototype Must Demonstrate

1. `Landing / Today`
- opens into a calm Today Runway
- shows one clear next action quickly
- shows nearby pressure without dumping everything

2. `Context switching`
- visible current context
- fast switching between personal and work
- still feels like one app

3. `Fleet Chat`
- chat is a first-class area in the shell
- chat uses the same design language as the rest of the workspace

4. `Inbox`
- captured item with editable system guess
- local correction, no settings dive

5. `Plan`
- fixed commitments are distinct from movable work
- proposal review does not require calendar babysitting

6. `Contexts`
- person -> obligation -> next action
- project -> people
- waiting-on -> follow-up

7. `Ops`
- Ops feels like a sibling area
- Ops Live feels related, not isolated

8. `Overload / recovery`
- re-entry feels safe and non-punitive

9. `Desktop-fit`
- works visually in a single-window desktop framing
- does not depend on browser-only auth choreography

## Desktop / Delivery Constraints To Respect

You are not implementing desktop/runtime, but your design must remain compatible with:

- single-window desktop use
- approximately `1280x860` window size
- local transport failure states that may require unavailable/retry shells

Treat those as shell-state constraints, not as the core IA.

## What Success Looks Like

Success means the result feels like one coherent `Fleet Ops Console` workspace where:

- Today leads the experience
- Chat belongs in the core shell
- Ops is part of the same app, not a separate universe
- contexts are visible and useful
- personal/work coexist without split-brain product boundaries
- the design is calm, strong, and non-generic
