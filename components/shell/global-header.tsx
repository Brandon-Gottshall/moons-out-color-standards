"use client";

import { Menu, Search } from "lucide-react";
import { useShell } from "./app-shell";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface GlobalHeaderProps {
  onMobileMenuToggle: () => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function GlobalHeader({ onMobileMenuToggle }: GlobalHeaderProps) {
  const { currentContext } = useShell();

  const contextDotColor =
    currentContext === "personal" ? "bg-context-personal" : "bg-context-work";

  return (
    <header className="sticky top-0 z-40 flex h-12 shrink-0 items-center gap-3 border-b border-border bg-card/60 px-3 backdrop-blur-md">
      {/* ---- Mobile hamburger (hidden md+) ---- */}
      <button
        type="button"
        onClick={onMobileMenuToggle}
        className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground md:hidden"
        aria-label="Toggle navigation"
      >
        <Menu size={18} />
      </button>

      {/* ---- Spacer left ---- */}
      <div className="flex-1" />

      {/* ---- Search / command bar trigger ---- */}
      <button
        type="button"
        className="flex h-8 items-center gap-2 rounded-lg border border-border-subtle bg-card-elevated/50 px-3 text-sm text-muted-foreground transition-colors hover:border-border hover:text-foreground"
      >
        <Search size={14} className="shrink-0" />
        <span className="hidden sm:inline">Search or jump to...</span>
        <kbd className="ml-2 hidden rounded border border-border-subtle bg-muted/40 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block">
          &#8984;K
        </kbd>
      </button>

      {/* ---- Spacer right ---- */}
      <div className="flex-1" />

      {/* ---- Right: context dot + user avatar ---- */}
      <div className="flex items-center gap-2.5">
        {/* Context indicator */}
        <span
          className={`block h-2 w-2 rounded-full ${contextDotColor}`}
          title={`Context: ${currentContext}`}
        />

        {/* User avatar */}
        <div
          className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 text-[11px] font-semibold text-accent"
          title="Fleet Operator"
        >
          FO
        </div>
      </div>
    </header>
  );
}
