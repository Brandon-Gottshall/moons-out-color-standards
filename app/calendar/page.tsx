"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  GripVertical,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CalendarEvent {
  id: string;
  title: string;
  day: number; // 0=Mon ... 6=Sun
  startHour: number; // 8-19
  durationHours: number;
  color: string; // Tailwind bg class
  context: "work" | "personal";
}

interface QueueItem {
  id: string;
  title: string;
  estimate: string;
  context: "work" | "personal";
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DATES = ["Mar 31", "Apr 1", "Apr 2", "Apr 3", "Apr 4", "Apr 5", "Apr 6"];
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8am - 8pm

const EVENTS: CalendarEvent[] = [
  {
    id: "c1",
    title: "Meridian Campaign Sync",
    day: 0,
    startHour: 10,
    durationHours: 1,
    color: "bg-context-work/20 border-context-work/40 text-context-work",
    context: "work",
  },
  {
    id: "c2",
    title: "Deep Work: Fleet v2 Auth",
    day: 1,
    startHour: 9,
    durationHours: 3,
    color: "bg-accent-subtle border-accent/30 text-accent",
    context: "work",
  },
  {
    id: "c3",
    title: "Dr. Lee Appointment",
    day: 2,
    startHour: 14,
    durationHours: 1,
    color: "bg-context-personal/20 border-context-personal/40 text-context-personal",
    context: "personal",
  },
  {
    id: "c4",
    title: "Board Deck Review",
    day: 3,
    startHour: 11,
    durationHours: 1.5,
    color: "bg-context-work/20 border-context-work/40 text-context-work",
    context: "work",
  },
  {
    id: "c5",
    title: "Dinner with Jamie",
    day: 4,
    startHour: 19,
    durationHours: 1,
    color: "bg-context-personal/20 border-context-personal/40 text-context-personal",
    context: "personal",
  },
  {
    id: "c6",
    title: "Tax Filing Block",
    day: 3,
    startHour: 14,
    durationHours: 2,
    color: "bg-warning/15 border-warning/30 text-warning",
    context: "personal",
  },
];

const QUEUE_ITEMS: QueueItem[] = [
  {
    id: "q1",
    title: "Write Q2 newsletter",
    estimate: "~2h",
    context: "work",
  },
  {
    id: "q2",
    title: "Review vendor proposals",
    estimate: "~1h",
    context: "work",
  },
  {
    id: "q3",
    title: "Plan Mom's birthday gift",
    estimate: "~30m",
    context: "personal",
  },
  {
    id: "q4",
    title: "Fleet docs cleanup",
    estimate: "~1.5h",
    context: "work",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function CalendarPage() {
  const [view, setView] = useState<"day" | "week" | "month">("week");

  // Today indicator (Thu = day index 3)
  const todayIndex = 3;

  return (
    <div className="flex h-full animate-fade-in">
      {/* Queue sidebar */}
      <aside className="hidden md:flex w-48 shrink-0 flex-col border-r border-border-subtle bg-card p-3 gap-3">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-accent" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Queue
          </h2>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Unscheduled items to place
        </p>
        <div className="flex flex-col gap-1.5">
          {QUEUE_ITEMS.map((item) => (
            <div
              key={item.id}
              className="group flex items-start gap-2 rounded-md border border-border-subtle bg-card-elevated px-2 py-2 cursor-grab hover:border-border transition-colors"
            >
              <GripVertical
                size={12}
                className="text-muted-foreground/50 mt-0.5 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground leading-snug truncate">
                  {item.title}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-muted-foreground">
                    {item.estimate}
                  </span>
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      item.context === "work"
                        ? "bg-context-work"
                        : "bg-context-personal"
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main calendar area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-border-subtle px-4 py-2.5 bg-card">
          <div className="flex items-center gap-2">
            <button className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-card-elevated transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button className="rounded-md px-2.5 py-1 text-xs font-medium text-accent hover:bg-accent-subtle transition-colors">
              Today
            </button>
            <button className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-card-elevated transition-colors">
              <ChevronRight size={16} />
            </button>
            <span className="text-sm font-medium text-foreground ml-2">
              Mar 31 -- Apr 6, 2026
            </span>
          </div>

          <div className="flex items-center gap-0.5 rounded-lg border border-border-subtle bg-card-elevated p-0.5">
            {(["day", "week", "month"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  view === v
                    ? "bg-accent-subtle text-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Week grid */}
        <div className="flex-1 overflow-auto">
          <div className="min-w-[700px]">
            {/* Day headers */}
            <div className="grid grid-cols-[3rem_repeat(7,1fr)] sticky top-0 z-10 bg-card border-b border-border-subtle">
              <div /> {/* gutter */}
              {DAYS.map((day, i) => (
                <div
                  key={day}
                  className={`px-2 py-2 text-center border-l border-border-subtle/50 ${
                    i === todayIndex ? "" : ""
                  }`}
                >
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {day}
                  </p>
                  <p
                    className={`text-sm font-medium mt-0.5 ${
                      i === todayIndex
                        ? "text-accent"
                        : "text-foreground"
                    }`}
                  >
                    {DATES[i]}
                    {i === todayIndex && (
                      <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />
                    )}
                  </p>
                </div>
              ))}
            </div>

            {/* Time rows */}
            <div className="relative">
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="grid grid-cols-[3rem_repeat(7,1fr)] h-14 border-b border-border-subtle/30"
                >
                  <div className="flex items-start justify-end pr-2 pt-0.5">
                    <span className="text-[10px] text-muted-foreground/60 font-mono tabular-nums">
                      {hour <= 12
                        ? `${hour}${hour === 12 ? "p" : "a"}`
                        : `${hour - 12}p`}
                    </span>
                  </div>
                  {DAYS.map((_, dayIdx) => (
                    <div
                      key={dayIdx}
                      className={`border-l border-border-subtle/30 ${
                        dayIdx === todayIndex
                          ? "bg-accent-subtle/20"
                          : ""
                      }`}
                    />
                  ))}
                </div>
              ))}

              {/* Event blocks (absolutely positioned within the grid) */}
              {EVENTS.map((event) => {
                const top = (event.startHour - 8) * 56; // 56px = h-14
                const height = event.durationHours * 56;
                // Each column: first 3rem is gutter, then 7 equal cols
                // Use percentage for column positioning
                const colWidthPercent = (100 - (3 / 700) * 100) / 7;
                const gutterPercent = (3 / 700) * 100;
                const left = `calc(3rem + ${event.day} * ((100% - 3rem) / 7) + 2px)`;
                const width = `calc((100% - 3rem) / 7 - 4px)`;

                return (
                  <div
                    key={event.id}
                    className={`absolute rounded-md border px-2 py-1 ${event.color} cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg`}
                    style={{
                      top: `${top}px`,
                      height: `${height}px`,
                      left,
                      width,
                    }}
                  >
                    <p className="text-[11px] font-medium truncate leading-tight">
                      {event.title}
                    </p>
                    <p className="text-[10px] opacity-70">
                      {event.startHour <= 12
                        ? `${event.startHour}${event.startHour === 12 ? "pm" : "am"}`
                        : `${event.startHour - 12}pm`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
