"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Button, type ButtonProps } from "./button";

export interface IconButtonProps extends Omit<ButtonProps, "children" | "size"> {
  icon: LucideIcon;
  label: string;
  size?: "sm" | "md" | "lg";
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(({ icon: Icon, label, size = "md", ...props }, ref) => (
  <Button ref={ref} size="icon" aria-label={label} {...props} className={`${size === "sm" ? "size-9" : size === "lg" ? "size-13" : "size-11"} ${props.className ?? ""}`}>
    <Icon className={size === "sm" ? "size-4" : size === "lg" ? "size-6" : "size-5"} aria-hidden="true" />
  </Button>
));
IconButton.displayName = "IconButton";
