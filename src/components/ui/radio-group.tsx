"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/cn";

export const RadioGroup = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Root>, React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>>(({ className, ...props }, ref) => <RadioGroupPrimitive.Root ref={ref} className={cn("grid gap-3", className)} {...props} />);
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export const RadioItem = React.forwardRef<React.ElementRef<typeof RadioGroupPrimitive.Item>, React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item ref={ref} className={cn("glc-focus grid size-5 shrink-0 place-items-center rounded-full border border-border-strong bg-surface hover:border-accent data-[state=checked]:border-accent disabled:opacity-(--glc-disabled-opacity)", className)} {...props}>
    <RadioGroupPrimitive.Indicator className="size-2.5 rounded-full bg-accent" />
  </RadioGroupPrimitive.Item>
));
RadioItem.displayName = RadioGroupPrimitive.Item.displayName;
