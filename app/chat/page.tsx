"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Send,
  Slash,
  Paperclip,
  MoreHorizontal,
  Users,
  FolderOpen,
  ListChecks,
  FileText,
  Bot,
  User,
  Info,
  Hash,
  Circle,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

type ThreadStatus = "active" | "waiting" | "resolved" | "needs_action";

interface Thread {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  status: ThreadStatus;
  avatar: string;
  unread: boolean;
  participantCount: number;
}

const MOCK_THREADS: Thread[] = [
  {
    id: "t1",
    title: "Meridian Studios QBR",
    preview: "Brandon: Deck is finalized, just need your sign-off on the...",
    timestamp: "10:12 AM",
    status: "needs_action",
    avatar: "MS",
    unread: true,
    participantCount: 3,
  },
  {
    id: "t2",
    title: "Northvane Scope Revision",
    preview: "System: Scope document updated. New deadline detected...",
    timestamp: "9:45 AM",
    status: "active",
    avatar: "NV",
    unread: true,
    participantCount: 2,
  },
  {
    id: "t3",
    title: "Fleet Knowledge Sync",
    preview: "Agent: 4 doctrine units compiled. Waiting for operator review...",
    timestamp: "8:30 AM",
    status: "waiting",
    avatar: "FK",
    unread: false,
    participantCount: 1,
  },
  {
    id: "t4",
    title: "Brand Strategy — Pinehill",
    preview: "You: Let me review the positioning brief and get back to...",
    timestamp: "Yesterday",
    status: "active",
    avatar: "PH",
    unread: false,
    participantCount: 4,
  },
  {
    id: "t5",
    title: "Dev Ops: CI Pipeline Fix",
    preview: "Agent: Build passing again. Root cause was the postcss...",
    timestamp: "Yesterday",
    status: "resolved",
    avatar: "DO",
    unread: false,
    participantCount: 2,
  },
  {
    id: "t6",
    title: "Weekly Planning Thread",
    preview: "System: Week 14 plan generated. 3 proposals pending your...",
    timestamp: "Mon",
    status: "needs_action",
    avatar: "WP",
    unread: false,
    participantCount: 1,
  },
  {
    id: "t7",
    title: "Recruiting — Senior Designer",
    preview: "You: Schedule the second interview for Thursday if she's...",
    timestamp: "Mon",
    status: "waiting",
    avatar: "RD",
    unread: false,
    participantCount: 3,
  },
  {
    id: "t8",
    title: "Invoice Discrepancy — Lumino",
    preview: "Agent: Found the mismatch. Sending correction to their AP...",
    timestamp: "Mar 31",
    status: "resolved",
    avatar: "LM",
    unread: false,
    participantCount: 2,
  },
];

type MessageRole = "user" | "agent" | "system";

interface Message {
  id: string;
  role: MessageRole;
  sender: string;
  content: string;
  timestamp: string;
}

const MOCK_MESSAGES: Message[] = [
  {
    id: "m1",
    role: "system",
    sender: "System",
    content: "Thread created from client email — Meridian Studios quarterly review.",
    timestamp: "9:00 AM",
  },
  {
    id: "m2",
    role: "agent",
    sender: "Fleet Agent",
    content:
      "I've pulled the QBR deck from the project folder and cross-referenced it with the latest metrics. Revenue is up 12% QoQ. Three items flagged for discussion: contract renewal terms, expanded scope for Q3, and the delayed deliverable from February. Want me to prepare talking points?",
    timestamp: "9:15 AM",
  },
  {
    id: "m3",
    role: "user",
    sender: "You",
    content:
      "Yes, draft talking points. Focus on the renewal terms — they hinted at wanting a longer commitment last time. Also pull Brandon in, he led the February deliverable recovery.",
    timestamp: "9:32 AM",
  },
  {
    id: "m4",
    role: "agent",
    sender: "Fleet Agent",
    content:
      "Done. Talking points drafted and attached to the thread. I've notified Brandon and he confirmed he'll join the 10:30 call. He added a note about the February situation — says the client was satisfied with the resolution and it might actually strengthen the renewal case.",
    timestamp: "9:48 AM",
  },
  {
    id: "m5",
    role: "user",
    sender: "Brandon",
    content:
      "Deck is finalized, just need your sign-off on the pricing slide. I adjusted the renewal discount to 8% based on the volume commitment they mentioned. Let me know if you want to go higher.",
    timestamp: "10:12 AM",
  },
];

