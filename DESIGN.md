---
name: TUNTAS
description: Friendly kitchen workflows with the original Porsi mascot.
colors:
  forest: "#174d3b"
  deep: "#102e25"
  leaf: "#25834b"
  cream: "#faf7ef"
  sun: "#ffce3b"
  pale: "#e8efd9"
  pale-2: "#f2f6e9"
  ink: "#142e24"
  muted: "#5b6b61"
  line: "#dfe5da"
  amber: "#d29523"
  red: "#ac3931"
  panel: "#fffefa"
  field: "#fffefb"
  field-border: "#bfcbb9"
  focus: "#d29410"
  forest-hover: "#23684c"
  sun-hover: "#ffdb68"
  badge-background: "#fff0bc"
  badge-text: "#614619"
  white: "white"
typography:
  display:
    fontFamily: "Jakarta, Arial, sans-serif"
    fontSize: "clamp(40px, 4.12vw, 64px)"
    fontWeight: 800
    lineHeight: 1.14
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Jakarta, Arial, sans-serif"
    fontSize: "31px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Jakarta, Arial, sans-serif"
    fontSize: "19px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Jakarta, Arial, sans-serif"
    fontSize: "16px"
    lineHeight: 1.6
  button:
    fontFamily: "Jakarta, Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 750
    lineHeight: 1.4
  badge:
    fontFamily: "Jakarta, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: 1.4
rounded:
  field: "10px"
  nav: "12px"
  panel-mobile: "17px"
  panel: "20px"
  preview: "24px"
  pill: "999px"
spacing:
  button-gap: "9px"
  form-gap: "19px"
  chart-gap: "22px"
  panel-heading: "24px 25px 18px"
  app-main: "32px 36px 35px"
components:
  button-primary:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "12px 23px"
  button-primary-hover:
    backgroundColor: "{colors.forest-hover}"
  button-sun:
    backgroundColor: "{colors.sun}"
    textColor: "{colors.deep}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "12px 23px"
  button-sun-hover:
    backgroundColor: "{colors.sun-hover}"
  panel:
    backgroundColor: "{colors.panel}"
    rounded: "{rounded.panel}"
  field:
    backgroundColor: "{colors.field}"
    rounded: "{rounded.field}"
    padding: "11px 13px"
  demo-badge:
    backgroundColor: "{colors.badge-background}"
    textColor: "{colors.badge-text}"
    typography: "{typography.badge}"
    rounded: "{rounded.pill}"
    padding: "5px 10px"
---

# Design System: TUNTAS

## Overview

**Approved direction: “B — Porsi besar dan alur yang ramah.”**

The WANA-family direction combines warm cream, forest green, yellow actions, generous rounded forms, and the supplied Porsi mascot. The landing explains a tray-to-decision journey; application screens use a quieter, structured kitchen workspace. Keep this identity recognizable across both.

Key characteristics:
- Original TUNTAS identity and Porsi artwork.
- Friendly illustration around practical, legible data.
- Explicit simulation labels beside illustrative results.

Source of truth: `app/globals.css`, `components/ui.tsx`, and the shipped feature components. Frontmatter records established values, including named CSS variables and selected repeated literals; it does not introduce a new runtime token layer. `.impeccable/design.json` records extensions. This documents an interactive prototype, not validated AI performance.

## Colors

Forest is the primary brand, navigation, and action color; deep and ink provide dark text. Leaf supports accents. Sun identifies prominent calls to action and the current capture step. Cream is the page canvas; pale and pale-2 support gentle green regions. Panels and fields use their near-white surfaces and subtle borders. Muted carries supporting text; line separates rows and containers.

Amber and red are existing semantic variables; red is used by errors and destructive actions. The amber demo badge has its own background/text pair. Do not substitute its low-contrast background for a text color. Inline food-icon palettes distinguish rice, protein, vegetables, and fruit; preserve their icon and text labels rather than relying on hue alone.

Focus uses a separate gold outline, not the sun button fill. Some surfaces have deliberate local near-white/green literals; consult the component CSS instead of normalizing every shade.

## Typography

The bundled Plus Jakarta Sans variable Latin font is registered as **Jakarta**, weight 100–900, with Arial and sans-serif fallbacks and `font-display: swap`. One family serves headings, interface text, and numbers.

- Landing display uses the frontmatter clamp; at ≥1600px it is 63px, ≤1250px 51px, ≤1000px 46px, ≤760px 41px/1.15, and ≤370px it is 35px. Tight tracking and weight 800 remain.
- Application page headings are 31px; ≤1250px 27px; ≤1000px 25px; ≤760px 27px; ≤370px 24px.
- Panel titles are 19px; ≤1250px 17px; ≤760px 18px. Individual feature titles can override these.
- Body defaults to 16px/1.6. Landing introduction is 20px, then 16px on phones. Dense application data tables and fields use 14px; table headings and secondary cell text use 12px.
- Late `.app-main` selectors in the stylesheet intentionally raise data, labels, notes, and explanations above earlier compact values. Preserve those cascade results. Mobile application page descriptions are 13px; stat supporting text is 11px.
- Tables and stat numbers use tabular numerals. Do not invent a mono font or a mathematical type scale; component-specific sizes are part of the shipped hierarchy.

