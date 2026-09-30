import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const badgeVariants = cva("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold", {
  variants: {
    variant: {
      neutral: "border-transparent bg-surface-muted text-text-secondary",
      accent: "border-transparent bg-accent-soft text-accent-hover",
      success: "border-transparent bg-success-soft text-success",
      warning: "border-transparent bg-warning-soft text-warning",
      danger: "border-transparent bg-danger-soft text-danger",
      info: "border-transparent bg-info-soft text-info",
      outline: "border-border-strong bg-transparent text-text-secondary",
    },
  },
  defaultVariants: { variant: "neutral" },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> { dot?: boolean }
export function Badge({ className, variant, dot, children, ...props }: BadgeProps) { return <span className={cn(badgeVariants({ variant }), className)} {...props}>{dot && <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />}{children}</span>; }
