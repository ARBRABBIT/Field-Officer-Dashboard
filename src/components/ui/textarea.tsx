import * as React from "react";
import { cn } from "@/lib/cn";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { invalid?: boolean }

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, invalid, ...props }, ref) => (
  <textarea ref={ref} aria-invalid={invalid || undefined} className={cn("glc-focus min-h-28 w-full resize-y rounded-xl border bg-surface px-4 py-3 text-sm text-text outline-none transition-[border-color,box-shadow] placeholder:text-text-muted hover:border-border-strong focus:border-accent focus:ring-3 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-(--glc-disabled-opacity)", invalid && "border-danger focus:border-danger focus:ring-danger/15", className)} {...props} />
));
Textarea.displayName = "Textarea";
