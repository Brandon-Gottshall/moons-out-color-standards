"use client";

import { useState } from "react";
import {
  Clock,
  ArrowRight,
  AlertCircle,
  Inbox,
  RefreshCw,
  Users,
  FileText,
  Video,
  Calendar,
  Coffee,
  Sun,
  Moon,
  Sunset,
  ChevronRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const MOCK_NEXT_UP = {
  title: "Client call with Meridian Studios",
  subtitle: "Quarterly review — deck is prepped, Brandon joining",
  minutesAway: 45,
  type: "meeting" as const,
  action: "Prepare",
};

const MOCK_PRESSURE = [
  {
    id: "p1",
    icon: Inbox,
    label: "3 inbox items need triage",
    sublabel: "Oldest is 4h — two client requests, one calendar invite",
    urgency: "medium" as const,
  },
  {
    id: "p2",
    icon: RefreshCw,
    label: "Knowledge sync overdue 2h",
    sublabel: "Fleet shared canon drifted from local — 4 files changed",
    urgency: "low" as const,
  },
  {
    id: "p3",
    icon: Users,
    label: "Brandon waiting on deliverable review",
    sublabel: "Sent yesterday at 4:12 PM — brand strategy deck",
    urgency: "high" as const,
  },
];

const MOCK_TIMELINE = [
  { id: "t1", time: "9:00", label: "Morning review", type: "block" as const, duration: 30 },
  { id: "t2", time: "9:30", label: "Open time", type: "open" as const, duration: 60 },
  { id: "t3", time: "10:30", label: "Client call — Meridian Studios", type: "meeting" as const, duration: 60 },
  { id: "t4", time: "11:30", label: "Open time", type: "open" as const, duration: 90 },
  { id: "t5", time: "1:00", label: "Lunch", type: "block" as const, duration: 60 },
  { id: "t6", time: "2:00", label: "Team sync", type: "meeting" as const, duration: 30 },
  { id: "t7", time: "2:30", label: "Open time", type: "open" as const, duration: 120 },
  { id: "t8", time: "4:30", label: "Ship deliverable — Northvane scope", type: "deadline" as const, duration: 0 },
  { id: "t9", time: "5:00", label: "Wrap-up", type: "block" as const, duration: 30 },
];

const MOCK_RECOVERY = {
  show: true,
  daysAway: 3,
  changes: [
    "Brandon finished the Meridian deck and left 2 review comments for you.",
    "Fleet sync picked up 4 new doctrine units from the shared canon.",
    "Northvane sent a revised scope — deadline moved to today 4:30 PM.",
  ],
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getGreeting(): { text: string; Icon: typeof Sun } {
  const hour = new Date().getHours();
  if (hour < 12) return { text: "Good morning", Icon: Sun };
  if (hour < 17) return { text: "Good afternoon", Icon: Sunset };
  return { text: "Good evening", Icon: Moon };
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function urgencyDot(urgency: "low" | "medium" | "high") {
  const colors = {
    low: "bg-info",
    medium: "bg-warning",
    high: "bg-danger",
  };
  return colors[urgency];
}

function timelineTypeStyles(type: string) {
  switch (type) {
    case "meeting":
      return { dot: "bg-accent", bar: "bg-accent/20", label: "text-foreground font-medium" };
    case "deadline":
      return { dot: "bg-danger", bar: "bg-danger/20", label: "text-danger font-medium" };
    case "open":
      return { dot: "bg-border-subtle", bar: "bg-border-subtle", label: "text-muted-foreground italic" };
    default:
      return { dot: "bg-muted-foreground", bar: "bg-muted/30", label: "text-muted-foreground" };
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function TodayRunway() {
  const { text: greeting, Icon: GreetingIcon } = getGreeting();
  const [recoveryDismissed, setRecoveryDismissed] = useState(false);

  return (
    <div className="mx-auto max-w-[800px] px-5 py-8 sm:py-12">
      {/* ---- Greeting ---- */}
      <div className="mb-10">
        <div className="flex items-center gap-2.5 mb-1">
          <GreetingIcon size={18} className="text-accent" />
          <h1 className="text-xl font-semibold text-foreground tracking-tight">
            {greeting}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">{formatDate()}</p>
      </div>

      {/* ---- Recovery prompt (conditional) ---- */}
      {MOCK_RECOVERY.show && !recoveryDismissed && (
        <div className="mb-10 rounded-xl border border-info/30 bg-info/5 p-5">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-info shrink-0" />
              <h2 className="text-sm font-semibold text-foreground">
                Welcome back. You&apos;ve been away {MOCK_RECOVERY.daysAway} days.
              </h2>
            </div>
            <button
              onClick={() => setRecoveryDismissed(true)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              Dismiss
            </button>
          </div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2.5">
            Here&apos;s what changed
          </p>
          <ul className="space-y-1.5">
            {MOCK_RECOVERY.changes.map((change, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-info/60" />
                {change}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ---- Next Up ---- */}
      <section className="mb-10">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Next up
        </h2>
        <div className="rounded-xl border border-border bg-card/30 p-5 border-l-2 border-l-accent">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Video size={15} className="text-accent shrink-0" />
                <h3 className="text-base font-semibold text-foreground truncate">
                  {MOCK_NEXT_UP.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {MOCK_NEXT_UP.subtitle}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-accent">
                <Clock size={12} />
                <span className="font-medium">
                  In {MOCK_NEXT_UP.minutesAway} minutes
                </span>
              </div>
            </div>
            <button className="flex items-center gap-1.5 rounded-lg bg-accent/15 px-3.5 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/25 shrink-0">
              {MOCK_NEXT_UP.action}
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ---- Nearby Pressure ---- */}
      <section className="mb-10">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
          Nearby pressure
        </h2>
        <div className="grid gap-2.5">
          {MOCK_PRESSURE.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group flex items-start gap-3 rounded-xl border border-border bg-card/30 p-4 transition-colors hover:bg-card/50"
              >
                <div className="relative mt-0.5 shrink-0">
                  <Icon size={16} className="text-muted-foreground" />
                  <span
                    className={`absolute -right-0.5 -top-0.5 block h-2 w-2 rounded-full ${urgencyDot(item.urgency)}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.sublabel}</p>
                </div>
                <ChevronRight
                  size={14}
                  className="mt-0.5 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-muted-foreground"
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* ---- Today's Shape ---- */}
      <section className="mb-6">
        <h2 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
          Today&apos;s shape
        </h2>
        <div className="relative pl-8">
          {/* Vertical line */}
          <div className="absolute left-[11px] top-1 bottom-1 w-px bg-border" />

          <div className="space-y-0">
            {MOCK_TIMELINE.map((item, index) => {
              const styles = timelineTypeStyles(item.type);
              return (
                <div key={item.id} className="relative flex items-start gap-4 pb-4 last:pb-0">
                  {/* Dot on the line */}
                  <div
                    className={`absolute left-[-21px] top-[5px] h-2.5 w-2.5 rounded-full border-2 border-background ${styles.dot}`}
                  />
                  {/* Time label */}
                  <span className="w-12 shrink-0 text-xs text-muted-foreground tabular-nums pt-px">
                    {item.time}
                  </span>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm ${styles.label}`}>
                      {item.label}
                    </span>
                    {item.type === "open" && item.duration > 0 && (
                      <span className="ml-2 text-xs text-muted-foreground/60">
                        {item.duration} min open
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
