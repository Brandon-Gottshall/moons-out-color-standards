"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { AppSidebar } from "./app-sidebar";
import { GlobalHeader } from "./global-header";

/* ------------------------------------------------------------------ */
/*  Shell context — shared collapse / sidebar / context state          */
/* ------------------------------------------------------------------ */

type ContextMode = "personal" | "work";

interface ShellState {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  toggleCollapsed: () => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  currentContext: ContextMode;
  setCurrentContext: (v: ContextMode) => void;
}

const ShellContext = createContext<ShellState | null>(null);

export function useShell(): ShellState {
  const ctx = useContext(ShellContext);
  if (!ctx) {
    throw new Error("useShell must be used inside <AppShell>");
  }
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  AppShell component                                                 */
/* ------------------------------------------------------------------ */

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentContext, setCurrentContext] = useState<ContextMode>("work");

  const toggleCollapsed = useCallback(
    () => setCollapsed((prev) => !prev),
    [],
  );

  const shell: ShellState = {
    collapsed,
    setCollapsed,
    toggleCollapsed,
    mobileOpen,
    setMobileOpen,
    currentContext,
    setCurrentContext,
  };

  return (
    <ShellContext value={shell}>
      <div className="flex h-dvh overflow-hidden bg-background text-foreground">
        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
        )}

        {/* Sidebar */}
        <AppSidebar
          collapsed={collapsed}
          onToggle={toggleCollapsed}
          currentContext={currentContext}
          onContextChange={setCurrentContext}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        {/* Main area: header + scrollable content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <GlobalHeader onMobileMenuToggle={() => setMobileOpen((p) => !p)} />

          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </ShellContext>
  );
}
