"use client";

import { useState } from "react";
import { Download, FileText, Moon, Sun } from "lucide-react";
import {
  COLORS,
  GROUP_GRADIENTS,
  COLOR_ENTRIES,
  CHORD_CHIPS,
  LONG_CHORD_BAR,
} from "./constants";

// ─── Theme tokens ───────────────────────────────────────────────────────────
// Dark = warm neutral canvas. Light = warm off-white canvas.
// Brand specimen colors (swatches, gradients, demo cards) stay fixed.

const THEME = {
  dark: {
    bg: "#111110",
    heading: "#e8e6e1",
    body: "#8a8880",
    muted: "#6b6860",
    faint: "#5a5750",
    subtle: "#4a4740",
    hex: "#c8c5be",
    groupName: "#b0ada6",
    divider: "#2a2926",
    chipLabel: "#7a776f",
    swatchBorder: "rgba(255,255,255,0.12)",
    headerBg: "#0c0c0b",
    headerBorder: "#1e1d1b",
  },
  light: {
    bg: "#faf9f7",
    heading: "#1a1917",
    body: "#6b6860",
    muted: "#8a8880",
    faint: "#a09d96",
    subtle: "#b0ada6",
    hex: "#3a3832",
    groupName: "#4a4740",
    divider: "#e5e3de",
    chipLabel: "#6b6860",
    swatchBorder: "rgba(0,0,0,0.12)",
    headerBg: "#ffffff",
    headerBorder: "#e8e6e1",
  },
} as const;

type Mode = keyof typeof THEME;

// ─── Sub-components ─────────────────────────────────────────────────────────

function ColorSwatch({ color, borderColor }: { color: string; borderColor: string }) {
  return (
    <span
      className="inline-block h-4 w-4 shrink-0 rounded-sm"
      style={{ backgroundColor: color, border: `1px solid ${borderColor}` }}
    />
  );
}

function GradientBar({
  colors,
  horizontal = true,
  className,
}: {
  colors: readonly string[];
  horizontal?: boolean;
  className?: string;
}) {
  const direction = horizontal ? "to right" : "to bottom";
  const gradient = `linear-gradient(${direction}, ${colors.join(", ")})`;
  return <span className={className} style={{ background: gradient }} />;
}

function ChordChip({
  label,
  colors,
  labelColor,
}: {
  label: string;
  colors: readonly string[];
  labelColor: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <GradientBar
        colors={colors}
        horizontal
        className="block h-6 w-20 rounded-md"
      />
      <span className="mt-1 text-xs" style={{ color: labelColor }}>{label}</span>
    </div>
  );
}

// ─── Main View ──────────────────────────────────────────────────────────────

