"use client";

import { useState } from "react";
import {
  Radio,
  Bot,
  BookOpen,
  Radar,
  Server,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Info,
  Circle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Severity = "info" | "success" | "warning" | "error";
type Category = "agent" | "knowledge" | "mission" | "host" | "security";

interface LiveEvent {
  id: string;
  timestamp: string;
  category: Category;
  message: string;
  severity: Severity;
}

interface ServiceStatus {
  name: string;
  status: "healthy" | "degraded" | "down";
  latency?: string;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const EVENTS: LiveEvent[] = [
  {
    id: "e1",
    timestamp: "14:35:02",
    category: "agent",
    message:
      "Agent 'content-writer' completed task 'blog-draft-q2' -- 2,400 words generated",
    severity: "success",
  },
  {
    id: "e2",
    timestamp: "14:34:48",
    category: "knowledge",
    message: "Knowledge sync triggered for shared-knowledge-git",
    severity: "info",
  },
  {
    id: "e3",
    timestamp: "14:33:15",
    category: "mission",
    message: "Mission manager probe completed -- all healthy",
    severity: "success",
  },
  {
    id: "e4",
    timestamp: "14:31:07",
    category: "host",
    message: "Host action 'converge-services' completed (3.2s)",
    severity: "success",
  },
  {
    id: "e5",
    timestamp: "14:28:44",
    category: "security",
    message: "Santa: incident 'unknown-binary' resolved -- allowed after review",
    severity: "warning",
  },
  {
    id: "e6",
    timestamp: "14:25:33",
    category: "agent",
    message: "Agent 'research-analyst' started task 'market-analysis'",
    severity: "info",
  },
  {
    id: "e7",
    timestamp: "14:22:19",
    category: "knowledge",
    message: "Knowledge sync completed -- 14 documents updated, 2 new",
    severity: "success",
  },
  {
    id: "e8",
    timestamp: "14:18:01",
    category: "security",
    message:
      "Santa: LuLu rule updated -- allow outbound for fleet-sync on port 443",
    severity: "info",
  },
  {
    id: "e9",
    timestamp: "14:15:42",
    category: "agent",
    message: "Agent 'task-router' routed 3 tasks to available agents",
    severity: "info",
  },
  {
    id: "e10",
    timestamp: "14:12:08",
    category: "host",
    message: "Disk usage at 72% on /Users volume -- within threshold",
    severity: "info",
  },
  {
    id: "e11",
    timestamp: "14:08:55",
    category: "security",
    message:
      "Santa: blocked unsigned binary '/tmp/.cache/exec' -- quarantined",
    severity: "error",
  },
  {
    id: "e12",
    timestamp: "14:05:30",
    category: "mission",
    message: "Mission 'q2-content-pipeline' advanced to stage 3 of 5",
    severity: "success",
  },
];

const SERVICES: ServiceStatus[] = [
  { name: "Mission Manager", status: "healthy", latency: "12ms" },
  { name: "Knowledge Sync", status: "healthy", latency: "45ms" },
  { name: "Agent Router", status: "healthy", latency: "8ms" },
  { name: "Santa Guard", status: "healthy", latency: "3ms" },
  { name: "Host Monitor", status: "healthy", latency: "22ms" },
  { name: "Chat Broker", status: "healthy", latency: "18ms" },
  { name: "Doc Renderer", status: "degraded", latency: "340ms" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const CATEGORY_ICONS: Record<Category, typeof Bot> = {
  agent: Bot,
  knowledge: BookOpen,
  mission: Radar,
  host: Server,
  security: Shield,
};

const SEVERITY_DOT: Record<Severity, string> = {
  info: "bg-muted-foreground",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-danger",
};

const SERVICE_STATUS_COLORS: Record<string, string> = {
  healthy: "bg-success",
  degraded: "bg-warning",
  down: "bg-danger",
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function OpsLivePage() {
  const [filter, setFilter] = useState<Severity | "all">("all");

  const filteredEvents =
    filter === "all" ? EVENTS : EVENTS.filter((e) => e.severity === filter);

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6 max-w-[1400px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-foreground tracking-tight">
          Ops Live
        </h1>
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
        </span>
        <span className="rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success uppercase tracking-wider">
          Live
        </span>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Main feed */}
        <div className="flex-1 min-w-0">
          {/* Filter tabs */}
          <div className="flex items-center gap-1 mb-3">
            {(["all", "info", "success", "warning", "error"] as const).map(
              (sev) => (
                <button
                  key={sev}
                  onClick={() => setFilter(sev)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    filter === sev
                      ? "bg-accent-subtle text-accent"
                      : "text-muted-foreground hover:text-foreground hover:bg-card-elevated"
                  }`}
                >
                  {sev === "all" ? "All" : sev.charAt(0).toUpperCase() + sev.slice(1)}
                </button>
              ),
            )}
          </div>

          {/* Events */}
          <div className="flex flex-col rounded-lg border border-border-subtle bg-card overflow-hidden">
            {filteredEvents.map((event) => {
              const CatIcon = CATEGORY_ICONS[event.category];
              return (
                <div
                  key={event.id}
                  className="flex items-start gap-3 border-b border-border-subtle/50 last:border-0 px-3 py-2.5 hover:bg-card-elevated/50 transition-colors"
                >
                  <span className="font-mono text-[11px] text-muted-foreground shrink-0 pt-0.5 w-16 text-right tabular-nums">
                    {event.timestamp}
                  </span>
                  <CatIcon
                    size={14}
                    className="text-muted-foreground shrink-0 mt-0.5"
                  />
                  <span
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${SEVERITY_DOT[event.severity]}`}
                  />
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    {event.message}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* System Snapshot sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <Server size={14} className="text-accent" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              System Snapshot
            </h2>
          </div>
          <div className="rounded-lg border border-border-subtle bg-card overflow-hidden">
            {SERVICES.map((svc) => (
              <div
                key={svc.name}
                className="flex items-center gap-2.5 border-b border-border-subtle/50 last:border-0 px-3 py-2"
              >
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${SERVICE_STATUS_COLORS[svc.status]}`}
                />
                <span className="flex-1 text-xs text-foreground truncate">
                  {svc.name}
                </span>
                {svc.latency && (
                  <span className="text-[11px] font-mono text-muted-foreground tabular-nums">
                    {svc.latency}
                  </span>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
