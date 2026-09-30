export const colors = {
  background: "var(--glc-background)",
  surface: {
    default: "var(--glc-surface)",
    subtle: "var(--glc-surface-subtle)",
    muted: "var(--glc-surface-muted)",
    hover: "var(--glc-surface-hover)",
    selected: "var(--glc-surface-selected)",
  },
  text: {
    primary: "var(--glc-text)",
    secondary: "var(--glc-text-secondary)",
    muted: "var(--glc-text-muted)",
    inverse: "var(--glc-text-inverse)",
  },
  border: { default: "var(--glc-border)", strong: "var(--glc-border-strong)" },
  accent: { default: "var(--glc-accent)", hover: "var(--glc-accent-hover)", soft: "var(--glc-accent-soft)" },
  semantic: {
    success: "var(--glc-success)",
    warning: "var(--glc-warning)",
    danger: "var(--glc-danger)",
    info: "var(--glc-info)",
  },
} as const;

export const spacing = {
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
} as const;

export const radii = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, "2xl": 32, full: 9999 } as const;
export const iconSizes = { xs: 12, sm: 16, md: 20, lg: 24, xl: 32 } as const;
export const controlHeights = { sm: 36, md: 44, lg: 52 } as const;
export const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1440 } as const;
export const zIndex = { base: 0, sticky: 20, dropdown: 40, popover: 50, overlay: 60, dialog: 70, toast: 80, tooltip: 90 } as const;
export const motion = {
  duration: { fast: "120ms", normal: "180ms", slow: "260ms" },
  easing: { standard: "cubic-bezier(0.2, 0, 0, 1)", enter: "cubic-bezier(0, 0, 0.2, 1)", exit: "cubic-bezier(0.4, 0, 1, 1)" },
} as const;

export type ColorTokens = typeof colors;
