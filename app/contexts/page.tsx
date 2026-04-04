"use client";

import { useState, useCallback } from "react";
import {
  Search,
  User,
  FolderKanban,
  Clock,
  Circle,
  Briefcase,
  Heart,
  Layers,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ContextTag = "personal" | "work" | "both";

interface Person {
  id: string;
  name: string;
  org: string;
  status: "active" | "idle" | "away";
  lastInteraction: string;
  note: string;
  context: ContextTag;
  linkedObligations: string[];
  linkedWaitingOns: string[];
}

interface Obligation {
  id: string;
  title: string;
  group: string;
  openItems: number;
  dueNote: string;
  status: "on-track" | "blocked" | "due-soon";
  context: ContextTag;
  linkedPeople: string[];
  linkedWaitingOns: string[];
}

interface WaitingOn {
  id: string;
  from: string;
  description: string;
  daysWaiting: number;
  severity: "normal" | "overdue" | "urgent";
  context: ContextTag;
  linkedPeople: string[];
  linkedObligations: string[];
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const PEOPLE: Person[] = [
  {
    id: "p1",
    name: "Sarah Chen",
    org: "Meridian Studios",
    status: "active",
    lastInteraction: "Yesterday",
    note: "Waiting on contract review",
    context: "work",
    linkedObligations: ["o1"],
    linkedWaitingOns: ["w2"],
  },
  {
    id: "p2",
    name: "Mom",
    org: "Family",
    status: "active",
    lastInteraction: "3 days ago",
    note: "Birthday next week",
    context: "personal",
    linkedObligations: ["o4"],
    linkedWaitingOns: [],
  },
  {
    id: "p3",
    name: "Brandon Wu",
    org: "Vendor Relations",
    status: "idle",
    lastInteraction: "Last Tuesday",
    note: "Invoice follow-up pending",
    context: "work",
    linkedObligations: ["o1"],
    linkedWaitingOns: ["w1"],
  },
  {
    id: "p4",
    name: "Dr. Lee",
    org: "Health",
    status: "away",
    lastInteraction: "2 weeks ago",
    note: "Annual checkup follow-up",
    context: "personal",
    linkedObligations: [],
    linkedWaitingOns: ["w4"],
  },
  {
    id: "p5",
    name: "Kai Nakamura",
    org: "Fleet Core",
    status: "active",
    lastInteraction: "Today",
    note: "Auth migration pair",
    context: "work",
    linkedObligations: ["o3"],
    linkedWaitingOns: [],
  },
  {
    id: "p6",
    name: "Elena Ruiz",
    org: "Legal",
    status: "idle",
    lastInteraction: "4 days ago",
    note: "NDA countersign",
    context: "work",
    linkedObligations: ["o1"],
    linkedWaitingOns: ["w3"],
  },
  {
    id: "p7",
    name: "Jamie",
    org: "Personal",
    status: "active",
    lastInteraction: "Yesterday",
    note: "Dinner plans Saturday",
    context: "personal",
    linkedObligations: [],
    linkedWaitingOns: [],
  },
];

const OBLIGATIONS: Obligation[] = [
  {
    id: "o1",
    title: "Meridian Brand Campaign",
    group: "Client Work",
    openItems: 3,
    dueNote: "Deliverables due Apr 10",
    status: "on-track",
    context: "work",
    linkedPeople: ["p1", "p3", "p6"],
    linkedWaitingOns: ["w1", "w2", "w3"],
  },
  {
    id: "o2",
    title: "Tax Filing Q1",
    group: "Finance",
    openItems: 2,
    dueNote: "Due Apr 15",
    status: "due-soon",
    context: "both",
    linkedPeople: [],
    linkedWaitingOns: [],
  },
  {
    id: "o3",
    title: "Fleet v2 Migration",
    group: "Platform",
    openItems: 5,
    dueNote: "Blocked on auth",
    status: "blocked",
    context: "work",
    linkedPeople: ["p5"],
    linkedWaitingOns: [],
  },
  {
    id: "o4",
    title: "Mom's Birthday Planning",
    group: "Personal",
    openItems: 2,
    dueNote: "Apr 9",
    status: "due-soon",
    context: "personal",
    linkedPeople: ["p2"],
    linkedWaitingOns: [],
  },
  {
    id: "o5",
    title: "Quarterly Board Deck",
    group: "Operations",
    openItems: 1,
    dueNote: "Draft by Apr 12",
    status: "on-track",
    context: "work",
    linkedPeople: [],
    linkedWaitingOns: [],
  },
];

const WAITING_ONS: WaitingOn[] = [
  {
    id: "w1",
    from: "Brandon",
    description: "Invoice from vendor",
    daysWaiting: 5,
    severity: "overdue",
    context: "work",
    linkedPeople: ["p3"],
    linkedObligations: ["o1"],
  },
  {
    id: "w2",
    from: "Sarah",
    description: "Contract review sign-off",
    daysWaiting: 3,
    severity: "normal",
    context: "work",
    linkedPeople: ["p1"],
    linkedObligations: ["o1"],
  },
  {
    id: "w3",
    from: "Legal (Elena)",
    description: "NDA countersign",
    daysWaiting: 4,
    severity: "overdue",
    context: "work",
    linkedPeople: ["p6"],
    linkedObligations: ["o1"],
  },
  {
    id: "w4",
    from: "Dr. Lee",
    description: "Lab results",
    daysWaiting: 12,
    severity: "urgent",
    context: "personal",
    linkedPeople: ["p4"],
    linkedObligations: [],
  },
  {
    id: "w5",
    from: "Accountant",
    description: "Updated P&L statement",
    daysWaiting: 2,
    severity: "normal",
    context: "work",
    linkedPeople: [],
    linkedObligations: ["o2"],
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function ContextChip({ ctx }: { ctx: ContextTag }) {
  if (ctx === "personal")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-context-personal/15 px-2 py-0.5 text-[11px] font-medium text-context-personal">
        <Heart size={10} />
        Personal
      </span>
    );
  if (ctx === "work")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-context-work/15 px-2 py-0.5 text-[11px] font-medium text-context-work">
        <Briefcase size={10} />
        Work
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-context-personal/15 to-context-work/15 px-2 py-0.5 text-[11px] font-medium text-foreground">
      <Layers size={10} />
      Both
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-success",
    idle: "bg-warning",
    away: "bg-muted-foreground",
    "on-track": "bg-success",
    blocked: "bg-danger",
    "due-soon": "bg-warning",
    normal: "bg-muted-foreground",
    overdue: "bg-warning",
    urgent: "bg-danger",
  };
  return (
    <span
      className={`inline-block h-2 w-2 shrink-0 rounded-full ${colors[status] ?? "bg-muted-foreground"}`}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ContextsPage() {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Build the highlight set based on selected item
  const highlighted = new Set<string>();
  if (selectedId) {
    highlighted.add(selectedId);

    const person = PEOPLE.find((p) => p.id === selectedId);
    if (person) {
      person.linkedObligations.forEach((id) => highlighted.add(id));
      person.linkedWaitingOns.forEach((id) => highlighted.add(id));
    }

    const obligation = OBLIGATIONS.find((o) => o.id === selectedId);
    if (obligation) {
      obligation.linkedPeople.forEach((id) => highlighted.add(id));
      obligation.linkedWaitingOns.forEach((id) => highlighted.add(id));
    }

    const waitingOn = WAITING_ONS.find((w) => w.id === selectedId);
    if (waitingOn) {
      waitingOn.linkedPeople.forEach((id) => highlighted.add(id));
      waitingOn.linkedObligations.forEach((id) => highlighted.add(id));
    }
  }

  const isHighlighted = (id: string) =>
    selectedId === null || highlighted.has(id);
  const isSelected = (id: string) => selectedId === id;

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedId((prev) => (prev === id ? null : id));
    },
    [],
  );

  // Filter by search
  const q = search.toLowerCase();
  const filteredPeople = PEOPLE.filter(
    (p) =>
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.org.toLowerCase().includes(q) ||
      p.note.toLowerCase().includes(q),
  );
  const filteredObligations = OBLIGATIONS.filter(
    (o) =>
      !q ||
      o.title.toLowerCase().includes(q) ||
      o.group.toLowerCase().includes(q),
  );
  const filteredWaitingOns = WAITING_ONS.filter(
    (w) =>
      !q ||
      w.from.toLowerCase().includes(q) ||
      w.description.toLowerCase().includes(q),
  );

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6 max-w-[1400px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground tracking-tight">
            Contexts
          </h1>
          <p className="text-sm text-muted-foreground">
            People, projects, and obligations -- connected.
          </p>
        </div>
        {selectedId && (
          <button
            onClick={() => setSelectedId(null)}
            className="self-start rounded-md border border-border-subtle bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground hover:border-border"
          >
            Clear selection
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="text"
          placeholder="Search across all contexts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-border-subtle bg-card pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-accent focus:outline-none"
        />
      </div>

      {/* Three-column relationship map */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* People column */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 px-1 pb-2">
            <User size={14} className="text-accent" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              People
            </span>
            <span className="text-xs text-muted-foreground">
              {filteredPeople.length}
            </span>
          </div>
          <div className="flex flex-col gap-px rounded-lg border border-border-subtle bg-card overflow-hidden">
            {filteredPeople.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelect(p.id)}
                className={`flex items-start gap-3 px-3 py-2.5 text-left transition-all ${
                  isSelected(p.id)
                    ? "bg-accent-subtle ring-1 ring-accent/40"
                    : isHighlighted(p.id)
                      ? "hover:bg-card-elevated"
                      : "opacity-30 hover:opacity-60"
                } ${
                  !isSelected(p.id) &&
                  selectedId !== null &&
                  isHighlighted(p.id) &&
                  !highlighted.has(p.id)
                    ? ""
                    : ""
                } ${
                  selectedId !== null &&
                  isHighlighted(p.id) &&
                  !isSelected(p.id)
                    ? "ring-1 ring-accent/20 bg-accent-subtle/50"
                    : ""
                }`}
              >
                <StatusDot status={p.status} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground truncate">
                      {p.name}
                    </span>
                    <ContextChip ctx={p.context} />
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {p.org}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5 truncate">
                    {p.note} &middot; {p.lastInteraction}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Obligations column */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 px-1 pb-2">
            <FolderKanban size={14} className="text-accent" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Projects / Obligations
            </span>
            <span className="text-xs text-muted-foreground">
              {filteredObligations.length}
            </span>
          </div>
          <div className="flex flex-col gap-px rounded-lg border border-border-subtle bg-card overflow-hidden">
            {filteredObligations.map((o) => (
              <button
                key={o.id}
                onClick={() => handleSelect(o.id)}
                className={`flex items-start gap-3 px-3 py-2.5 text-left transition-all ${
                  isSelected(o.id)
                    ? "bg-accent-subtle ring-1 ring-accent/40"
                    : isHighlighted(o.id)
                      ? "hover:bg-card-elevated"
                      : "opacity-30 hover:opacity-60"
                } ${
                  selectedId !== null &&
                  isHighlighted(o.id) &&
                  !isSelected(o.id)
                    ? "ring-1 ring-accent/20 bg-accent-subtle/50"
                    : ""
                }`}
              >
                <StatusDot status={o.status} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground truncate">
                      {o.title}
                    </span>
                    <ContextChip ctx={o.context} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {o.group} &middot; {o.openItems} open item
                    {o.openItems !== 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">
                    {o.dueNote}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Waiting-ons column */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 px-1 pb-2">
            <Clock size={14} className="text-accent" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Waiting On / Follow-ups
            </span>
            <span className="text-xs text-muted-foreground">
              {filteredWaitingOns.length}
            </span>
          </div>
          <div className="flex flex-col gap-px rounded-lg border border-border-subtle bg-card overflow-hidden">
            {filteredWaitingOns.map((w) => (
              <button
                key={w.id}
                onClick={() => handleSelect(w.id)}
                className={`flex items-start gap-3 px-3 py-2.5 text-left transition-all ${
                  isSelected(w.id)
                    ? "bg-accent-subtle ring-1 ring-accent/40"
                    : isHighlighted(w.id)
                      ? "hover:bg-card-elevated"
                      : "opacity-30 hover:opacity-60"
                } ${
                  selectedId !== null &&
                  isHighlighted(w.id) &&
                  !isSelected(w.id)
                    ? "ring-1 ring-accent/20 bg-accent-subtle/50"
                    : ""
                }`}
              >
                <StatusDot status={w.severity} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground truncate">
                      {w.from}
                    </span>
                    <ContextChip ctx={w.context} />
                  </div>
                  <p className="text-xs text-foreground/80 truncate">
                    {w.description}
                  </p>
                  <p
                    className={`text-xs mt-0.5 ${
                      w.severity === "urgent"
                        ? "text-danger font-medium"
                        : w.severity === "overdue"
                          ? "text-warning"
                          : "text-muted-foreground/70"
                    }`}
                  >
                    {w.daysWaiting} day{w.daysWaiting !== 1 ? "s" : ""} waiting
                    {w.severity === "overdue" && " -- overdue"}
                    {w.severity === "urgent" && " -- needs attention"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
