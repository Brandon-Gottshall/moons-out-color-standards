"use client";

import { useState } from "react";
import {
  BookOpen,
  RefreshCw,
  Search,
  Database,
  FileText,
  FolderGit2,
  StickyNote,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Circle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type SyncStatus = "synced" | "syncing" | "stale" | "offline";

interface KnowledgeSource {
  id: string;
  name: string;
  description: string;
  icon: typeof BookOpen;
  syncStatus: SyncStatus;
  lastSynced: string;
  itemCount: number;
  size: string;
}

interface InspectorResult {
  id: string;
  source: string;
  title: string;
  snippet: string;
  relevance: number;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const SOURCES: KnowledgeSource[] = [
  {
    id: "s1",
    name: "Shared Knowledge Git",
    description: "Canonical fleet docs, operations logs, changelogs",
    icon: FolderGit2,
    syncStatus: "synced",
    lastSynced: "2 hours ago",
    itemCount: 342,
    size: "48 MB",
  },
  {
    id: "s2",
    name: "Fleet Docs",
    description: "Agent contracts, architecture specs, API docs",
    icon: BookOpen,
    syncStatus: "synced",
    lastSynced: "4 hours ago",
    itemCount: 128,
    size: "22 MB",
  },
  {
    id: "s3",
    name: "Client Contracts",
    description: "Active agreements, NDAs, SOWs, invoices",
    icon: FileText,
    syncStatus: "stale",
    lastSynced: "3 days ago",
    itemCount: 67,
    size: "156 MB",
  },
  {
    id: "s4",
    name: "Personal Notes",
    description: "Private notes, journal entries, ideas",
    icon: StickyNote,
    syncStatus: "synced",
    lastSynced: "30 minutes ago",
    itemCount: 215,
    size: "12 MB",
  },
];

const MOCK_RESULTS: InspectorResult[] = [
  {
    id: "r1",
    source: "Shared Knowledge Git",
    title: "Dark Factory Merge Autonomy Policy",
    snippet:
      "For normal dark-factory implementation work, do not treat the operator as the PR-stage gate once intent and major questions were handled up front...",
    relevance: 95,
  },
  {
    id: "r2",
    source: "Fleet Docs",
    title: "Mission Manager Architecture",
    snippet:
      "The mission manager orchestrates long-running workflows by decomposing them into agent-routable tasks with dependency tracking...",
    relevance: 82,
  },
  {
    id: "r3",
    source: "Shared Knowledge Git",
    title: "One-Shot Drift Reconciliation Prompt",
    snippet:
      "Use this workflow when a thread, plan, or workstream is stale, drifted, or authority-unclear. Do not use it as the default for routine tasks...",
    relevance: 71,
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const SYNC_STYLES: Record<SyncStatus, { dot: string; label: string; labelClass: string }> = {
  synced: { dot: "bg-success", label: "Synced", labelClass: "text-success" },
  syncing: { dot: "bg-info", label: "Syncing", labelClass: "text-info" },
  stale: { dot: "bg-warning", label: "Stale", labelClass: "text-warning" },
  offline: { dot: "bg-danger", label: "Offline", labelClass: "text-danger" },
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function KnowledgePage() {
  const [activeTab, setActiveTab] = useState<"sources" | "inspector">("sources");
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const overallStatus: SyncStatus = SOURCES.some((s) => s.syncStatus === "offline")
    ? "offline"
    : SOURCES.some((s) => s.syncStatus === "stale")
      ? "stale"
      : SOURCES.some((s) => s.syncStatus === "syncing")
        ? "syncing"
        : "synced";

  const handleSearch = () => {
    if (query.trim()) {
      setHasSearched(true);
    }
  };

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 max-w-[1000px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-foreground tracking-tight">
          Knowledge
        </h1>
        <div className="flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${SYNC_STYLES[overallStatus].dot}`} />
          <span className={`text-xs font-medium ${SYNC_STYLES[overallStatus].labelClass}`}>
            {SYNC_STYLES[overallStatus].label}
          </span>
        </div>
        <span className="text-xs text-muted-foreground ml-auto">
          {SOURCES.reduce((sum, s) => sum + s.itemCount, 0)} total items
        </span>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-0.5 border-b border-border-subtle">
        {(["sources", "inspector"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "text-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "sources" ? "Sources" : "Inspector"}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Sources tab */}
      {activeTab === "sources" && (
        <div className="flex flex-col gap-2">
          {SOURCES.map((source) => {
            const Icon = source.icon;
            const sync = SYNC_STYLES[source.syncStatus];
            return (
              <div
                key={source.id}
                className="flex items-center gap-4 rounded-lg border border-border-subtle bg-card px-4 py-3 transition-colors hover:border-border"
              >
                <Icon size={18} className="text-accent shrink-0" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-foreground truncate">
                      {source.name}
                    </h3>
                    <span className="flex items-center gap-1">
                      <span className={`h-1.5 w-1.5 rounded-full ${sync.dot}`} />
                      <span className={`text-[11px] font-medium ${sync.labelClass}`}>
                        {sync.label}
                      </span>
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {source.description}
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-6 shrink-0 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Database size={11} />
                    {source.itemCount} items
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {source.lastSynced}
                  </span>
                  <span className="tabular-nums">{source.size}</span>
                </div>

                <button className="rounded-md p-1.5 text-muted-foreground hover:text-accent hover:bg-accent-subtle transition-colors">
                  <RefreshCw size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Inspector tab */}
      {activeTab === "inspector" && (
        <div className="flex flex-col gap-4">
          {/* Query input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Ask a question or search knowledge..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full rounded-lg border border-border-subtle bg-card pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-accent focus:outline-none"
              />
            </div>
            <button
              onClick={handleSearch}
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent-subtle border border-accent/30 px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
            >
              Search
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Results */}
          {!hasSearched ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <BookOpen size={32} className="text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                Query your knowledge base to find relevant documents and context.
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Try: "What is the dark factory merge policy?" or "Auth migration status"
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">
                {MOCK_RESULTS.length} results from knowledge base
              </p>
              {MOCK_RESULTS.map((result) => (
                <div
                  key={result.id}
                  className="rounded-lg border border-border-subtle bg-card px-4 py-3 cursor-pointer transition-colors hover:border-border"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-foreground">
                      {result.title}
                    </h4>
                    <span className="rounded-full bg-accent-subtle px-2 py-0.5 text-[10px] font-mono text-accent tabular-nums">
                      {result.relevance}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground/70 mb-1.5">
                    {result.source}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {result.snippet}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
