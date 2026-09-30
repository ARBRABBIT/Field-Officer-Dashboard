"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/cn";

export const buttonVariants = cva(
  "glc-focus inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full border text-sm font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-180 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-(--glc-disabled-opacity) active:translate-y-px",
  {
    variants: {
      variant: {
        primary: "border-accent bg-accent text-text-inverse hover:border-accent-hover hover:bg-accent-hover",
        accent: "border-accent bg-accent text-text-inverse hover:border-accent-hover hover:bg-accent-hover",
        secondary: "border-border bg-surface text-text hover:bg-surface-hover",
        outline: "border-border-strong bg-transparent text-text hover:border-accent hover:text-accent",
        ghost: "border-transparent bg-transparent text-text-secondary hover:bg-surface-hover hover:text-text",
        destructive: "border-danger bg-danger text-text-inverse hover:brightness-90",
        link: "h-auto border-transparent bg-transparent p-0 text-accent underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-5",
        lg: "h-13 px-7 text-base",
        icon: "size-11 p-0",
      },
      fullWidth: { true: "w-full" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild, className, children, disabled, loading, type = "button", variant, size, fullWidth, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={!asChild ? disabled || loading : undefined}
        type={!asChild ? type : undefined}
        aria-busy={loading || undefined}
        ref={ref}
        {...props}
      >
        {loading && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
        {children}
      </Comp>
    );
  },
);
Button.displayName = "Button";
