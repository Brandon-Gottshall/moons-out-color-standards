"use client";

import { useState, useCallback } from "react";
import { Download, Moon, Sun, Check, Copy } from "lucide-react";
import {
  COLORS,
  GROUP_GRADIENTS,
  COLOR_ENTRIES,
  CHORD_CHIPS,
  LONG_CHORD_BAR,
} from "./constants";

// ─── Theme tokens ───────────────────────────────────────────────────────────

const THEME = {
  dark: {
    bg: "#111110",
    surface: "#191817",
    heading: "#e8e6e1",
    body: "#9a978f",
    muted: "#77746c",
    faint: "#5a5750",
    hex: "#c8c5be",
    divider: "#252320",
    swatchBorder: "rgba(255,255,255,0.08)",
    cardBg: "#1a1918",
    cardBorder: "#252320",
    headerBg: "#0c0c0b",
    headerBorder: "#1e1d1b",
    toggleBg: "#1e1d1b",
    copyHover: "#252320",
  },
  light: {
    bg: "#f7f6f3",
    surface: "#ffffff",
    heading: "#1a1917",
    body: "#5c5a53",
    muted: "#8a877f",
    faint: "#a09d95",
    hex: "#3a3832",
    divider: "#e5e3dd",
    swatchBorder: "rgba(0,0,0,0.08)",
    cardBg: "#ffffff",
    cardBorder: "#e5e3dd",
    headerBg: "#ffffff",
    headerBorder: "#e8e6e1",
    toggleBg: "#eeece7",
    copyHover: "#f0eeea",
  },
} as const;

type Mode = keyof typeof THEME;
type ThemeTokens = (typeof THEME)[Mode];

// ─── Utility: readable foreground for a hex bg ──────────────────────────────