## Layout

Landing `.wrap` is centered, width 100%, max-width 1500px, with 56px horizontal padding; responsive overrides use 35px at ≤1250px and ≤1000px, 23px at ≤760px, and 19px at ≤370px. The desktop journey has four tracks (29% / 24% / 25% / 22%) over an organic pale-green field. At ≤1000px the planning stage is hidden; at ≤760px all stages return in a two-column grid: photographs and Porsi, then result and shopping preview.

Desktop application navigation is a fixed 244px sidebar with matching body offset. It becomes 220px at ≤1250px, 190px at ≤1000px, and disappears at ≤760px in favor of fixed bottom navigation. Main content max-width is 1540px; padding changes from 32px 36px 35px to 28px 26px, 25px 22px, then 26px 20px 35px. At ≤370px horizontal application padding is 16px. Mobile footer clearance is 95px for bottom navigation.

Stats change from four columns to two at ≤1000px. Charts and capture layout become one column there; result, form, feature, pricing, and FAQ layouts collapse further on phones. Tables retain horizontal scrolling, an explanatory mobile hint, and a sticky first shopping-table column. Keep controls available while allowing wide data to scroll.

Reports have an A4 print stylesheet with 18mm page margins, hidden application chrome, visible report tables and method notes, and row break avoidance.

## Elevation & Depth

Depth comes mainly from cream/green tonal layering, borders, and rounded silhouettes. Most application panels are flat. `--shadow` is `0 12px 30px -16px #173d2a30` and appears on the mobile landing menu. Journey labels use `0 5px 12px -7px #194d3b50`; toast feedback uses `0 6px 24px #174d3b22`; Porsi uses a restrained drop shadow. Avoid applying these to every card.

## Shapes

Buttons and compact status labels are full pills. Fields use 10px corners, app links 12px, panels 20px (17px on phones), and procurement previews 24px (18px on phones). The landing journey's asymmetrical elliptical corners are a signature backdrop; the clipboard uses a forest outline, a clipped tab, and 22px corners. These illustrative forms are not the template for dense application tables.

## Components

- **Buttons:** `.btn` has a 1px transparent border, 9px icon gap, and the documented base padding/type. Sun is the landing's prominent action; forest is the application primary. Outline uses transparent fill and forest border, hovering to `#e9eedf`. Large buttons use 16px 35px/18px; small buttons 8px 15px/14px. Hover lifts 2px; active returns to rest; disabled opacity is .5 with a not-allowed cursor. Responsive feature overrides remain in CSS.
- **Fields:** Near-white fill, 1px field-border stroke, rounded corners. Application labels and controls are 14px except specific compact filters. Labels sit above controls; supporting copy sits below. Errors use red. Global keyboard focus is a 3px focus-color outline with 4px offset; upload wrappers use `:focus-within` and 3px offset.
- **Panels and data:** Border/tonal separation, clipped 20px corners, and padded headings. Tables have pale header rows, hairline dividers, and `#f8f9f2` row hover. Status pills remain text-bearing. Preserve tabular numeric alignment and units.
- **Navigation:** Forest fill and near-white text identify the active desktop app link; other links gain a pale green hover. Landing links turn leaf on hover. Mobile landing menu expands under navigation; app bottom navigation has five labeled destinations, with yellow camera emphasis and green active states.
- **Product copy:** No repeated simulation badges, prototype footer, proposal references, or global demo strip. Use direct actions such as “Buka dasbor”. Keep the AI capability limitation in the results view and accurate provenance in exported reports.
- **Tray scanning:** A bounded 4.7-second processing sequence places the selected photo inside a forest-green frame with yellow corner brackets and a 1.1-second alternating light sweep. Before/after layers crossfade in .3s; four text stages retain clear status. Desktop uses two columns, mobile stacks the scanner and status. Focus moves to the heading and stage changes are announced politely. Reduced-motion freezes the line and switches photos without a crossfade. This effect adds feedback, not a computer-vision integration.
- **Porsi and imagery:** Use original `/brand/porsi.png`, `/brand/logo.png`, and `/brand/logo-krem.png`. Porsi accompanies landing, guidance, processing, and empty states. Food trays are illustrative, not pilot evidence. Asset origins are recorded in `public/images/PROVENANCE.json`; preserve that ledger and original artwork.
- **Motion and feedback:** Button state transitions are .18s; app navigation background transition is .15s. Porsi's one-time greeting is .9s with `cubic-bezier(.16,1,.3,1)` only when motion is allowed. Reduced-motion preference disables animation/transitions and smooth scrolling. Toasts move above bottom navigation on phones.

## Do's and Don'ts

- **Do** keep the original brand assets, rounded controls, warm canvas, and green hierarchy.
- **Do** retain explicit labels, keyboard focus, result-screen capability explanations, and mobile table access.
- **Do** check the complete stylesheet cascade before copying responsive type values.
- **Don't** flatten the landing journey into a screenshot or replace interactive controls with artwork.
- **Don't** present generated tray imagery, illustrative results, accuracy, or savings as measured evidence.
- **Don't** treat WANA's domain content as TUNTAS content, redraw supplied Porsi, or add decorative shadows to every panel.
