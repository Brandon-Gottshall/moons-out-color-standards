"use client";

import { useState } from "react";
import {
  FolderKanban,
  Plus,
  Briefcase,
  Heart,
  Clock,
  Users,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ProjectStatus = "active" | "completed" | "archived" | "on-hold";
type ContextTag = "work" | "personal";

interface Project {
  id: string;
  title: string;
  client: string;
  status: ProjectStatus;
  progress: number; // 0-100
  context: ContextTag;
  team: string[]; // initials
  lastActivity: string;
  description: string;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const PROJECTS: Project[] = [
  {
    id: "pr1",
    title: "Meridian Brand Campaign",
    client: "Meridian Studios",
    status: "active",
    progress: 45,
    context: "work",
    team: ["SC", "BW", "ER"],
    lastActivity: "2 hours ago",
    description: "Full rebrand campaign including digital, print, and social media assets.",
  },
  {
    id: "pr2",
    title: "Fleet v2 Migration",
    client: "Internal",
    status: "active",
    progress: 30,
    context: "work",
    team: ["KN"],
    lastActivity: "Today",
    description: "Platform migration to v2 architecture with new auth system.",
  },
  {
    id: "pr3",
    title: "Q1 Tax Filing",
    client: "Personal",
    status: "active",
    progress: 60,
    context: "personal",
    team: [],
    lastActivity: "Yesterday",
    description: "Quarterly tax preparation and filing for personal and business.",
  },
  {
    id: "pr4",
    title: "Content Pipeline Automation",
    client: "Internal",
    status: "active",
    progress: 75,
    context: "work",
    team: ["CW", "RA"],
    lastActivity: "3 hours ago",
    description: "Automated content generation and review pipeline using fleet agents.",
  },
  {
    id: "pr5",
    title: "Kitchen Renovation",
    client: "Personal",
    status: "on-hold",
    progress: 15,
    context: "personal",
    team: [],
    lastActivity: "2 weeks ago",
    description: "Planning and coordinating kitchen remodel project.",
  },
  {
    id: "pr6",
    title: "Horizon Analytics Dashboard",
    client: "Horizon Inc.",
    status: "completed",
    progress: 100,
    context: "work",
    team: ["SC", "KN"],
    lastActivity: "Last week",
    description: "Custom analytics dashboard for client performance monitoring.",
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const STATUS_STYLES: Record<ProjectStatus, string> = {
  active: "bg-success/15 text-success",
  completed: "bg-info/15 text-info",
  archived: "bg-muted/40 text-muted-foreground",
  "on-hold": "bg-warning/15 text-warning",
};

function StatusBadge({ status }: { status: ProjectStatus }) {
  const label = status === "on-hold" ? "On Hold" : status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[status]}`}
    >
      {label}
    </span>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1 w-full rounded-full bg-border-subtle overflow-hidden">
      <div
        className="h-full rounded-full bg-accent transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function TeamAvatars({ members }: { members: string[] }) {
  if (members.length === 0) return null;
  return (
    <div className="flex -space-x-1.5">
      {members.slice(0, 4).map((initials, i) => (
        <div
          key={i}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-card bg-card-elevated text-[10px] font-medium text-muted-foreground"
        >
          {initials}
        </div>
      ))}
      {members.length > 4 && (
        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-card bg-card-elevated text-[10px] text-muted-foreground">
          +{members.length - 4}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

type FilterMode = "all" | "active" | "completed" | "archived";

export default function ProjectsPage() {
  const [filter, setFilter] = useState<FilterMode>("all");

  const filtered = PROJECTS.filter((p) => {
    if (filter === "all") return true;
    if (filter === "active") return p.status === "active" || p.status === "on-hold";
    return p.status === filter;
  });

  const counts = {
    all: PROJECTS.length,
    active: PROJECTS.filter((p) => p.status === "active" || p.status === "on-hold").length,
    completed: PROJECTS.filter((p) => p.status === "completed").length,
    archived: PROJECTS.filter((p) => p.status === "archived").length,
  };

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 max-w-[1200px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-foreground tracking-tight">
            Projects
          </h1>
          <span className="rounded-full bg-card-elevated px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {PROJECTS.length}
          </span>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent-subtle px-3 py-1.5 text-sm font-medium text-accent transition-colors hover:bg-accent/20 hover:border-accent/50">
          <Plus size={14} />
          New Project
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-1">
        {(["all", "active", "completed", "archived"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f
                ? "bg-accent-subtle text-accent"
                : "text-muted-foreground hover:text-foreground hover:bg-card-elevated"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className="ml-1.5 text-muted-foreground">{counts[f]}</span>
          </button>
        ))}
      </div>

      {/* Project grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((project) => (
          <div
            key={project.id}
            className="flex flex-col gap-3 rounded-lg border border-border-subtle bg-card p-4 transition-colors hover:border-border cursor-pointer"
          >
            {/* Title row */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate">
                  {project.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                  {project.context === "work" ? (
                    <Briefcase size={10} className="text-context-work" />
                  ) : (
                    <Heart size={10} className="text-context-personal" />
                  )}
                  {project.client}
                </p>
              </div>
              <StatusBadge status={project.status} />
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground/80 leading-relaxed line-clamp-2">
              {project.description}
            </p>

            {/* Progress */}
            <div className="flex items-center gap-2">
              <ProgressBar value={project.progress} />
              <span className="text-[11px] font-mono text-muted-foreground tabular-nums shrink-0">
                {project.progress}%
              </span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-1">
              <TeamAvatars members={project.team} />
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground/70">
                <Clock size={10} />
                {project.lastActivity}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
