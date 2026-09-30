"use client";

import * as React from "react";
import { Search, X, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leadingIcon?: LucideIcon;
  trailingIcon?: LucideIcon;
  onClear?: () => void;
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, leadingIcon: LeadingIcon, trailingIcon: TrailingIcon, onClear, invalid, disabled, ...props }, ref) => (
  <div className={cn("glc-focus flex h-11 items-center gap-3 rounded-xl border bg-surface px-4 transition-[border-color,box-shadow,background-color] hover:border-border-strong focus-within:border-accent focus-within:ring-3 focus-within:ring-accent/20", invalid && "border-danger focus-within:border-danger focus-within:ring-danger/15", disabled && "pointer-events-none opacity-(--glc-disabled-opacity)", className)}>
    {LeadingIcon && <LeadingIcon className="size-4 shrink-0 text-text-muted" aria-hidden="true" />}
    <input ref={ref} disabled={disabled} aria-invalid={invalid || undefined} className="min-w-0 flex-1 border-0 bg-transparent text-sm text-text outline-none placeholder:text-text-muted" {...props} />
    {onClear && props.value && <button type="button" onClick={onClear} className="glc-focus rounded-full text-text-muted hover:text-text" aria-label="Clear input"><X className="size-4" /></button>}
    {!onClear && TrailingIcon && <TrailingIcon className="size-4 shrink-0 text-text-muted" aria-hidden="true" />}
  </div>
));
Input.displayName = "Input";

export const SearchInput = React.forwardRef<HTMLInputElement, Omit<InputProps, "type" | "leadingIcon">>((props, ref) => <Input ref={ref} type="search" leadingIcon={Search} {...props} />);
SearchInput.displayName = "SearchInput";
