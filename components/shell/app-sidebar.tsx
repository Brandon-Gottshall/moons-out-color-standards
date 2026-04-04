"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sun,
  MessageSquare,
  Inbox,
  LayoutList,
  Users,
  CalendarDays,
  FolderKanban,
  BookOpen,
  Activity,
  Radio,
  UserPlus,
  HardHat,
  ShoppingBag,
  Share2,
  BarChart3,
  Grid3x3,
  Zap,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { ContextSwitcher } from "./context-switcher";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ContextMode = "personal" | "work";

interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
  defaultCollapsed?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Navigation data                                                    */
/* ------------------------------------------------------------------ */

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Core",
    items: [
      { label: "Today", icon: Sun, href: "/" },
      { label: "Chat", icon: MessageSquare, href: "/chat" },
      { label: "Inbox", icon: Inbox, href: "/inbox" },
    ],
  },
  {
    title: "Work",
    items: [
      { label: "Plan", icon: LayoutList, href: "/plan" },
      { label: "Contexts", icon: Users, href: "/contexts" },
      { label: "Calendar", icon: CalendarDays, href: "/calendar" },
      { label: "Projects", icon: FolderKanban, href: "/projects" },
      { label: "Knowledge", icon: BookOpen, href: "/knowledge" },
    ],
  },
  {
    title: "Ops",
    items: [
      { label: "Ops", icon: Activity, href: "/ops" },
      { label: "Ops Live", icon: Radio, href: "/ops/live" },
    ],
  },
  {
    title: "More",
    defaultCollapsed: true,
    items: [
      { label: "Leads", icon: UserPlus, href: "/leads" },
      { label: "Workforce", icon: HardHat, href: "/workforce" },
      { label: "Store", icon: ShoppingBag, href: "/store" },
      { label: "Social", icon: Share2, href: "/social" },
      { label: "KPI", icon: BarChart3, href: "/kpi" },
      { label: "Apps", icon: Grid3x3, href: "/apps" },
      { label: "Automations", icon: Zap, href: "/automations" },
      { label: "Settings", icon: Settings, href: "/settings" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  currentContext: ContextMode;
  onContextChange: (ctx: ContextMode) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function AppSidebar({
  collapsed,
  onToggle,
  currentContext,
  onContextChange,
  mobileOpen,
  onMobileClose,
}: AppSidebarProps) {
  const pathname = usePathname();

  /* Track which "More"-style groups are expanded/collapsed */
  const [groupCollapsed, setGroupCollapsed] = useState<
    Record<string, boolean>
  >(() => {
    const init: Record<string, boolean> = {};
    for (const g of NAV_GROUPS) {
      if (g.defaultCollapsed) init[g.title] = true;
    }
    return init;
  });

  const toggleGroup = (title: string) =>
    setGroupCollapsed((prev) => ({ ...prev, [title]: !prev[title] }));

  /* Active-route check: exact for "/", prefix for everything else */
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  /* ---------------------------------------------------------------- */

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 flex flex-col
        border-r border-border bg-card/80 backdrop-blur-xl
        transition-all duration-200 ease-in-out
        md:relative md:z-auto
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${collapsed ? "w-[var(--sidebar-collapsed-width)]" : "w-[var(--sidebar-width)]"}
      `}
    >
      {/* ---- Logo area ---- */}
      <div
        className={`flex h-12 shrink-0 items-center border-b border-border-subtle ${
          collapsed ? "justify-center px-1" : "gap-2.5 px-3"
        }`}
      >
        <img
          src="/fleet-ops-logo.svg"
          alt="Fleet Ops"
          className="h-6 w-6 shrink-0"
        />
        {!collapsed && (
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Fleet Ops
          </span>
        )}
      </div>

      {/* ---- Context switcher ---- */}
      <div className={`shrink-0 ${collapsed ? "py-2" : "px-0 py-2"}`}>
        <ContextSwitcher
          collapsed={collapsed}
          currentContext={currentContext}
          onContextChange={onContextChange}
        />
      </div>

      {/* ---- Navigation ---- */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-1.5 pb-2">
        {NAV_GROUPS.map((group) => {
          const isGroupCollapsed = !!groupCollapsed[group.title];
          const hasCollapseToggle = !!group.defaultCollapsed;

          return (
            <div key={group.title} className="mb-1">
              {/* Group header — only visible when sidebar is expanded */}
              {!collapsed && (
                <div className="flex items-center px-1.5 pb-0.5 pt-3">
                  {hasCollapseToggle ? (
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.title)}
                      className="flex flex-1 items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <ChevronDown
                        size={12}
                        className={`transition-transform ${isGroupCollapsed ? "-rotate-90" : ""}`}
                      />
                      {group.title}
                    </button>
                  ) : (
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {group.title}
                    </span>
                  )}
                </div>
              )}

              {/* Items — hidden when the group is collapsed (unless sidebar is collapsed) */}
              {(!hasCollapseToggle || !isGroupCollapsed || collapsed) &&
                group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onMobileClose}
                      title={collapsed ? item.label : undefined}
                      className={`
                        group flex items-center rounded-md transition-colors
                        ${collapsed ? "mx-auto my-0.5 h-8 w-8 justify-center" : "mx-0 my-px gap-2.5 px-2.5 py-1.5"}
                        ${
                          active
                            ? "bg-accent-subtle text-accent"
                            : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                        }
                      `}
                    >
                      <Icon
                        size={16}
                        className={`shrink-0 ${active ? "text-accent" : "text-muted-foreground group-hover:text-foreground"}`}
                      />
                      {!collapsed && (
                        <span className="truncate text-[13px] font-medium">
                          {item.label}
                        </span>
                      )}
                    </Link>
                  );
                })}
            </div>
          );
        })}
      </nav>

      {/* ---- Collapse toggle (desktop only) ---- */}
      <div className="hidden shrink-0 border-t border-border-subtle p-1.5 md:block">
        <button
          type="button"
          onClick={onToggle}
          className={`flex items-center rounded-md text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground ${
            collapsed
              ? "mx-auto h-8 w-8 justify-center"
              : "w-full gap-2.5 px-2.5 py-1.5"
          }`}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <>
              <ChevronLeft size={16} className="shrink-0" />
              <span className="text-[13px] font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
