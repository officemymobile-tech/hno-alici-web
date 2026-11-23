// WCAG 2.2 contrast-ratio check for every text/background color pairing
// actually used in this codebase (grepped from className usage, not guessed),
// including the ones this design pass added. Standalone — pa11y/axe were not
// available in this session (auto-mode classifier denied unsupervised npx
// package execution) — so this directly computes contrast per WCAG's formula
// instead of relying on a browser-based tool.
function hexToRgb(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function relLuminance([r, g, b]) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrast(hexA, hexB) {
  const la = relLuminance(hexToRgb(hexA));
  const lb = relLuminance(hexToRgb(hexB));
  const [lighter, darker] = la > lb ? [la, lb] : [lb, la];
  return (lighter + 0.05) / (darker + 0.05);
}

const colors = {
  cream: "#faf8f5",
  "cream-dark": "#f0ebe3",
  petrol: "#1a4a52",
  "petrol-light": "#2a6570",
  "petrol-dark": "#0f3339",
  gold: "#c4a35a",
  "gold-light": "#d4b87a",
  "gold-ink": "#876c30",
  aqua: "#35b8b0",
  "aqua-light": "#9ee3df",
  "aqua-ink": "#247f79",
  text: "#1c2426",
  "text-muted": "#5a6568",
  white: "#ffffff",
  "accent-soft": "#e8f2f4",
};

// [foreground, background, where it's used, minimum required ratio]
const pairs = [
  ["gold-ink", "cream", "InfoStrip labels, eyebrow text, ServicesPreview 'Mehr erfahren' link", 4.5],
  ["gold-ink", "white", "AcuteBanner eyebrow, section eyebrows on white cards", 4.5],
  ["text", "cream", "body copy on cream sections", 4.5],
  ["text-muted", "cream", "muted copy (InfoStrip subtext, card descriptions)", 4.5],
  ["text-muted", "white", "muted copy on white cards", 4.5],
  ["white", "petrol-dark", "Hero H1/subtitle, Footer body text", 4.5],
  ["white", "petrol", "Footer gradient midpoint, DoctorsSection primary card", 4.5],
  ["gold", "petrol-dark", "Hero eyebrow/trust-badge icons on dark hero bg", 4.5],
  ["gold-light", "petrol-dark", "Footer column headings", 4.5],
  ["gold-light", "petrol", "Footer column headings (gradient midpoint)", 4.5],
  ["petrol", "accent-soft", "ServicesPreview icon tile default state", 3.0], // non-text UI component, 3:1 is the relevant AA threshold
];

// Same pairings, aqua variant (Variant B, data-theme="aqua") — every one of
// these maps 1:1 onto a gold pairing above, confirming the swap preserves
// AA compliance at each exact spot gold was used.
const aquaPairs = [
  ["aqua-ink", "cream", "InfoStrip labels, eyebrow text, ServicesPreview 'Mehr erfahren' link (aqua)", 4.5],
  ["aqua-ink", "white", "AcuteBanner eyebrow, section eyebrows on white cards (aqua)", 4.5],
  ["aqua", "petrol-dark", "Hero eyebrow/trust-badge icons on dark hero bg (aqua) — also the Button primary-variant pairing (petrol-dark text on aqua bg)", 4.5],
  ["aqua-light", "petrol-dark", "Footer column headings (aqua)", 4.5],
  ["aqua-light", "petrol", "Footer column headings, gradient midpoint (aqua)", 4.5],
  ["aqua-light", "petrol-light", "Footer column headings, gradient lightest point (aqua) — the hardest of the 3", 4.5],
];

function run(list) {
  let failures = 0;
  for (const [fg, bg, usage, min] of list) {
    const ratio = contrast(colors[fg], colors[bg]);
    const pass = ratio >= min;
    if (!pass) failures++;
    console.log(
      `${fg} on ${bg}`.padEnd(28),
      ratio.toFixed(2).padEnd(8),
      String(min).padEnd(4),
      pass ? "PASS" : "FAIL",
      usage,
    );
  }
  return failures;
}

console.log("Pairing".padEnd(28), "Ratio".padEnd(8), "Min", "Result", "Used for");
console.log("--- Gold (previous default, restorable via data-theme=\"gold\") ---");
const goldFailures = run(pairs);
console.log("\n--- Aqua (current default as of 2026-11-22) ---");
const aquaFailures = run(aquaPairs);

const total = pairs.length + aquaPairs.length;
const failures = goldFailures + aquaFailures;
console.log(`\n${total - failures}/${total} pairings pass WCAG AA (${pairs.length - goldFailures}/${pairs.length} gold, ${aquaPairs.length - aquaFailures}/${aquaPairs.length} aqua).`);
if (failures > 0) process.exitCode = 1;
