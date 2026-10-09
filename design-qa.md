# Design QA

## Reference

- Authoritative desktop source: the approved editorial homepage reconstructed from `static-site/chunks/`.
- Public target: GitHub Pages at `https://arqadriantaberna-a11y.github.io/arq-adrian-taberna/`.
- Desktop design remains untouched; the refinement layer is scoped entirely to `@media (max-width: 760px)`.

## Mobile audit addressed

- Removed horizontal overflow and constrained long headings, links and project metadata.
- Rebuilt the phone menu as a compact full-screen index while keeping all destinations available.
- Balanced hero typography, controls, pagination and safe vertical spacing for small screens.
- Normalized one-column architecture cards and expanded case studies.
- Kept technical drawings, furniture and object images fully visible instead of cropped.
- Made furniture/object dialogs fit the dynamic mobile viewport with touch-sized controls.
- Stacked newsletter, profile, experience and contact layouts without changing their desktop grids.
- Preserved native details/dialog semantics and 16 px form input sizing.

## Desktop protection

Every selector in `static-site/mobile-only.css` lives inside a max-width media query. No base or desktop declaration was changed.

## Result

Mobile refinement prepared for 390–430 px phones; desktop presentation preserved.