const MOCK_CONTEXT = {
  client: "Meridian Studios",
  project: "Q2 2026 Quarterly Business Review",
  status: "Active — call in 45 min",
  participants: ["You", "Brandon Cole", "Fleet Agent"],
  nextSteps: [
    "Review pricing slide",
    "Confirm renewal discount %",
    "Join 10:30 AM call",
  ],
  files: [
    { name: "QBR-Deck-Q2-2026.pdf", size: "2.4 MB" },
    { name: "Talking-Points.md", size: "4 KB" },
    { name: "Revenue-Metrics.csv", size: "12 KB" },
  ],
};

const FILTER_TABS = ["All", "Active", "Needs Action", "By Client"] as const;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function statusIndicator(status: ThreadStatus) {
  switch (status) {
    case "active":
      return <Circle size={8} className="fill-success text-success" />;
    case "needs_action":
      return <AlertCircle size={10} className="text-warning" />;
    case "waiting":
      return <Clock size={10} className="text-muted-foreground" />;
    case "resolved":
      return <CheckCircle2 size={10} className="text-muted-foreground/50" />;
  }
}

function messageAlign(role: MessageRole) {
  if (role === "user") return "items-end";
  if (role === "system") return "items-center";
  return "items-start";
}

function messageBubble(role: MessageRole) {
  if (role === "user")
    return "bg-accent/15 text-foreground rounded-2xl rounded-br-md";
  if (role === "system")
    return "bg-transparent text-muted-foreground text-xs italic";
  return "bg-card-elevated text-foreground rounded-2xl rounded-bl-md";
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function FleetChat() {
  const [activeThread, setActiveThread] = useState("t1");
  const [activeFilter, setActiveFilter] = useState<(typeof FILTER_TABS)[number]>("All");
  const [composerText, setComposerText] = useState("");

  const selectedThread = MOCK_THREADS.find((t) => t.id === activeThread);

  return (
    <div className="flex h-full overflow-hidden">
      {/* ================================================================ */}
      {/*  LEFT PANEL — Thread List                                        */}
      {/* ================================================================ */}
      <div className="flex w-80 shrink-0 flex-col border-r border-border bg-card/40">
        {/* Search */}
        <div className="p-3 pb-2">
          <div className="flex items-center gap-2 rounded-lg border border-border-subtle bg-card-elevated/50 px-3 py-1.5">
            <Search size={14} className="shrink-0 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search threads..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
            />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-0.5 px-3 pb-2 overflow-x-auto">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                activeFilter === tab
                  ? "bg-accent-subtle text-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Thread list */}
        <div className="flex-1 overflow-y-auto">
          {MOCK_THREADS.map((thread) => (
            <button
              key={thread.id}
              onClick={() => setActiveThread(thread.id)}
              className={`flex w-full items-start gap-3 px-3 py-3 text-left transition-colors border-b border-border-subtle/50 ${
                activeThread === thread.id
                  ? "bg-accent-subtle/60"
                  : "hover:bg-muted/20"
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[11px] font-semibold ${
                  activeThread === thread.id
                    ? "bg-accent/20 text-accent"
                    : "bg-muted/40 text-muted-foreground"
                }`}
              >
                {thread.avatar}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span
                    className={`truncate text-sm ${
                      thread.unread ? "font-semibold text-foreground" : "font-medium text-foreground/80"
                    }`}
                  >
                    {thread.title}
                  </span>
                  <span className="shrink-0 text-[10px] text-muted-foreground">
                    {thread.timestamp}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {statusIndicator(thread.status)}
                  <p className="truncate text-xs text-muted-foreground">
                    {thread.preview}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ================================================================ */}
      {/*  CENTER PANEL — Thread Detail                                    */}
      {/* ================================================================ */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Thread header */}
        {selectedThread && (
          <div className="flex items-center gap-3 border-b border-border px-5 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-xs font-semibold text-accent">
              {selectedThread.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-foreground truncate">
                {selectedThread.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users size={11} />
                <span>{MOCK_CONTEXT.participants.join(", ")}</span>
                <span className="text-muted-foreground/40">|</span>
                {statusIndicator(selectedThread.status)}
                <span className="capitalize">{selectedThread.status.replace("_", " ")}</span>
              </div>
            </div>
            <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground">
              <MoreHorizontal size={16} />
            </button>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="mx-auto max-w-[640px] space-y-4">
            {MOCK_MESSAGES.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${messageAlign(msg.role)}`}>
                {msg.role === "system" ? (
                  <div className="flex items-center gap-2 py-2">
                    <div className="h-px flex-1 bg-border-subtle" />
                    <span className={messageBubble(msg.role)}>{msg.content}</span>
                    <div className="h-px flex-1 bg-border-subtle" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5 mb-1 px-1">
                      {msg.role === "agent" ? (
                        <Bot size={11} className="text-accent" />
                      ) : (
                        <User size={11} className="text-muted-foreground" />
                      )}
                      <span className="text-[11px] font-medium text-muted-foreground">
                        {msg.sender}
                      </span>
                      <span className="text-[10px] text-muted-foreground/50">
                        {msg.timestamp}
                      </span>
                    </div>
                    <div
                      className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed ${messageBubble(msg.role)}`}
                    >
                      {msg.content}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Composer */}
        <div className="border-t border-border px-5 py-3">
          <div className="mx-auto max-w-[640px]">
            <div className="flex items-end gap-2 rounded-xl border border-border bg-card-elevated/50 px-3 py-2">
              <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground">
                <Paperclip size={16} />
              </button>
              <textarea
                value={composerText}
                onChange={(e) => setComposerText(e.target.value)}
                placeholder="Type a message..."
                rows={1}
                className="flex-1 resize-none bg-transparent py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
              />
              <div className="flex items-center gap-1 shrink-0">
                <span className="hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground/40 mr-1">
                  <Slash size={10} />
                  commands
                </span>
                <button className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/15 text-accent transition-colors hover:bg-accent/25">
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/*  RIGHT PANEL — Context Sidebar                                   */}
      {/* ================================================================ */}
      <div className="hidden w-72 shrink-0 flex-col border-l border-border bg-card/30 lg:flex overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Client */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Client
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/15 text-[10px] font-semibold text-accent">
                MS
              </div>
              <span className="text-sm font-medium text-foreground">
                {MOCK_CONTEXT.client}
              </span>
            </div>
          </div>

          {/* Project */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Project
            </h3>
            <div className="flex items-center gap-2 text-sm text-foreground/80">
              <FolderOpen size={14} className="text-muted-foreground shrink-0" />
              {MOCK_CONTEXT.project}
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Status
            </h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="block h-2 w-2 rounded-full bg-success" />
              <span className="text-foreground/80">{MOCK_CONTEXT.status}</span>
            </div>
          </div>

          {/* Participants */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Participants
            </h3>
            <div className="space-y-1.5">
              {MOCK_CONTEXT.participants.map((p) => (
                <div key={p} className="flex items-center gap-2 text-sm text-foreground/80">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted/40 text-[9px] font-medium text-muted-foreground">
                    {p.split(" ").map((w) => w[0]).join("")}
                  </div>
                  {p}
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Next steps
            </h3>
            <div className="space-y-1.5">
              {MOCK_CONTEXT.nextSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <ListChecks size={13} className="mt-0.5 shrink-0 text-accent/60" />
                  {step}
                </div>
              ))}
            </div>
          </div>

          {/* Files */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Files
            </h3>
            <div className="space-y-1.5">
              {MOCK_CONTEXT.files.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted/20 cursor-pointer"
                >
                  <FileText size={13} className="shrink-0 text-muted-foreground" />
                  <span className="flex-1 truncate text-foreground/80">{file.name}</span>
                  <span className="shrink-0 text-[10px] text-muted-foreground/60">
                    {file.size}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
