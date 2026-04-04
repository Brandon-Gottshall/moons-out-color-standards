"use client";

import { useState } from "react";
import {
  Lock,
  GripVertical,
  Check,
  X,
  Pencil,
  ArrowRight,
  Clock,
  Video,
  CalendarClock,
  AlertTriangle,
  Lightbulb,
  ChevronRight,
  Timer,
  Target,
  LayoutList,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

interface FixedItem {
  id: string;
  time: string;
  title: string;
  type: "meeting" | "deadline" | "appointment";
  duration: string;
  note?: string;
}

const MOCK_FIXED: FixedItem[] = [
  {
    id: "f1",
    time: "10:30 AM",
    title: "Client call — Meridian Studios QBR",
    type: "meeting",
    duration: "60 min",
    note: "Brandon joining. Deck prepped.",
  },
  {
    id: "f2",
    time: "2:00 PM",
    title: "Team sync",
    type: "meeting",
    duration: "30 min",
    note: "Standing weekly. Agenda auto-generated.",
  },
  {
    id: "f3",
    time: "4:30 PM",
    title: "Ship deliverable — Northvane scope",
    type: "deadline",
    duration: "Hard deadline",
    note: "Revised scope received this morning. Final review needed.",
  },
  {
    id: "f4",
    time: "5:30 PM",
    title: "Dentist appointment",
    type: "appointment",
    duration: "45 min",
    note: "Downtown office. Leave by 5:00.",
  },
];

type MovableStatus = "pending" | "accepted" | "deferred";

interface MovableItem {
  id: string;
  title: string;
  estimate: string;
  context: string;
  status: MovableStatus;
  suggestedSlot?: string;
}

const MOCK_MOVABLE: MovableItem[] = [
  {
    id: "m1",
    title: "Review Brandon's brand strategy deck",
    estimate: "25 min",
    context: "Waiting 18h. High priority.",
    status: "pending",
    suggestedSlot: "9:30 AM",
  },
  {
    id: "m2",
    title: "Triage inbox items",
    estimate: "15 min",
    context: "3 items pending. Two client requests.",
    status: "pending",
    suggestedSlot: "9:00 AM",
  },
  {
    id: "m3",
    title: "Prepare Northvane scope response",
    estimate: "40 min",
    context: "New scope received. Deadline at 4:30 PM.",
    status: "pending",
    suggestedSlot: "11:30 AM",
  },
  {
    id: "m4",
    title: "Fleet knowledge sync",
    estimate: "10 min",
    context: "4 doctrine files drifted. Quick sync.",
    status: "pending",
    suggestedSlot: "After team sync",
  },
  {
    id: "m5",
    title: "Draft recruiting brief — Senior Designer",
    estimate: "30 min",
    context: "Second interview Thursday. Needs prep.",
    status: "pending",
    suggestedSlot: "3:00 PM",
  },
];

interface Proposal {
  id: string;
  action: string;
  reason: string;
  status: "pending" | "accepted" | "rejected";
}

const MOCK_PROPOSALS: Proposal[] = [
  {
    id: "pr1",
    action: "Move 'Draft recruiting brief' to tomorrow",
    reason:
      "You have 4h 15m of work queued against 3h 30m of open time today. The recruiting brief has the softest deadline — Thursday interview prep can wait until tomorrow morning.",
    status: "pending",
  },
  {
    id: "pr2",
    action: "Schedule 'Prepare Northvane scope response' at 11:30 AM",
    reason:
      "This gives you a focused 40-minute block after the Meridian call and before lunch. The 4:30 PM deadline needs this done by early afternoon to allow for review.",
    status: "pending",
  },
  {
    id: "pr3",
    action: "Do 'Review Brandon's deck' first thing at 9:30 AM",
    reason:
      "Brandon has been waiting 18 hours. A quick 25-minute review before the Meridian call clears the blocker and lets him iterate before end of day.",
    status: "pending",
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function fixedTypeIcon(type: FixedItem["type"]) {
  switch (type) {
    case "meeting":
      return <Video size={14} className="text-accent" />;
    case "deadline":
      return <AlertTriangle size={14} className="text-danger" />;
    case "appointment":
      return <CalendarClock size={14} className="text-info" />;
  }
}

function fixedTypeBorder(type: FixedItem["type"]) {
  switch (type) {
    case "meeting":
      return "border-l-accent";
    case "deadline":
      return "border-l-danger";
    case "appointment":
      return "border-l-info";
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function PlanPage() {
  const [movableItems, setMovableItems] = useState(MOCK_MOVABLE);
  const [proposals, setProposals] = useState(MOCK_PROPOSALS);

  function handleMovableAction(id: string, action: MovableStatus) {
    setMovableItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: action } : item))
    );
  }

  function handleProposalAction(id: string, action: "accepted" | "rejected") {
    setProposals((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: action } : p))
    );
  }

  const totalEstimate = movableItems
    .filter((m) => m.status !== "deferred")
    .reduce((sum, m) => sum + parseInt(m.estimate), 0);

  const openMinutes = 210; // 3h 30m of open time (mock)

  return (
    <div className="mx-auto max-w-[1080px] px-5 py-8 sm:py-10">
      {/* ---- Header ---- */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <LayoutList size={20} className="text-accent" />
          <h1 className="text-xl font-semibold text-foreground tracking-tight">
            Plan
          </h1>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Timer size={12} />
            <span>
              {totalEstimate} min queued / {openMinutes} min open
            </span>
          </div>
          {totalEstimate > openMinutes && (
            <span className="flex items-center gap-1 text-warning">
              <AlertTriangle size={11} />
              Overloaded
            </span>
          )}
        </div>
      </div>

      {/* ---- Two-column layout ---- */}
      <div className="grid gap-6 lg:grid-cols-2 mb-10">
        {/* ============================================================ */}
        {/*  LEFT: Fixed Reality                                          */}
        {/* ============================================================ */}
        <div>
          <h2 className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3">
            <Lock size={11} />
            Fixed reality
          </h2>
          <div className="space-y-2.5">
            {MOCK_FIXED.map((item) => (
              <div
                key={item.id}
                className={`rounded-xl border border-border bg-card/30 p-4 border-l-2 ${fixedTypeBorder(item.type)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">{fixedTypeIcon(item.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <h3 className="text-sm font-medium text-foreground truncate">
                        {item.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <span className="font-medium text-foreground/70">{item.time}</span>
                      <span className="text-muted-foreground/40">|</span>
                      <span>{item.duration}</span>
                    </div>
                    {item.note && (
                      <p className="text-xs text-muted-foreground">{item.note}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/*  RIGHT: Movable Work                                          */}
        {/* ============================================================ */}
        <div>
          <h2 className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-3">
            <Target size={11} />
            Movable work
          </h2>
          <div className="space-y-2.5">
            {movableItems.map((item) => (
              <div
                key={item.id}
                className={`rounded-xl border bg-card/30 p-4 transition-all ${
                  item.status === "accepted"
                    ? "border-success/40 bg-success/5"
                    : item.status === "deferred"
                      ? "border-border-subtle/50 opacity-50"
                      : "border-border"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Drag handle (visual only) */}
                  <div className="mt-1 shrink-0 cursor-grab text-muted-foreground/30">
                    <GripVertical size={14} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3
                        className={`text-sm font-medium ${
                          item.status === "deferred"
                            ? "text-muted-foreground line-through"
                            : "text-foreground"
                        }`}
                      >
                        {item.title}
                      </h3>
                      <span className="shrink-0 rounded-md bg-muted/30 px-2 py-0.5 text-[11px] font-medium text-muted-foreground tabular-nums">
                        {item.estimate}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{item.context}</p>
                    {item.suggestedSlot && item.status === "pending" && (
                      <p className="text-[11px] text-accent/70 mb-2">
                        Suggested: {item.suggestedSlot}
                      </p>
                    )}

                    {/* Actions */}
                    {item.status === "pending" && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMovableAction(item.id, "accepted")}
                          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-success/15 hover:text-success"
                        >
                          <Check size={12} />
                          Accept
                        </button>
                        <button
                          onClick={() => handleMovableAction(item.id, "deferred")}
                          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-warning/15 hover:text-warning"
                        >
                          <ArrowRight size={12} />
                          Defer
                        </button>
                        <button className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent-subtle hover:text-accent">
                          <Pencil size={11} />
                          Edit
                        </button>
                      </div>
                    )}

                    {item.status === "accepted" && (
                      <span className="inline-flex items-center gap-1 text-xs text-success">
                        <Check size={11} />
                        Accepted
                      </span>
                    )}

                    {item.status === "deferred" && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <ArrowRight size={11} />
                        Deferred
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/*  PROPOSALS — System Recommendations                             */}
      {/* ============================================================== */}
      <section>
        <h2 className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-4">
          <Lightbulb size={12} />
          Proposals
        </h2>
        <div className="space-y-3">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className={`rounded-xl border p-5 transition-all ${
                proposal.status === "accepted"
                  ? "border-success/30 bg-success/5"
                  : proposal.status === "rejected"
                    ? "border-border-subtle/50 bg-card/10 opacity-50"
                    : "border-border bg-card-elevated/30"
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Diff-like indicator */}
                <div className="mt-0.5 shrink-0">
                  {proposal.status === "accepted" ? (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/20">
                      <Check size={12} className="text-success" />
                    </div>
                  ) : proposal.status === "rejected" ? (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-danger/20">
                      <X size={12} className="text-danger" />
                    </div>
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/15">
                      <ChevronRight size={12} className="text-accent" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground mb-1">
                    {proposal.action}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                    {proposal.reason}
                  </p>

                  {proposal.status === "pending" && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleProposalAction(proposal.id, "accepted")}
                        className="flex items-center gap-1.5 rounded-lg bg-success/10 px-3 py-1.5 text-xs font-medium text-success transition-colors hover:bg-success/20"
                      >
                        <Check size={12} />
                        Accept
                      </button>
                      <button
                        onClick={() => handleProposalAction(proposal.id, "rejected")}
                        className="flex items-center gap-1.5 rounded-lg bg-danger/10 px-3 py-1.5 text-xs font-medium text-danger transition-colors hover:bg-danger/20"
                      >
                        <X size={12} />
                        Reject
                      </button>
                      <button className="flex items-center gap-1.5 rounded-lg bg-muted/20 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground">
                        <Pencil size={11} />
                        Edit
                      </button>
                    </div>
                  )}

                  {proposal.status === "accepted" && (
                    <span className="inline-flex items-center gap-1 text-xs text-success font-medium">
                      <Check size={11} />
                      Applied
                    </span>
                  )}

                  {proposal.status === "rejected" && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <X size={11} />
                      Dismissed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