function luminance(hex: string): number {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  const toLinear = (v: number) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function fgForBg(hex: string): string {
  return luminance(hex) > 0.18 ? "#1a1917" : "#f5f4f0";
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function CopyHex({ hex, theme }: { hex: string; theme: ThemeTokens }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard.writeText(hex).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [hex]);

  return (
    <button
      onClick={copy}
      className="group flex items-center gap-1.5 rounded px-1.5 py-0.5 font-mono text-xs transition-colors"
      style={{ color: theme.hex }}
      title={`Copy ${hex}`}
    >
      {hex}
      <span className="opacity-0 transition-opacity group-hover:opacity-60" style={{ color: theme.muted }}>
        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      </span>
    </button>
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
  return <span className={className} style={{ background: `linear-gradient(${direction}, ${colors.join(", ")})` }} />;
}

// ─── Palette Group: large color blocks ──────────────────────────────────────

function PaletteGroup({
  name,
  entries,
  gradientColors,
  theme,
}: {
  name: string;
  entries: readonly { hex: string; label: string }[];
  gradientColors: readonly string[];
  theme: ThemeTokens;
}) {
  return (
    <div
      className="overflow-hidden rounded-xl"
      style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
    >
      {/* Group header */}
      <div className="flex items-center gap-3 px-5 py-3.5" style={{ borderBottom: `1px solid ${theme.divider}` }}>
        <GradientBar colors={gradientColors} horizontal={false} className="inline-block h-5 w-1.5 rounded-full" />
        <span className="text-sm font-semibold" style={{ color: theme.heading }}>{name}</span>
      </div>

      {/* Color entries as big blocks */}
      <div className="grid grid-cols-2 gap-px sm:grid-cols-3 lg:grid-cols-4" style={{ backgroundColor: theme.divider }}>
        {entries.map((entry) => (
          <div key={entry.hex + entry.label} className="flex flex-col">
            {/* Large color block */}
            <div className="h-20 w-full" style={{ backgroundColor: entry.hex }}>
              <div className="flex h-full items-end p-2.5">
                <span className="rounded px-1.5 py-0.5 font-mono text-[11px] font-medium" style={{ color: fgForBg(entry.hex), backgroundColor: "rgba(0,0,0,0.15)" }}>
                  {entry.hex}
                </span>
              </div>
            </div>
            {/* Label + copy */}
            <div className="flex items-center justify-between px-3 py-2.5" style={{ backgroundColor: theme.cardBg }}>
              <span className="text-xs leading-snug" style={{ color: theme.body }}>{entry.label}</span>
              <CopyHex hex={entry.hex} theme={theme} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Chord Chip ─────────────────────────────────────────────────────────────

function ChordChip({
  label,
  colors,
  theme,
}: {
  label: string;
  colors: readonly string[];
  theme: ThemeTokens;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <GradientBar colors={colors} horizontal className="block h-10 w-24 rounded-lg" />
      <span className="text-xs font-medium" style={{ color: theme.muted }}>{label}</span>
    </div>
  );
}

// ─── Demo Surface Card ──────────────────────────────────────────────────────

function DemoCard({
  title,
  description,
  bg,
  headColor,
  bodyColor,
  buttonBg,
  buttonColor,
  buttonText,
}: {
  title: string;
  description: string;
  bg: string;
  headColor: string;
  bodyColor: string;
  buttonBg: string;
  buttonColor: string;
  buttonText: string;
}) {
  return (
    <div className="flex flex-col justify-between rounded-xl p-5" style={{ backgroundColor: bg, minHeight: 160 }}>
      <div>
        <h4 className="mb-2 text-sm font-bold" style={{ color: headColor }}>{title}</h4>
        <p className="text-xs leading-relaxed" style={{ color: bodyColor, opacity: 0.85 }}>{description}</p>
      </div>
      <span
        className="mt-4 inline-block self-start rounded-md px-4 py-2 text-[11px] font-bold uppercase tracking-wider"
        style={{ backgroundColor: buttonBg, color: buttonColor }}
      >
        {buttonText}
      </span>
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

      {/* ── Header ── */}
      <header
        className="flex shrink-0 items-center justify-between px-6 py-3.5"
        style={{ backgroundColor: t.headerBg, borderBottom: `1px solid ${t.headerBorder}` }}
      >
        <div className="flex items-center gap-2.5">
          <GradientBar colors={LONG_CHORD_BAR} horizontal className="inline-block h-5 w-1 rounded-full" />
          <span className="text-sm font-bold tracking-wide" style={{ color: t.heading }}>MOONS OUT</span>
          <span className="text-sm" style={{ color: t.muted }}>/ Color Standards</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode(mode === "dark" ? "light" : "dark")}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
            style={{ color: t.muted, backgroundColor: t.toggleBg }}
            aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
          >
            {mode === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
          <a
            href="/Moons_Out_Color_Standards.pdf"
            download="Moons_Out_Color_Standards.pdf"
            className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors"
            style={{ backgroundColor: COLORS.forest, color: COLORS.cream }}
          >
            <Download className="h-3.5 w-3.5" />
            PDF
          </a>
        </div>
      </header>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto" style={{ backgroundColor: t.bg }}>
        <div className="mx-auto max-w-4xl px-6 py-12 sm:px-10">

          {/* ── Hero / Title ── */}
          <section className="mb-14">
            <GradientBar colors={LONG_CHORD_BAR} horizontal className="mb-8 block h-1 w-20 rounded-full" />
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: t.heading }}>
              Coloring Standards<br />for Filmmakers
            </h1>
            <p className="mt-2 text-base" style={{ color: COLORS.gold }}>
              Building Brand-Consistent Color Palettes
            </p>
            <p className="mt-5 max-w-xl text-sm leading-relaxed" style={{ color: t.body }}>
              The canonical color palette for the Moons Out brand system. Every hex
              value, gradient chord, and usage rule below is authoritative — the single
              source of truth for film, web, print, and motion work.
            </p>
          </section>

          {/* ── Palette Groups ── */}
          <section className="mb-14">
            <h2 className="mb-2 text-lg font-bold" style={{ color: t.heading }}>Palette Groups</h2>
            <p className="mb-6 text-sm" style={{ color: t.muted }}>
              Five tonal contexts, each defining a surface and accent family. Click any hex to copy.
            </p>
            <div className="flex flex-col gap-5">
              {groupNames.map((name) => (
                <PaletteGroup
                  key={name}
                  name={name}
                  entries={COLOR_ENTRIES[name]}
                  gradientColors={GROUP_GRADIENTS[name]}
                  theme={t}
                />
              ))}
            </div>
          </section>

          {/* ── Palette Chords ── */}
          <section className="mb-14">
            <h2 className="mb-2 text-lg font-bold" style={{ color: t.heading }}>Palette Chords</h2>
            <p className="mb-6 text-sm" style={{ color: t.muted }}>
              Curated gradient pairings that define the tonal character of each brand context.
              Each chord blends two to three anchors from the master palette.
            </p>

            <div className="flex flex-wrap gap-5">
              {CHORD_CHIPS.map((chip) => (
                <ChordChip key={chip.label} label={chip.label} colors={chip.colors} theme={t} />
              ))}
            </div>

            <div className="mt-8">
              <p className="mb-2 text-xs font-medium uppercase tracking-widest" style={{ color: t.muted }}>Master Gradient</p>
              <GradientBar colors={LONG_CHORD_BAR} horizontal className="block h-8 w-full rounded-lg" />
              <div className="mt-2 flex justify-between">
                {LONG_CHORD_BAR.map((c) => (
                  <CopyHex key={c} hex={c} theme={t} />
                ))}
              </div>
            </div>
          </section>

          {/* ── In Context ── */}
          <section className="mb-14">
            <h2 className="mb-2 text-lg font-bold" style={{ color: t.heading }}>In Context</h2>
            <p className="mb-6 text-sm" style={{ color: t.muted }}>
              How each surface looks with real content. These represent the four primary
              surface modes in the brand system.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <DemoCard
                title="Primary Surface"
                description="Forest Green background with Cream body text and Antique Gold headings. This is the default for all brand-forward surfaces."
                bg={COLORS.forest}
                headColor={COLORS.gold}
                bodyColor={COLORS.cream}
                buttonBg={COLORS.wine}
                buttonColor={COLORS.cream}
                buttonText="Watch Now"
              />
              <DemoCard
                title="Cinematic / Premium"
                description="Navy and Indigo reserved for cinematic hero sections and premium contexts. Gold accents maintain brand continuity."
                bg={COLORS.navyDark}
                headColor={COLORS.gold}
                bodyColor={COLORS.cream}
                buttonBg={COLORS.gold}
                buttonColor={COLORS.forestDeep}
                buttonText="Explore"
              />
              <DemoCard
                title="CTA / Conversion"
                description="Wine drives urgency and action. Restricted to landing pages, pricing, sign-up flows, and conversion surfaces."
                bg={COLORS.wine}
                headColor={COLORS.goldLight}
                bodyColor={COLORS.cream}
                buttonBg={COLORS.gold}
                buttonColor={COLORS.forestDeep}
                buttonText="Get Started"
              />
              <DemoCard
                title="Documentation"
                description="Cream background with Near-Black text. Reserved exclusively for documentation, help content, and reference surfaces."
                bg={COLORS.cream}
                headColor={COLORS.forest}
                bodyColor={COLORS.textDark}
                buttonBg={COLORS.forest}
                buttonColor={COLORS.cream}
                buttonText="Read Docs"
              />
            </div>
          </section>

          {/* ── Usage Rules ── */}
          <section className="mb-14">
            <h2 className="mb-2 text-lg font-bold" style={{ color: t.heading }}>Usage Rules</h2>
            <p className="mb-6 text-sm" style={{ color: t.muted }}>
              Hard constraints on how the palette may be applied across surfaces.
            </p>

            <div
              className="overflow-hidden rounded-xl"
              style={{ backgroundColor: t.cardBg, border: `1px solid ${t.cardBorder}` }}
            >
              {[
                { color: COLORS.forest, rule: "Primary backgrounds use Forest Green (#024029) for all dark surfaces." },
                { color: COLORS.gold, rule: "Antique Gold (#A68549) is reserved for accents, CTAs, and interactive highlights." },
                { color: COLORS.cream, rule: "Body text on dark backgrounds uses Cream (#F5F5DC). On light backgrounds, use Near-Black (#1A1A1A)." },
                { color: COLORS.wine, rule: "Wine (#59052D) appears only in CTA-forward contexts — never as a standalone background fill." },
                { color: COLORS.navy, rule: "Navy (#0B0D37) is a secondary dark. Pair with Forest for depth — never use standalone." },
                { color: COLORS.navyDark, rule: "The high-contrast chord (Forest + Navy) is for premium or cinematic contexts only." },
                { color: COLORS.cream, rule: "Light mode (Cream base) is optional and restricted to documentation surfaces." },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 px-5 py-3.5"
                  style={{ borderBottom: i < 6 ? `1px solid ${t.divider}` : undefined }}
                >
                  <span
                    className="mt-1 h-3 w-3 shrink-0 rounded-sm"
                    style={{ backgroundColor: item.color, border: `1px solid ${t.swatchBorder}` }}
                  />
                  <p className="text-sm leading-relaxed" style={{ color: t.body }}>{item.rule}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Footer ── */}
          <footer className="flex items-center justify-between pt-4 pb-8" style={{ borderTop: `1px solid ${t.divider}` }}>
            <div className="flex items-center gap-2.5">
              <GradientBar colors={LONG_CHORD_BAR} horizontal className="inline-block h-4 w-1 rounded-full" />
              <span className="text-xs font-bold tracking-wider" style={{ color: t.muted }}>MOONS OUT</span>
            </div>
            <span className="text-xs" style={{ color: t.faint }}>Color Standards v1.0 — March 2026</span>
          </footer>

        </div>
      </div>
    </div>
  );
}
