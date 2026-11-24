# Prototype validation — 19 November 2026

## Passed

- Next.js production build, static generation of all routes, and TypeScript check.
- Browser navigation from landing to dashboard, capture, results, history, shopping and reports.
- Dashboard school filter changes sample totals and displayed data.
- Capture rejects missing photo pairs; selecting example photos completes the three-step flow.
- Simulated result is stored, editable, and preserved after a page reload. Editing vegetable leftover from 32% to 25% recalculates estimated sample waste.
- History displays an empty state for a query with no matching menu.
- Shopping at 500 portions and 5% buffer totals Rp2,942,813 with the default ingredients, stock and prices. Exported CSV was downloaded and inspected, including rows and total.
- Zero shopping portions disables export and shows validation feedback.
- Current pages /, /dasbor/, /foto/, /hasil/, /belanja/, /laporan/ have document scrollWidth equal to clientWidth at 390, 768 and 1536 CSS-pixel viewport widths. Wide tables scroll inside their containers.
- No browser console errors during the final route/viewport pass.
- Fresh independent finish review: ship as an interactive prototype, no material blocker within supplied screenshot and code-review scope. Approved concept B topology is preserved.

## Verification limits

- Native browser file-chooser automation was interrupted by a session expiry; device-file upload has not been exercised end-to-end. Its format/size handling, image conversion, and storage implementation were reviewed.
- Browser automation could not commit date-field edits, so date filtering was reviewed in code but not confirmed through native date-input interaction.
- Printed PDF output, complete keyboard traversal and instrumented contrast measurements were not independently checked.
- The native Impeccable binary/detector was unavailable. Screenshots and code were reviewed instead.
- This is not an accuracy or field-impact validation. Every new capture uses fixed simulation percentages, even for uploaded photos.

## Publication

A private Sites project identity is recorded in .openai/hosting.json. Source upload/publication did not run: automatic approval review rejected transferring source and static assets to the external Sites repository without explicit user permission for that destination. Do not retry or use another upload path without that permission.

## Evidence

The workspace-level .impeccable/review directory contains desktop and mobile browser captures. Original assets and generation prompts are documented in public/images/PROVENANCE.json.

## Copy refinement

Removed repeated simulation badges, global demo banner, proposal wording, and prototype footers at the user's request. Navigation now uses product actions such as “Buka dasbor”. The result-screen explanation and exported simulation provenance remain. Production build and TypeScript passed again; rendered landing and dashboard were checked, with no global simulation label/banner and no dashboard document overflow. Latest landing capture: ../.impeccable/review/preview-clean.jpg.

## Tray-scan interaction

Added a photo-based scan transition to the existing capture flow: bounded 4.7-second lifetime, yellow moving light, corner frame, before/after crossfade, four stages, and final check. CSS includes a stationary reduced-motion alternative. No AI service or photo measurement was added.

Production build and TypeScript pass. Browser-tested at 390px and 1366px using example photos: scan animation computed as tray-sweep, focus at scanner-title, no mobile document overflow, before/after transition visible, and automatic result navigation reached on both viewports. Captures: ../.impeccable/review/scanning-mobile.jpg and scanning-desktop.jpg. Reduced-motion behavior was inspected in CSS, not exercised with a device preference change.

## User-supplied demo photograph

Default before image is now the user's original five-compartment steel-tray photo, copied unchanged (SHA-256 equality confirmed). After image was edited with image_gen.imagegen to preserve the same tray, wood table, lighting and plastic lid while reducing the meal to leftovers. Exact prompt and source are recorded in public/images/ompreng-demo.provenance.json and the main provenance ledger.

Default demo meal names now match potato, fried chicken, green beans/carrot/edamame, and green grapes. Previously saved records were not reset. Both default photos use background-size contain, and the scanner uses the source 1339:1059 aspect ratio.

Production build/TypeScript passed. Browser checks at 1280px confirmed the two new image URLs in the photo selector, contain rendering, new after image in the scan layer, no document overflow during scan, and navigation to a result with the matching menu/components. Screenshot: ../.impeccable/review/new-demo-photos.jpg.

## WANA-inspired motion — 23 November 2026

Added two alpha-transparent Porsi variants (camera and clipboard); both retain the original as reference and have exact prompts in public/brand/POSES.provenance.json. Original mascot remains the landing focal asset.

Added once-per-session welcome/replay, explicit skip, Porsi greeting, interactive workflow steps, one-shot text/photo/card/chart reveals, app panel transitions, and 230ms capture-step transitions. Native CSS/Web Animations API only. Reduced-motion and tab-hidden/unmount cleanup are implemented.

Production build and TypeScript passed. Browser checks confirmed greeting text, stage-specific links, intro status/inert content then restored page, all three stage controls visible at 390/820/1536px, no landing overflow at these widths, correct planning/camera pose URLs, no mobile capture/shopping overflow, full example-photo capture to results, and no console errors. Reduced-motion was inspected in implementation, not exercised by changing device preferences. CDP full-page screenshot capture timed out; the documented native screenshot alternative worked. Mobile greeting evidence is saved in ../.impeccable/review/porsi-motion-mobile.jpg.


## Mobile camera and gallery - 23 November 2026

Added an explicit rear-camera request, QRIS-style tray corner frame, large shutter, photo review/retake/confirm, and gallery selection inside the camera screen. Camera tracks stop on review, close, unmount, or hidden tab; late permission responses are disposed after closing. Permission failures offer retry and gallery. Microphone is never requested. Images keep the complete frame, resize to a maximum 900px edge, and encode JPEG at 0.7 quality before local storage.

The pair selector provides separate camera and gallery actions for before/after photos, stacks vertically on phones, hides form navigation while the camera is open, and restores focus to the originating camera button. Existing sample photos and staged result animation remain available.

Production build and TypeScript passed. Browser verification at 390x844 confirmed camera opening/closing, heading focus and return focus, gallery uploads both directly and inside the camera screen, review/confirmation, and progression with both uploaded photos to the final review. No horizontal overflow; the 76px shutter stays above mobile navigation. Camera viewfinder and container both measure 324px wide. Screenshots: ../.impeccable/review/mobile-camera.jpg and mobile-camera-preview.jpg.

The test browser left live camera permission pending, so physical camera capture, permission denial/retry, and real iOS/Android hardware behavior remain unverified. Live camera requires HTTPS or localhost; a phone visiting a plain HTTP LAN address can use the gallery fallback. Framing assists composition only; no live food detection or AI measurement was added.


## Consistency cleanup — 24 November 2026

- The first component is now named "Karbohidrat" everywhere (data, dashboard, reports, landing copy). Records saved in the browser under the old "Kentang" name are renamed on load.
- "Ayam panggang & capcai" now records "Nasi putih" as its carbohydrate instead of "Kentang panggang".
- Shopping defaults now follow the demo menu: kentang, ayam, buncis/wortel/edamame and anggur hijau. The Rp2,942,813 figure above used the old ingredient list. With the new defaults, 500 portions at a 5% buffer total Rp5,729,500 (calculated, not browser-tested).
- The dashboard period label now says "7 hari hingga catatan terakhir", matching how it filters.
- The report period defaults to the calendar month of the latest record instead of a fixed November 2026 range.
