"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/cn";

export const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root ref={ref} className={cn("glc-focus inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full bg-border-strong p-0.5 transition-colors data-[state=checked]:bg-success disabled:cursor-not-allowed disabled:opacity-(--glc-disabled-opacity)", className)} {...props}>
    <SwitchPrimitive.Thumb className="block size-5 rounded-full bg-surface shadow-low transition-transform duration-180 data-[state=checked]:translate-x-5" />
  </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;
