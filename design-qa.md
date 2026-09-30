# Design QA

Source: https://photos.gibsonchu.com/
Implementation: http://127.0.0.1:4174/
Evidence folder: ../photography-source/

Source visual truth: home.png, gallery.png, home-mobile.png, gallery-mobile.png, info-mobile.png, index-mobile.png.
Implementation captures: corresponding local-*.png files.
Full-view side-by-side evidence: compare-home.png, compare-gallery.png, compare-home-mobile.png, compare-gallery-mobile.png, compare-info-mobile.png, compare-index-mobile.png.
Desktop captures: 1440 × 1000 pixels, 1440 × 1000 CSS viewport, DPR 1.
Mobile captures: 390 × 844 pixels, 390 × 844 CSS viewport, DPR 1. Earlier temporary zoomed source captures were replaced before comparison.
States: first homepage photograph, project index, Personal project over index, information overlay, image viewer. Full-view comparisons also expose the header, image edges, grid gaps, caption wrapping, and footer; separate region crops were unnecessary.

## Comparison history

1. P2 gallery spacing: initial block media plus two breaks produced an extra text line before the grid. Hide the first break following a figure. Post-fix compare-gallery.png and compare-gallery-mobile.png match image positions and column gaps.
2. P2 index spacing: missing gallery gutter after header. Restore one gutter above index grid; verified in desktop and mobile captures.
3. P2 mobile caption overflow: long names exceeded narrow five-column tracks. Apply overflow-wrap:anywhere, matching the source's word wrapping. Final browser measurements show all caption scroll widths equal client widths.
4. P3 slideshow vertical offset: corrected the desktop half-padding difference of 0.05rem.

## Fidelity surfaces

- Typography: original locally hosted Cargo Diatype variable font; source size formula, 550 body / 450 caption weights, 1.2 line height, and original wrapping retained.
- Layout: desktop 50% right-hand gallery, full-width mobile gallery, original five-column index, two-column image grids, unchanged aspect ratios and order, matching padding and gutters.
- Color: source black at 85%, white backgrounds, 95% white overlay, 40% footer; source lightbox SVG path geometry retained.
- Assets: 153 original Cargo photographs locally hosted as 2000px renditions, all decode verified. Source mobile Cargo renditions can appear softer than these files; this is an acceptable image-resolution difference. No invented or substituted imagery.
- Copy: original content and external destinations preserved, including source spelling and publication titles. Source's unlinked gallery routes also retained.

## Functional verification

All eight linked gallery routes render directly without horizontal overflow. Homepage previous/next and keyboard navigation, project opening, image enlargement, viewer next, close-to-gallery, and gallery close-to-index verified in browser. Mobile homepage, gallery, information and index compared. Console error log empty. Build passed and four hosting/route tests passed.

Residual coverage: representative gallery visual comparison rather than every scrolled photo at every breakpoint; every local photo file verified separately. Pointer and keyboard viewer controls tested; touch handlers implemented but physical-device gestures not tested.

final result: passed
