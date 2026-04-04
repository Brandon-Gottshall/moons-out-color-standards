"use client";

import { useState } from "react";
import {
  Activity,
  Bot,
  Server,
  BookOpen,
  Target,
  RefreshCw,
  Radar,
  GitMerge,
  Circle,
  ChevronRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const FLEET_STATS = [
  {
    label: "Agents",
    value: "12 active",
    icon: Bot,
    status: "healthy" as const,
  },
  {
    label: "Services",
    value: "All healthy",
    icon: Server,
    status: "healthy" as const,
  },
  {
    label: "Knowledge",
    value: "Synced 2h ago",
    icon: BookOpen,
    status: "healthy" as const,
  },
  {
    label: "Mission",
    value: "Running",
    icon: Target,
    status: "healthy" as const,
  },
];

interface Agent {
  name: string;
  role: string;
  status: "active" | "idle" | "error";
  lastAction: string;
  uptime: string;
}

const AGENTS: Agent[] = [
  {
    name: "content-writer",
    role: "Content Generation",
    status: "active",
    lastAction: "Completed blog-draft-q2",
    uptime: "14d 3h",
  },
  {
    name: "research-analyst",
    role: "Deep Research",
    status: "active",
    lastAction: "Processing market-analysis",
    uptime: "14d 3h",
  },
  {
    name: "ops-monitor",
    role: "System Health",
    status: "active",
    lastAction: "Health probe completed",
    uptime: "14d 3h",
  },
  {
    name: "knowledge-sync",
    role: "Knowledge Management",
    status: "idle",
    lastAction: "Sync completed 2h ago",
    uptime: "14d 3h",
  },
  {
    name: "task-router",
    role: "Mission Routing",
    status: "active",
    lastAction: "Routed 3 tasks",
    uptime: "14d 3h",
  },
  {
    name: "santa-guard",
    role: "Security Enforcement",
    status: "error",
    lastAction: "Blocked unknown binary",
    uptime: "6d 12h",
  },
];

interface Job {
  id: string;
  name: string;
  status: "queued" | "running" | "completed" | "failed";
  started: string;
  duration: string;
}

const RECENT_JOBS: Job[] = [
  {
    id: "j1",
    name: "knowledge-sync-shared-git",
    status: "completed",
    started: "14:32",
    duration: "1m 23s",
  },
  {
    id: "j2",
    name: "blog-draft-q2-generation",
    status: "running",
    started: "14:28",
    duration: "4m 12s",
  },
  {
    id: "j3",
    name: "host-converge-services",
    status: "completed",
    started: "14:15",
    duration: "3.2s",
  },
  {
    id: "j4",
    name: "market-analysis-deep-research",
    status: "queued",
    started: "--",
    duration: "--",
  },
  {
    id: "j5",
    name: "santa-incident-review",
    status: "failed",
    started: "13:58",
    duration: "0.8s",
  },
];

const QUICK_ACTIONS = [
  { label: "Sync Knowledge", icon: RefreshCw },
  { label: "Probe Mission", icon: Radar },
  { label: "Converge Host", icon: GitMerge },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    healthy: "bg-success",
    active: "bg-success",
    idle: "bg-warning",
    error: "bg-danger",
    completed: "bg-success",
    running: "bg-warning",
    queued: "bg-muted-foreground",
    failed: "bg-danger",
  };
  return (
    <span
      className={`inline-block h-2 w-2 shrink-0 rounded-full ${colors[status] ?? "bg-muted-foreground"}`}
    />
  );
}

function StatusBadge({ status }: { status: Job["status"] }) {
  const styles: Record<string, string> = {
    completed: "bg-success/15 text-success",
    running: "bg-warning/15 text-warning",
    queued: "bg-muted/40 text-muted-foreground",
    failed: "bg-danger/15 text-danger",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${styles[status]}`}
    >
      <StatusDot status={status} />
      {status}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function OpsPage() {
  const [systemStatus] = useState<"healthy" | "degraded" | "down">("healthy");
  const statusColor =
    systemStatus === "healthy"
      ? "bg-success"
      : systemStatus === "degraded"
        ? "bg-warning"
        : "bg-danger";

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-[1200px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-foreground tracking-tight">
            Fleet Ops
          </h1>
          <span className={`h-2 w-2 rounded-full ${statusColor}`} />
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          Updated 14:35:02
        </span>
      </div>

      {/* Fleet Health summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {FLEET_STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-lg border border-border-subtle bg-card px-3 py-2.5"
            >
              <Icon size={16} className="text-accent shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-sm font-medium text-foreground truncate">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Agent Grid */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Bot size={14} className="text-accent" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Agents
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {AGENTS.map((agent) => (
            <div
              key={agent.name}
              className="flex flex-col gap-2 rounded-lg border border-border-subtle bg-card px-3 py-3 transition-colors hover:border-border"
            >
              <div className="flex items-center gap-2">
                <StatusDot status={agent.status} />
                <span className="text-sm font-medium text-foreground font-mono">
                  {agent.name}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{agent.role}</p>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground/70">
                <span className="truncate">{agent.lastAction}</span>
                <span className="shrink-0 ml-2">{agent.uptime}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Jobs */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Activity size={14} className="text-accent" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Recent Jobs
          </h2>
        </div>
        <div className="rounded-lg border border-border-subtle bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Job
                  </th>
                  <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Started
                  </th>
                  <th className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody>
                {RECENT_JOBS.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b border-border-subtle/50 last:border-0 hover:bg-card-elevated/50 transition-colors"
                  >
                    <td className="px-3 py-2 font-mono text-xs text-foreground">
                      {job.name}
                    </td>
                    <td className="px-3 py-2">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                      {job.started}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                      {job.duration}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <ChevronRight size={14} className="text-accent" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Quick Actions
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                className="inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent hover:bg-accent-subtle"
              >
                <Icon size={14} className="text-accent" />
                {action.label}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
