import { createElement } from "react";
import { renderToBuffer, Document, Page, View, Text, StyleSheet, Svg, Defs, LinearGradient, Stop, Rect } from "@react-pdf/renderer";
import { writeFileSync } from "fs";

// ─── Constants (inlined from constants.ts) ──────────────────────────────────
const COLORS = {
  forest: "#024029", forestDeep: "#012718", forestMid: "#024F33", forestDark: "#013320",
  navy: "#0B0D37", navyDark: "#0E1140", wine: "#59052D",
  gold: "#A68549", goldLight: "#B18E4E", goldWarm: "#957741",
  cream: "#F5F5DC", white: "#FFFFFF", black: "#000000",
  border: "#767166", textGray: "#5C5C5C", textDark: "#1A1A1A", textMuted: "#6B6B6B",
  bgPage: "#FFFFFF", bgSection: "#F9F8F6",
};

const GROUP_GRADIENTS = {
  "Core (baseline)": [COLORS.forest, COLORS.gold],
  "Core (high contrast)": [COLORS.forestDeep, COLORS.navy],
  "Core (soft documentary)": [COLORS.forestMid, COLORS.goldWarm],
  "CTA (wine-forward)": [COLORS.wine, COLORS.goldLight],
  "Docs Light Mode (optional)": [COLORS.cream, COLORS.forest],
};
const COLOR_ENTRIES = {
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
const CHORD_CHIPS = [
  { label: "Baseline", colors: [COLORS.forest, COLORS.gold] },
  { label: "High contrast", colors: [COLORS.forest, COLORS.navyDark] },
  { label: "Soft doc", colors: [COLORS.forestMid, COLORS.gold] },
  { label: "CTA", colors: [COLORS.forestDark, COLORS.wine, COLORS.goldLight] },
  { label: "Light", colors: [COLORS.cream, COLORS.gold, COLORS.forest] },
];
const LONG_CHORD_BAR = [COLORS.forest, COLORS.navyDark, COLORS.wine, COLORS.gold];

const PW = 595.28;
const BLEED = 52;
const CW = PW - BLEED * 2;

// ─── Helpers ────────────────────────────────────────────────────────────────
const h = createElement;

function GBar({ colors, width, height, horizontal = true, borderRadius = 4 }) {
  const id = "g" + colors.join("").replace(/#/g, "");
  const stops = colors.map((c, i) => h(Stop, { key: i, offset: `${(i / Math.max(1, colors.length - 1)) * 100}%`, stopColor: c }));
  return h(Svg, { width, height, viewBox: `0 0 ${width} ${height}` },
    h(Defs, null, h(LinearGradient, { id, x1: "0", y1: "0", x2: horizontal ? String(width) : "0", y2: horizontal ? "0" : String(height) }, ...stops)),
    h(Rect, { x: "0", y: "0", width: String(width), height: String(height), rx: String(borderRadius), ry: String(borderRadius), fill: `url(#${id})` })
  );
}

function Swatch({ color, size = 12 }) {
  return h(View, { style: { width: size, height: size, backgroundColor: color, borderWidth: 0.75, borderColor: COLORS.border, borderRadius: 2 } });
}

function EntryDark({ hex, label }) {
  return h(View, { style: { flexDirection: "row", alignItems: "center", marginBottom: 6 } },
    h(Swatch, { color: hex }),
    h(Text, { style: { fontSize: 9.5, fontFamily: "Courier", color: COLORS.gold, width: 65, marginLeft: 8 } }, hex),
    h(Text, { style: { fontSize: 9.5, color: COLORS.cream, opacity: 0.8, flex: 1 } }, label)
  );
}

function EntryLight({ hex, label }) {
  return h(View, { style: { flexDirection: "row", alignItems: "center", marginBottom: 6 } },
    h(Swatch, { color: hex }),
    h(Text, { style: { fontSize: 9.5, fontFamily: "Courier", color: COLORS.forest, width: 65, marginLeft: 8 } }, hex),
    h(Text, { style: { fontSize: 9.5, color: COLORS.textDark, opacity: 0.8, flex: 1 } }, label)
  );
}

function Bullet({ text, dark = false }) {
  const base = dark ? COLORS.cream : COLORS.textDark;
  const accent = dark ? COLORS.gold : COLORS.gold;
  return h(View, { style: { flexDirection: "row", marginBottom: 5 } },
    h(Text, { style: { fontSize: 9.5, width: 12, color: accent } }, "\u2022"),
    h(Text, { style: { fontSize: 9.5, lineHeight: 1.7, flex: 1, color: base } }, text)
  );
}

// ─── Document ───────────────────────────────────────────────────────────────
const goldRule = { height: 1.5, backgroundColor: COLORS.gold, opacity: 0.35, marginVertical: 12 };
const forestRule = { height: 1, backgroundColor: COLORS.forest, opacity: 0.2, marginVertical: 10 };
const band = (bg) => ({ backgroundColor: bg, paddingVertical: 20, paddingHorizontal: BLEED });
const headDark = { fontSize: 13, fontFamily: "Helvetica-Bold", color: COLORS.gold, marginBottom: 8, letterSpacing: 0.5 };
const headLight = { fontSize: 13, fontFamily: "Helvetica-Bold", color: COLORS.forest, marginBottom: 8 };
const muted = { fontSize: 8, color: COLORS.cream, opacity: 0.6 };
const groupHead = { fontSize: 11, fontFamily: "Helvetica-Bold", flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 };

const doc = h(Document, { title: "Coloring Standards for Filmmakers", author: "Moons Out" },

  // PAGE 1 — COVER
  h(Page, { size: "A4", style: { padding: 0, backgroundColor: COLORS.forest, fontFamily: "Helvetica", color: COLORS.cream } },
    h(GBar, { colors: LONG_CHORD_BAR, width: PW, height: 5, borderRadius: 0 }),
    h(View, { style: { flex: 1, justifyContent: "center", paddingHorizontal: BLEED + 16 } },
      h(View, { style: { width: 48, height: 3, backgroundColor: COLORS.gold, marginBottom: 20, borderRadius: 1.5 } }),
      h(Text, { style: { fontSize: 32, fontFamily: "Helvetica-Bold", color: COLORS.cream, lineHeight: 1.3, marginBottom: 10 } }, "Coloring Standards\nfor Filmmakers"),
      h(Text, { style: { fontSize: 16, color: COLORS.gold, marginBottom: 32 } }, "Building Brand-Consistent Color Palettes"),
      h(Text, { style: { fontSize: 10, color: COLORS.cream, opacity: 0.75, lineHeight: 1.7, maxWidth: 360 } },
        "This document defines the canonical color palette for the Moons Out brand system. Every hex value, gradient chord, and usage rule below is authoritative \u2014 use it as the single source of truth when selecting colors for film, web, print, or motion work.")
    ),
    h(View, { style: { position: "absolute", bottom: 36, left: BLEED + 16, right: BLEED + 16, flexDirection: "row", justifyContent: "space-between" } },
      h(Text, { style: { fontSize: 9, fontFamily: "Helvetica-Bold", color: COLORS.gold, letterSpacing: 2 } }, "MOONS OUT"),
      h(Text, { style: { fontSize: 8, color: COLORS.cream, opacity: 0.5 } }, "1 / 4")
    )
  ),

  // PAGE 2 — PALETTE GROUPS ON NATIVE BACKGROUNDS
  h(Page, { size: "A4", style: { padding: 0, backgroundColor: COLORS.forest, fontFamily: "Helvetica", color: COLORS.cream } },
    h(View, { style: { ...band(COLORS.forest), paddingTop: 56 } },
      h(Text, { style: headDark }, "Color Palette Groups"),
      h(Text, { style: muted }, "Each group shown on its native background to demonstrate intended contrast.")
    ),
    // Core baseline
    h(View, { style: band(COLORS.forest) },
      h(View, { style: groupHead }, h(GBar, { colors: GROUP_GRADIENTS["Core (baseline)"], width: 8, height: 16, horizontal: false, borderRadius: 3 }), h(Text, { style: { ...headDark, marginBottom: 0 } }, "Core (baseline)")),
      h(View, { style: goldRule }),
      ...COLOR_ENTRIES["Core (baseline)"].map(e => h(EntryDark, { key: e.hex, ...e }))
    ),
    // High contrast
    h(View, { style: band(COLORS.forestDeep) },
      h(View, { style: groupHead }, h(GBar, { colors: GROUP_GRADIENTS["Core (high contrast)"], width: 8, height: 16, horizontal: false, borderRadius: 3 }), h(Text, { style: { ...headDark, marginBottom: 0 } }, "Core (high contrast)")),
      h(View, { style: goldRule }),
      ...COLOR_ENTRIES["Core (high contrast)"].map(e => h(EntryDark, { key: e.hex, ...e }))
    ),
    // Soft documentary
    h(View, { style: band(COLORS.forestMid) },
      h(View, { style: groupHead }, h(GBar, { colors: GROUP_GRADIENTS["Core (soft documentary)"], width: 8, height: 16, horizontal: false, borderRadius: 3 }), h(Text, { style: { ...headDark, marginBottom: 0, color: COLORS.goldWarm } }, "Core (soft documentary)")),
      h(View, { style: { ...goldRule, backgroundColor: COLORS.goldWarm } }),
      ...COLOR_ENTRIES["Core (soft documentary)"].map(e => h(EntryDark, { key: e.hex, ...e }))
    ),
    // CTA wine
    h(View, { style: band(COLORS.wine) },
      h(View, { style: groupHead }, h(GBar, { colors: GROUP_GRADIENTS["CTA (wine-forward)"], width: 8, height: 16, horizontal: false, borderRadius: 3 }), h(Text, { style: { ...headDark, marginBottom: 0, color: COLORS.goldLight } }, "CTA (wine-forward)")),
      h(View, { style: { ...goldRule, backgroundColor: COLORS.goldLight } }),
      ...COLOR_ENTRIES["CTA (wine-forward)"].map(e => h(EntryDark, { key: e.hex, ...e }))
    ),
    // Docs light
    h(View, { style: band(COLORS.cream) },
      h(View, { style: groupHead }, h(GBar, { colors: GROUP_GRADIENTS["Docs Light Mode (optional)"], width: 8, height: 16, horizontal: false, borderRadius: 3 }), h(Text, { style: { ...headLight, marginBottom: 0 } }, "Docs Light Mode (optional)")),
      h(View, { style: forestRule }),
      ...COLOR_ENTRIES["Docs Light Mode (optional)"].map(e => h(EntryLight, { key: e.hex, ...e }))
    ),
    h(View, { style: { position: "absolute", bottom: 20, left: BLEED, right: BLEED, flexDirection: "row", justifyContent: "space-between" } },
      h(Text, { style: { fontSize: 7, color: COLORS.cream, opacity: 0.45 } }, "MOONS OUT"),
      h(Text, { style: { fontSize: 7, color: COLORS.cream, opacity: 0.45 } }, "2")
    )
  ),

  // PAGE 3 — CHORDS + DEMO PANELS
  h(Page, { size: "A4", style: { padding: 0, backgroundColor: COLORS.forestDeep, fontFamily: "Helvetica", color: COLORS.cream } },
    h(View, { style: { ...band(COLORS.forestDeep), paddingTop: 56 } },
      h(View, { style: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 8 } },
        h(Text, { style: headDark }, "Moons Out palette chords"),
        h(GBar, { colors: LONG_CHORD_BAR, width: 180, height: 14, borderRadius: 5 })
      ),
      h(Text, { style: muted }, "Curated gradient pairings defining the tonal character of each brand context.")
    ),
    h(View, { style: { ...band(COLORS.forestDeep), paddingTop: 0 } },
      h(View, { style: { flexDirection: "row", gap: 12, marginTop: 14 } },
        ...CHORD_CHIPS.map(c => h(View, { key: c.label, style: { alignItems: "center" } },
          h(GBar, { colors: c.colors, width: 80, height: 22, borderRadius: 6 }),
          h(Text, { style: { fontSize: 7.5, marginTop: 4, textAlign: "center", color: COLORS.cream, opacity: 0.7 } }, c.label)
        ))
      )
    ),
    h(View, { style: { paddingHorizontal: BLEED, marginTop: 4 } },
      h(GBar, { colors: LONG_CHORD_BAR, width: CW, height: 24, borderRadius: 6 }),
      h(Text, { style: { ...muted, marginTop: 4, fontSize: 7 } }, LONG_CHORD_BAR.join("  \u2192  "))
    ),
    h(View, { style: goldRule }),
    h(View, { style: { paddingHorizontal: BLEED, marginTop: 8 } },
      h(Text, { style: headDark }, "Live Application Demo"),
      h(Text, { style: { ...muted, marginBottom: 8 } }, "How the palette functions across real surfaces."),
      h(View, { style: { flexDirection: "row", gap: 12, marginTop: 14 } },
        h(View, { style: { flex: 1, borderRadius: 6, padding: 14, backgroundColor: COLORS.forest } },
          h(Text, { style: { fontSize: 10, fontFamily: "Helvetica-Bold", color: COLORS.gold, marginBottom: 6 } }, "Primary Surface"),
          h(Text, { style: { fontSize: 8.5, color: COLORS.cream, lineHeight: 1.7 } }, "Forest Green background with Cream body text and Antique Gold headings. The default brand surface."),
          h(View, { style: { backgroundColor: COLORS.wine, borderRadius: 4, paddingVertical: 8, paddingHorizontal: 20, alignSelf: "flex-start", marginTop: 10 } },
            h(Text, { style: { fontSize: 9, fontFamily: "Helvetica-Bold", color: COLORS.cream, letterSpacing: 0.5 } }, "WATCH NOW"))
        ),
        h(View, { style: { flex: 1, borderRadius: 6, padding: 14, backgroundColor: COLORS.navyDark } },
          h(Text, { style: { fontSize: 10, fontFamily: "Helvetica-Bold", color: COLORS.gold, marginBottom: 6 } }, "High-Contrast"),
          h(Text, { style: { fontSize: 8.5, color: COLORS.cream, lineHeight: 1.7 } }, "Navy/Indigo background for cinematic and premium contexts. Gold accents carry through."),
          h(View, { style: { backgroundColor: COLORS.gold, borderRadius: 4, paddingVertical: 8, paddingHorizontal: 20, alignSelf: "flex-start", marginTop: 6 } },
            h(Text, { style: { fontSize: 9, fontFamily: "Helvetica-Bold", color: COLORS.forestDeep, letterSpacing: 0.5 } }, "EXPLORE"))
        )
      ),
      h(View, { style: { flexDirection: "row", gap: 12, marginTop: 8 } },
        h(View, { style: { flex: 1, borderRadius: 6, padding: 14, backgroundColor: COLORS.wine } },
          h(Text, { style: { fontSize: 10, fontFamily: "Helvetica-Bold", color: COLORS.goldLight, marginBottom: 6 } }, "CTA Surface"),
          h(Text, { style: { fontSize: 8.5, color: COLORS.cream, lineHeight: 1.7 } }, "Wine drives urgency. Used on landing pages, pricing, and conversion flows only."),
          h(View, { style: { backgroundColor: COLORS.gold, borderRadius: 4, paddingVertical: 8, paddingHorizontal: 20, alignSelf: "flex-start", marginTop: 6 } },
            h(Text, { style: { fontSize: 9, fontFamily: "Helvetica-Bold", color: COLORS.forestDeep, letterSpacing: 0.5 } }, "GET STARTED"))
        ),
        h(View, { style: { flex: 1, borderRadius: 6, padding: 14, backgroundColor: COLORS.cream, borderWidth: 0.5, borderColor: COLORS.border } },
          h(Text, { style: { fontSize: 10, fontFamily: "Helvetica-Bold", color: COLORS.forest, marginBottom: 6 } }, "Light Mode"),
          h(Text, { style: { fontSize: 8.5, color: COLORS.textDark, lineHeight: 1.7 } }, "Cream background with Near-Black text. Reserved for documentation surfaces only."),
          h(View, { style: { backgroundColor: COLORS.forest, borderRadius: 4, paddingVertical: 8, paddingHorizontal: 20, alignSelf: "flex-start", marginTop: 10 } },
            h(Text, { style: { fontSize: 9, fontFamily: "Helvetica-Bold", color: COLORS.cream, letterSpacing: 0.5 } }, "READ DOCS"))
        )
      )
    ),
    h(View, { style: { position: "absolute", bottom: 20, left: BLEED, right: BLEED, flexDirection: "row", justifyContent: "space-between" } },
      h(Text, { style: { fontSize: 7, color: COLORS.cream, opacity: 0.45 } }, "MOONS OUT"),
      h(Text, { style: { fontSize: 7, color: COLORS.cream, opacity: 0.45 } }, "3")
    )
  ),

  // PAGE 4 — USAGE + QUICK REFERENCE (cream)
  h(Page, { size: "A4", style: { paddingTop: 56, paddingBottom: 48, paddingHorizontal: BLEED, backgroundColor: COLORS.cream, fontFamily: "Helvetica", color: COLORS.textDark } },
    h(Text, { style: headLight }, "Usage Guidelines"),
    h(View, { style: forestRule }),
    h(View, { style: { backgroundColor: COLORS.white, borderRadius: 4, padding: 14, borderWidth: 0.5, borderColor: COLORS.border, marginBottom: 22 } },
      h(Bullet, { text: "Primary backgrounds use Forest Green (#024029) for all dark surfaces." }),
      h(Bullet, { text: "Antique Gold (#A68549) is reserved for accents, CTAs, and interactive highlights." }),
      h(Bullet, { text: "Body text on dark uses Cream (#F5F5DC); on light uses Near-Black (#1A1A1A)." }),
      h(Bullet, { text: "Wine (#59052D) appears only in CTA-forward contexts \u2014 never as a background fill." }),
      h(Bullet, { text: "Navy (#0B0D37) is a secondary dark; pair with Forest for depth, never standalone." }),
      h(Bullet, { text: "High-contrast chord is for premium or cinematic contexts only." }),
      h(Bullet, { text: "Light mode (Cream base) is optional and restricted to documentation surfaces." }),
      h(Bullet, { text: "Never combine more than two chords on a single page or screen." })
    ),
    h(Text, { style: headLight }, "Quick Reference"),
    h(View, { style: forestRule }),
    ...Object.keys(GROUP_GRADIENTS).map(name =>
      h(View, { key: name, style: { marginBottom: 8 } },
        h(Text, { style: { fontSize: 11, fontFamily: "Helvetica-Bold", color: COLORS.forest, marginBottom: 3 } }, name),
        ...COLOR_ENTRIES[name].map(e => h(EntryLight, { key: e.hex + name, ...e }))
      )
    ),
    h(View, { style: { marginTop: 14 } },
      h(GBar, { colors: LONG_CHORD_BAR, width: CW, height: 20, borderRadius: 6 })
    ),
    h(View, { style: { position: "absolute", bottom: 20, left: BLEED, right: BLEED, flexDirection: "row", justifyContent: "space-between" } },
      h(Text, { style: { fontSize: 7, color: COLORS.forest, opacity: 0.45 } }, "MOONS OUT"),
      h(Text, { style: { fontSize: 7, color: COLORS.forest, opacity: 0.45 } }, "4")
    )
  )
);

const outPath = process.argv[2] || new URL("../public/Moons_Out_Color_Standards.pdf", import.meta.url).pathname;
const buffer = await renderToBuffer(doc);
writeFileSync(outPath, buffer);
console.log(`PDF generated: ${buffer.length} bytes -> ${outPath}`);
