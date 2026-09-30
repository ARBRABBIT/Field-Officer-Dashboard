"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/cn";

export const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root ref={ref} className={cn("glc-focus peer size-5 shrink-0 rounded-sm border border-border-strong bg-surface text-text-inverse transition-colors hover:border-accent data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=indeterminate]:border-accent data-[state=indeterminate]:bg-accent disabled:cursor-not-allowed disabled:opacity-(--glc-disabled-opacity)", className)} {...props}>
    <CheckboxPrimitive.Indicator className="grid place-items-center">
      {props.checked === "indeterminate" ? <Minus className="size-3.5" /> : <Check className="size-3.5" />}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export function CheckboxField({ label, description, id, ...props }: React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> & { label: React.ReactNode; description?: React.ReactNode; id: string }) {
  return <label htmlFor={id} className="flex cursor-pointer items-start gap-3"><Checkbox id={id} {...props} /><span className="grid gap-0.5 text-sm"><span className="font-medium text-text">{label}</span>{description && <span className="text-xs text-text-muted">{description}</span>}</span></label>;
}
