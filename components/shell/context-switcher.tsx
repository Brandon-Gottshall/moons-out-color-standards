"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ContextMode = "personal" | "work";

interface ContextOption {
  key: ContextMode | "both";
  label: string;
  description: string;
  dotColor: string; // Tailwind bg class
}

const CONTEXT_OPTIONS: ContextOption[] = [
  {
    key: "personal",
    label: "Personal",
    description: "Home, health, family, growth",
    dotColor: "bg-context-personal",
  },
  {
    key: "work",
    label: "Work",
    description: "Fleet operations, clients, projects",
    dotColor: "bg-context-work",
  },
  {
    key: "both",
    label: "Both",
    description: "Blended view \u2014 see across contexts",
    dotColor: "bg-gradient-to-r from-context-personal to-context-work",
  },
];

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface ContextSwitcherProps {
  collapsed: boolean;
  currentContext: ContextMode;
  onContextChange: (ctx: ContextMode) => void;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ContextSwitcher({
  collapsed,
  currentContext,
  onContextChange,
}: ContextSwitcherProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [open]);

  const active =
    CONTEXT_OPTIONS.find((o) => o.key === currentContext) ?? CONTEXT_OPTIONS[1];

  /* Collapsed: just the dot */
  if (collapsed) {
    return (
      <div className="flex justify-center py-2">
        <span
          className={`block h-2.5 w-2.5 rounded-full ${active.dotColor}`}
          title={active.label}
        />
      </div>
    );
  }

  /* Expanded: button + dropdown */
  return (
    <div ref={ref} className="relative mx-2 mb-1">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center gap-2 rounded-lg border border-border-subtle bg-card-elevated px-2.5 py-1.5 text-left text-sm transition-colors hover:border-border"
      >
        <span
          className={`block h-2 w-2 shrink-0 rounded-full ${active.dotColor}`}
        />
        <span className="flex-1 truncate font-medium text-foreground">
          {active.label}
        </span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 animate-scale-in rounded-lg border border-border bg-card-elevated p-1 shadow-xl">
          {CONTEXT_OPTIONS.map((opt) => {
            const isActive = opt.key === currentContext;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => {
                  if (opt.key !== "both") {
                    onContextChange(opt.key);
                  }
                  // "both" is a future feature — for now just close
                  setOpen(false);
                }}
                className={`flex w-full items-start gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors ${
                  isActive
                    ? "bg-accent-subtle text-foreground"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                }`}
              >
                <span
                  className={`mt-1 block h-2 w-2 shrink-0 rounded-full ${opt.dotColor}`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium">{opt.label}</span>
                    {isActive && (
                      <Check size={12} className="text-accent" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug">
                    {opt.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