export function ColorStandardsView() {
  const [mode, setMode] = useState<Mode>("dark");
  const t = THEME[mode];
  const groupNames = Object.keys(GROUP_GRADIENTS);

  return (
    <div className="flex h-screen flex-col" style={{ backgroundColor: t.bg }}>

      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-4"
        style={{ backgroundColor: t.headerBg, borderBottom: `1px solid ${t.headerBorder}` }}
      >
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5" style={{ color: t.muted }} />
          <div>
            <h1 className="text-lg font-semibold" style={{ color: t.heading }}>Color Standards</h1>
            <p className="text-sm" style={{ color: t.muted }}>
              Brand-consistent color palette reference
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode(mode === "dark" ? "light" : "dark")}
            className="flex h-8 w-8 items-center justify-center rounded-md transition-colors"
            style={{ color: t.muted, backgroundColor: mode === "dark" ? "#1e1d1b" : "#eeece7" }}
            aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
          >
            {mode === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <a
            href="/Moons_Out_Color_Standards.pdf"
            download="Moons_Out_Color_Standards.pdf"
            className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
            style={{
              backgroundColor: COLORS.forest,
              color: COLORS.cream,
            }}
          >
            <Download className="h-4 w-4" />
            Download PDF
          </a>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto" style={{ backgroundColor: t.bg }}>
        <div className="mx-auto max-w-2xl px-6 py-10">

          {/* Title */}
          <div className="mb-10">
            <GradientBar colors={LONG_CHORD_BAR} horizontal className="mb-6 block h-0.5 w-16 rounded-full" />
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: t.heading }}>
              Coloring Standards for Filmmakers
            </h2>
            <p className="mt-1 text-sm" style={{ color: COLORS.gold }}>
              Building Brand-Consistent Color Palettes
            </p>
            <p className="mt-4 max-w-lg text-sm leading-relaxed" style={{ color: t.body }}>
              Canonical color palette for the Moons Out brand system. Every hex
              value, gradient chord, and usage rule below is authoritative.
            </p>
          </div>

          {/* Palette Groups */}
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: t.muted }}>
            Palette Groups
          </h3>

          {groupNames.map((name) => (
            <div key={name} className="mb-6">
              <div className="mb-2 flex items-center gap-2.5">
                <GradientBar
                  colors={GROUP_GRADIENTS[name]}
                  horizontal={false}
                  className="inline-block h-4 w-1.5 rounded-sm"
                />
                <span className="text-xs font-medium" style={{ color: t.groupName }}>{name}</span>
              </div>
              {COLOR_ENTRIES[name].map((entry) => (
                <div key={entry.hex + entry.label} className="flex items-center gap-3 py-1">
                  <ColorSwatch color={entry.hex} borderColor={t.swatchBorder} />
                  <code className="w-[4.5rem] text-xs" style={{ color: t.hex }}>{entry.hex}</code>
                  <span className="text-xs" style={{ color: t.chipLabel }}>{entry.label}</span>
                </div>
              ))}
            </div>
          ))}

          {/* Divider */}
          <div className="my-8 h-px" style={{ backgroundColor: t.divider }} />

          {/* Palette Chords */}
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-widest" style={{ color: t.muted }}>
            Palette Chords
          </h3>
          <p className="mb-5 text-xs" style={{ color: t.faint }}>
            Curated gradient pairings for each brand context.
          </p>

          <div className="flex flex-wrap gap-4">
            {CHORD_CHIPS.map((chip) => (
              <ChordChip key={chip.label} label={chip.label} colors={chip.colors} labelColor={t.chipLabel} />
            ))}
          </div>

          <GradientBar colors={LONG_CHORD_BAR} horizontal className="mt-6 block h-5 w-full rounded-md" />
          <p className="mt-1.5 text-xs" style={{ color: t.subtle }}>
            {LONG_CHORD_BAR.join("  →  ")}
          </p>

          {/* Divider */}
          <div className="my-8 h-px" style={{ backgroundColor: t.divider }} />

          {/* Demo cards — brand colors are fixed, canvas adapts */}
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-widest" style={{ color: t.muted }}>
            In Context
          </h3>
          <p className="mb-4 text-xs" style={{ color: t.faint }}>
            How each surface looks with real content.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg p-4" style={{ backgroundColor: COLORS.forest }}>
              <h4 className="mb-1 text-xs font-bold" style={{ color: COLORS.gold }}>Primary</h4>
              <p className="text-xs leading-relaxed" style={{ color: COLORS.cream, opacity: 0.85 }}>
                Forest + Cream + Gold accents. Default brand surface.
              </p>
              <span className="mt-2.5 inline-block rounded px-3 py-1 text-[10px] font-bold tracking-wide" style={{ backgroundColor: COLORS.wine, color: COLORS.cream }}>WATCH NOW</span>
            </div>
            <div className="rounded-lg p-4" style={{ backgroundColor: COLORS.navyDark }}>
              <h4 className="mb-1 text-xs font-bold" style={{ color: COLORS.gold }}>Cinematic</h4>
              <p className="text-xs leading-relaxed" style={{ color: COLORS.cream, opacity: 0.85 }}>
                Navy/Indigo for premium contexts.
              </p>
              <span className="mt-2.5 inline-block rounded px-3 py-1 text-[10px] font-bold tracking-wide" style={{ backgroundColor: COLORS.gold, color: COLORS.forestDeep }}>EXPLORE</span>
            </div>
            <div className="rounded-lg p-4" style={{ backgroundColor: COLORS.wine }}>
              <h4 className="mb-1 text-xs font-bold" style={{ color: COLORS.goldLight }}>CTA</h4>
              <p className="text-xs leading-relaxed" style={{ color: COLORS.cream, opacity: 0.85 }}>
                Wine for conversion surfaces only.
              </p>
              <span className="mt-2.5 inline-block rounded px-3 py-1 text-[10px] font-bold tracking-wide" style={{ backgroundColor: COLORS.gold, color: COLORS.forestDeep }}>GET STARTED</span>
            </div>
            <div className="rounded-lg p-4" style={{ backgroundColor: COLORS.cream, border: `1px solid ${mode === "dark" ? "#d4d1c8" : "#c8c5be"}` }}>
              <h4 className="mb-1 text-xs font-bold" style={{ color: COLORS.forest }}>Docs</h4>
              <p className="text-xs leading-relaxed" style={{ color: COLORS.textDark }}>
                Cream + Near-Black. Documentation only.
              </p>
              <span className="mt-2.5 inline-block rounded px-3 py-1 text-[10px] font-bold tracking-wide" style={{ backgroundColor: COLORS.forest, color: COLORS.cream }}>READ DOCS</span>
            </div>
          </div>

          {/* Divider */}
          <div className="my-8 h-px" style={{ backgroundColor: t.divider }} />

          {/* Usage Guidelines */}
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: t.muted }}>
            Usage Rules
          </h3>
          <ul className="space-y-2 text-xs leading-relaxed" style={{ color: t.body }}>
            <li>Primary backgrounds use Forest Green for all dark surfaces.</li>
            <li>Antique Gold is reserved for accents, CTAs, and interactive highlights.</li>
            <li>Body text on dark: Cream. On light: Near-Black.</li>
            <li>Wine appears only in CTA-forward contexts — never as a background fill.</li>
            <li>Navy is secondary dark; pair with Forest for depth, never standalone.</li>
            <li>High-contrast chord: premium or cinematic contexts only.</li>
            <li>Never combine more than two chords on a single page.</li>
          </ul>

          <div className="pb-4" />
        </div>
      </div>
    </div>
  );
}
