"use client";

import { useState } from "react";
import {
  Check,
  Pencil,
  Clock,
  X,
  Mail,
  MessageSquare,
  Calendar,
  FileText,
  Bot,
  Globe,
  ChevronDown,
  Inbox as InboxIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

type InboxItemStatus = "needs_triage" | "snoozed" | "done";
type ClassificationType =
  | "Client Request"
  | "Follow-up"
  | "Calendar Invite"
  | "Internal Update"
  | "Invoice"
  | "System Alert";

const CLASSIFICATION_OPTIONS: ClassificationType[] = [
  "Client Request",
  "Follow-up",
  "Calendar Invite",
  "Internal Update",
  "Invoice",
  "System Alert",
];

interface InboxItem {
  id: string;
  classification: ClassificationType;
  source: string;
  sourceIcon: typeof Mail;
  preview: string;
  detail: string;
  timestamp: string;
  status: InboxItemStatus;
  confidence: number; // 0-1, system confidence in classification
}

const MOCK_ITEMS: InboxItem[] = [
  {
    id: "i1",
    classification: "Client Request",
    source: "Email from Sarah Chen (Meridian)",
    sourceIcon: Mail,
    preview: "Can we move the QBR to 11 AM instead? Also want to add their CFO to the invite.",
    detail: "Received 35 min ago. Relates to the Meridian Studios QBR thread.",
    timestamp: "35m ago",
    status: "needs_triage",
    confidence: 0.92,
  },
  {
    id: "i2",
    classification: "Follow-up",
    source: "Fleet Agent — auto-detected",
    sourceIcon: Bot,
    preview: "Brandon's deliverable review has been waiting 18 hours. He sent a nudge in chat.",
    detail: "Auto-captured from Fleet Chat activity. Linked to Brand Strategy thread.",
    timestamp: "2h ago",
    status: "needs_triage",
    confidence: 0.88,
  },
  {
    id: "i3",
    classification: "Calendar Invite",
    source: "Google Calendar",
    sourceIcon: Calendar,
    preview: "Team retrospective — Friday 3 PM. Invited by Dana.",
    detail: "New recurring event. No conflicts detected on your calendar.",
    timestamp: "3h ago",
    status: "needs_triage",
    confidence: 0.97,
  },
  {
    id: "i4",
    classification: "Invoice",
    source: "Email from accounts@luminopartners.com",
    sourceIcon: Mail,
    preview: "Corrected invoice #4421 attached. Previous discrepancy resolved per your request.",
    detail: "Matches the resolved Invoice Discrepancy thread with Lumino.",
    timestamp: "4h ago",
    status: "needs_triage",
    confidence: 0.85,
  },
  {
    id: "i5",
    classification: "Internal Update",
    source: "GitHub notification",
    sourceIcon: Globe,
    preview: "PR #847 merged: Fleet knowledge sync pipeline refactor. 12 files changed.",
    detail: "Merged by fleet-agent-ci. All checks passed. No review required.",
    timestamp: "5h ago",
    status: "snoozed",
    confidence: 0.94,
  },
  {
    id: "i6",
    classification: "System Alert",
    source: "Fleet Ops monitoring",
    sourceIcon: Bot,
    preview: "Shared canon drift detected: 4 files in doctrine/ changed upstream since last sync.",
    detail: "Non-blocking. Sync can be triggered from the Knowledge area.",
    timestamp: "6h ago",
    status: "needs_triage",
    confidence: 0.91,
  },
];

const FILTER_TABS = ["All", "Needs Triage", "Snoozed", "Done"] as const;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function classificationColor(cls: ClassificationType): string {
  switch (cls) {
    case "Client Request":
      return "bg-accent-subtle text-accent";
    case "Follow-up":
      return "bg-warning/15 text-warning";
    case "Calendar Invite":
      return "bg-info/15 text-info";
    case "Internal Update":
      return "bg-muted/40 text-muted-foreground";
    case "Invoice":
      return "bg-success/15 text-success";
    case "System Alert":
      return "bg-danger/15 text-danger";
    default:
      return "bg-muted/40 text-muted-foreground";
  }
}

function filterMatch(item: InboxItem, filter: (typeof FILTER_TABS)[number]): boolean {
  if (filter === "All") return true;
  if (filter === "Needs Triage") return item.status === "needs_triage";
  if (filter === "Snoozed") return item.status === "snoozed";
  if (filter === "Done") return item.status === "done";
  return true;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function InboxPage() {
  const [items, setItems] = useState(MOCK_ITEMS);
  const [activeFilter, setActiveFilter] = useState<(typeof FILTER_TABS)[number]>("All");
  const [editingId, setEditingId] = useState<string | null>(null);

  const filteredItems = items.filter((item) => filterMatch(item, activeFilter));
  const needsTriageCount = items.filter((i) => i.status === "needs_triage").length;

  function handleAccept(id: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "done" as const } : item
      )
    );
  }

  function handleSnooze(id: string) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "snoozed" as const } : item
      )
    );
  }

  function handleDismiss(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function handleReclassify(id: string, newClassification: ClassificationType) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, classification: newClassification, confidence: 1 } : item
      )
    );
    setEditingId(null);
  }

  return (
    <div className="mx-auto max-w-[860px] px-5 py-8 sm:py-10">
      {/* ---- Header ---- */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <InboxIcon size={20} className="text-accent" />
          <h1 className="text-xl font-semibold text-foreground tracking-tight">
            Inbox
          </h1>
          {needsTriageCount > 0 && (
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent/20 px-1.5 text-[11px] font-semibold text-accent">
              {needsTriageCount}
            </span>
          )}
        </div>
      </div>

      {/* ---- Filter tabs ---- */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {FILTER_TABS.map((tab) => {
          const count =
            tab === "All"
              ? items.length
              : tab === "Needs Triage"
                ? items.filter((i) => i.status === "needs_triage").length
                : tab === "Snoozed"
                  ? items.filter((i) => i.status === "snoozed").length
                  : items.filter((i) => i.status === "done").length;

          return (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                activeFilter === tab
                  ? "bg-accent-subtle text-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              {tab}
              <span className="text-[10px] opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      {/* ---- Items ---- */}
      <div className="space-y-3">
        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <InboxIcon size={32} className="text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              {activeFilter === "All" ? "Inbox is clear." : `No ${activeFilter.toLowerCase()} items.`}
            </p>
          </div>
        )}

        {filteredItems.map((item) => {
          const SourceIcon = item.sourceIcon;
          const isEditing = editingId === item.id;

          return (
            <div
              key={item.id}
              className={`rounded-xl border bg-card/30 p-5 transition-colors ${
                item.status === "done"
                  ? "border-border-subtle/50 opacity-60"
                  : item.status === "snoozed"
                    ? "border-border-subtle"
                    : "border-border"
              }`}
            >
              {/* Top row: classification chip + source + timestamp */}
              <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                {/* Classification chip — clickable to edit */}
                <div className="relative">
                  <button
                    onClick={() => setEditingId(isEditing ? null : item.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${classificationColor(item.classification)} ${
                      isEditing ? "ring-1 ring-accent" : "hover:ring-1 hover:ring-border"
                    }`}
                  >
                    {item.classification}
                    <ChevronDown size={10} className={`transition-transform ${isEditing ? "rotate-180" : ""}`} />
                    {item.confidence < 0.95 && (
                      <span className="ml-0.5 text-[9px] opacity-50">
                        {Math.round(item.confidence * 100)}%
                      </span>
                    )}
                  </button>

                  {/* Inline re-classification picker */}
                  {isEditing && (
                    <div className="absolute left-0 top-full z-20 mt-1.5 w-48 rounded-lg border border-border bg-card-elevated p-1 shadow-xl animate-scale-in">
                      {CLASSIFICATION_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleReclassify(item.id, opt)}
                          className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs transition-colors ${
                            opt === item.classification
                              ? "bg-accent-subtle text-accent font-medium"
                              : "text-foreground/80 hover:bg-muted/30"
                          }`}
                        >
                          <span
                            className={`block h-2 w-2 rounded-full ${classificationColor(opt).split(" ")[0]}`}
                          />
                          {opt}
                          {opt === item.classification && (
                            <Check size={10} className="ml-auto text-accent" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Source */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <SourceIcon size={11} />
                  <span>{item.source}</span>
                </div>

                {/* Timestamp */}
                <span className="ml-auto text-[10px] text-muted-foreground/60 shrink-0">
                  {item.timestamp}
                </span>
              </div>

              {/* Preview */}
              <p className="text-sm text-foreground mb-1.5 leading-relaxed">
                {item.preview}
              </p>

              {/* Detail */}
              <p className="text-xs text-muted-foreground mb-3">
                {item.detail}
              </p>

              {/* Action row */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleAccept(item.id)}
                  title="Accept"
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-success/15 hover:text-success"
                >
                  <Check size={15} />
                </button>
                <button
                  onClick={() => setEditingId(isEditing ? null : item.id)}
                  title="Edit classification"
                  className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                    isEditing
                      ? "bg-accent-subtle text-accent"
                      : "text-muted-foreground hover:bg-accent-subtle hover:text-accent"
                  }`}
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleSnooze(item.id)}
                  title="Not now"
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-warning/15 hover:text-warning"
                >
                  <Clock size={14} />
                </button>
                <button
                  onClick={() => handleDismiss(item.id)}
                  title="Dismiss"
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-danger/15 hover:text-danger"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
