# GLC Design System

This repository contains the reusable visual foundations and interface primitives extracted from the `GLC Re-Design` Figma file. The `/design-system` route is an isolated component showcase added by explicit follow-up request; it is not an application screen.

## Source audit

- Figma file: `tzbEkocL66XgcRCSZ05vxn` (`GLC Re-Design`)
- Current top-level page: `Prototype` (`1148:4122`)
- Coverage: 591 top-level frames across Super Admin, Verification Officer, Field Officer, Regional Officer, Intelligence Officer, Advertisement, Sales, Support, CCS, Maintenance, authentication, profiles, detail workflows, overlays, and feedback states.
- The supplied entry node `8411:11568` is absent from the current file structure. Current frame IDs were resolved from the file page through Figma MCP.
- Representative high-fidelity contexts included dashboards, card grids, data tables, dense forms, login, profile, dropdown filters, destructive confirmation, service selection dialog, and toast feedback.

The file is visually broad and contains role-specific accent colors and some one-off values. The implementation normalizes these into a shared neutral foundation with Operational Blue as the single primary action color. Field lime is reserved for data visualization and supporting highlights.

## Design principles

1. Calm operational surfaces: soft gray canvases, white cards, quiet borders, and restrained elevation.
2. Rounded but structured: pill actions and filters; 12–32px containers depending on hierarchy.
3. Compact information density: 12–14px operational copy, clear 18–24px hierarchy, and predictable 44px controls.
4. Semantic color first: status meaning is independent from role accent.
5. Composition over screen-specific components: screens should be assembled from primitives in `src/components/ui`.

## Foundations

### Typography

Plus Jakarta Sans is the primary system font and is loaded by `next/font`. Figma occasionally contains Inter, Poppins, Outfit, Manrope, and placeholder/system fonts; these were normalized to Plus Jakarta Sans because the dominant product hierarchy and all recent flows use it.

- `text-display`: 40/45, bold
- `text-title`: 24/32, semibold
- `text-heading`: 18/26, semibold
- `text-body`: 14/22, regular
- `text-label`: 12/16, semibold
- `text-caption`: 10/14, medium

### Spacing

Use the 4px base rhythm exported from `src/design-system/tokens`. The common component steps are 8, 12, 16, 20, 24, 32, 40, 48, and 64px. Avoid introducing one-off spacing until repeated evidence justifies a token.

### Radius

- 4px: small tags and compact inner elements
- 8px: table controls and small fields
- 12px: inputs, menus, status containers
- 16px: cards and alerts
- 24px: prominent cards and panels
- 32px: large shell surfaces and dialogs
- full: buttons, tabs, chips, avatars

### Color roles

- `accent`: Operational Blue used for primary actions across every GLC role and workflow
- `surface`: white content cards
- `surface-subtle` / `surface-muted`: nested controls and low-emphasis regions
- `success`, `warning`, `danger`, `info`: semantic statuses with paired soft backgrounds

Do not use status colors as generic decoration. Do not add dark mode unless it appears in a future approved design source.

### Elevation and layering

Use `shadow-low` for small floating controls, `shadow-medium` for menus/cards/toasts, and `shadow-high` for modal surfaces. Semantic z-index levels are exported for sticky content, dropdowns, popovers, overlays, dialogs, toasts, and tooltips.

### Icons

Use Lucide icons at 16px inside compact controls, 20px for standard controls, and 24px for prominent actions. Default stroke icons inherit current text color. A Figma icon that cannot be matched accurately must be preserved as a typed local SVG component rather than approximated.

## Component inventory and states

### Actions

- `Button`: primary, accent, secondary, outline, ghost, destructive, link; sm/md/lg/icon; hover, pressed, focus-visible, disabled, loading
- `IconButton`: sm/md/lg, accessible label, all Button states

### Forms

- `FormField`: label, required/optional annotation, hint, error
- `Input` / `SearchInput`: icons, clear action, default, hover, focus, filled, invalid, disabled, read-only
- `Textarea`: default, hover, focus, invalid, disabled
- `Select`: closed, open, selected, focused, disabled, invalid
- `Checkbox`: unchecked, checked, indeterminate, focus, disabled
- `RadioGroup`: unselected, selected, focus, disabled
- `Switch`: off, on, focus, disabled
- `FileUpload`: empty, hover, focus, invalid, disabled through the native input

### Content

- `Card`: default, bordered, elevated, interactive, selected; header/title/description/content/footer slots
- `Badge`: neutral, brand, accent, success, warning, danger, info, outline; optional status dot
- `Avatar`: image, initials fallback, sm/md/lg/xl, optional presence
- `Table`: semantic table slots, selected row, sortable header, caption
- `EmptyState`, `Divider`

### Navigation

- `NavigationItem`: horizontal/vertical, default, hover, active, count
- `Tabs`: pill/segmented treatment, active, hover, focus, disabled
- `Breadcrumb`
- `Pagination`: active, default, disabled through native anchor semantics, ellipsis

### Overlays

- `Dialog`: overlay, header/body/footer, close, focus management
- `Drawer`: left/right/bottom, overlay, header/body/footer
- `Popover`, `DropdownMenu`, `Tooltip`

Radix supplies keyboard navigation, focus management, dismissal, and portals. GLC tokens supply all visible styling.

### Feedback and progress

- `Alert`: neutral, info, success, warning, danger
- `Toast`: neutral, success, danger
- `Spinner`, `Skeleton`, `Progress`

## Folder structure

```text
src/
  app/                 Next.js layout and isolated design-system showcase
  components/ui/       reusable GLC components
  design-system/tokens centralized TypeScript tokens
  lib/cn.ts            class composition helper
  styles/globals.css   CSS variables, Tailwind theme, typography utilities
```

## Creating a component

1. Confirm the pattern repeats or represents a stable semantic primitive.
2. Reuse existing color, type, spacing, radius, elevation, and motion tokens.
3. Prefer composition and slots to unrelated boolean props.
4. Use CVA only for intentional visual variants.
5. Include semantic HTML, keyboard behavior, focus-visible, disabled semantics, and labels.
6. Export the component and its useful types from `src/components/ui/index.ts`.
7. Document new intentional variants here.

## Creating a future screen

Start with `Container`, `Section`, `Stack`, `Inline`, and `Grid`. Compose cards, forms, navigation, tables, and overlays from the UI barrel export. Use Operational Blue for primary actions and never redefine the action palette inside a screen. New screen-specific arrangements stay at the application layer and must not be moved into the design system unless they become repeated product-wide patterns.

## Extending tokens safely

Add a token only when the value is genuinely distinct, repeated, and semantic. Add the CSS variable in `globals.css`, map it through Tailwind's `@theme`, and export it from `src/design-system/tokens`. Avoid raw hex values or arbitrary radii in component code.
