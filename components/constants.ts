// ─── Brand Colors ────────────────────────────────────────────────────────────

export const COLORS = {
  forest: "#024029",
  forestDeep: "#012718",
  forestMid: "#024F33",
  forestDark: "#013320",
  navy: "#0B0D37",
  navyDark: "#0E1140",
  wine: "#59052D",
  gold: "#A68549",
  goldLight: "#B18E4E",
  goldWarm: "#957741",
  cream: "#F5F5DC",
  white: "#FFFFFF",
  black: "#000000",
  border: "#767166",
  textGray: "#5C5C5C",
  textDark: "#1A1A1A",
  textMuted: "#6B6B6B",
  bgPage: "#FFFFFF",
  bgSection: "#F9F8F6",
} as const;

// ─── Palette Group Gradients (sidebar markers) ──────────────────────────────

export const GROUP_GRADIENTS: Record<string, readonly string[]> = {
  "Core (baseline)": [COLORS.forest, COLORS.gold],
  "Core (high contrast)": [COLORS.forestDeep, COLORS.navy],
  "Core (soft documentary)": [COLORS.forestMid, COLORS.goldWarm],
  "CTA (wine-forward)": [COLORS.wine, COLORS.goldLight],
  "Docs Light Mode (optional)": [COLORS.cream, COLORS.forest],
};

// ─── Individual Color Entries Per Group ──────────────────────────────────────

export const COLOR_ENTRIES: Record<string, readonly { hex: string; label: string }[]> = {
  "Core (baseline)": [
    { hex: "#024029", label: "Forest Green — primary background" },
    { hex: "#A68549", label: "Antique Gold — accent, CTAs, highlights" },
    { hex: "#F5F5DC", label: "Beige/Cream — body text on dark" },
    { hex: "#1A1A1A", label: "Near-Black — body text on light" },
  ],
  "Core (high contrast)": [
    { hex: "#012718", label: "Deep Forest — darkest background" },
    { hex: "#0B0D37", label: "Navy — secondary dark" },
    { hex: "#0E1140", label: "Dark Indigo — alternate dark" },
  ],
  "Core (soft documentary)": [
    { hex: "#024F33", label: "Medium Forest — softer primary" },
    { hex: "#957741", label: "Warm Gold — muted accent" },
  ],
  "CTA (wine-forward)": [
    { hex: "#59052D", label: "Wine — call-to-action primary" },
    { hex: "#B18E4E", label: "Light Gold — CTA accent" },
    { hex: "#013320", label: "Dark Forest — CTA background" },
  ],
  "Docs Light Mode (optional)": [
    { hex: "#F5F5DC", label: "Cream — light-mode background" },
    { hex: "#024029", label: "Forest Green — light-mode accent" },
  ],
};

// ─── Chord Chips (palette chords grid) ──────────────────────────────────────

export const CHORD_CHIPS: readonly { label: string; colors: readonly string[] }[] = [
  { label: "Baseline", colors: [COLORS.forest, COLORS.gold] },
  { label: "High contrast", colors: [COLORS.forest, COLORS.navyDark] },
  { label: "Soft doc", colors: [COLORS.forestMid, COLORS.gold] },
  { label: "CTA", colors: [COLORS.forestDark, COLORS.wine, COLORS.goldLight] },
  { label: "Light", colors: [COLORS.cream, COLORS.gold, COLORS.forest] },
];

// ─── Long Chord Bar ─────────────────────────────────────────────────────────

export const LONG_CHORD_BAR: readonly string[] = [
  COLORS.forest,
  COLORS.navyDark,
  COLORS.wine,
  COLORS.gold,
];

// ─── Layout Constants ───────────────────────────────────────────────────────

export const PAGE = {
  width: 595.28, // A4 points
  height: 841.89,
  paddingTop: 56,
  paddingBottom: 48,
  paddingHorizontal: 52,
} as const;

export const SWATCH = {
  size: 12,
  borderWidth: 0.75,
  borderRadius: 2,
  gap: 8, // gap between swatch and hex label
} as const;

export const GRADIENT_BAR = {
  sidebarWidth: 8,
  sidebarRadius: 3,
  headingBarHeight: 14,
  headingBarWidth: 180,
  headingBarRadius: 5,
} as const;

export const CHIP = {
  width: 80,
  height: 22,
  gap: 12,
  borderRadius: 6,
  labelOffset: 4,
} as const;

// ─── Typography Constants ───────────────────────────────────────────────────

export const FONT = {
  title: 22,
  subtitle: 14,
  sectionHeading: 13,
  groupHeading: 11,
  body: 9.5,
  small: 8,
  chipLabel: 7.5,
} as const;

export const LINE_HEIGHT = {
  tight: 1.3,
  normal: 1.5,
  relaxed: 1.7,
} as const;

// ─── Spacing Constants ──────────────────────────────────────────────────────

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 22,
  xl: 32,
  sectionGap: 28,
  groupGap: 18,
  entryGap: 6,
} as const;
