import * as React from "react";
import { cn } from "@/lib/cn";

export interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  optional?: boolean;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function FormField({ label, htmlFor, required, optional, hint, error, className, children }: FormFieldProps) {
  return (
    <div className={cn("grid gap-2", className)} data-invalid={Boolean(error) || undefined}>
      {label && (
        <label htmlFor={htmlFor} className="text-label text-text-secondary">
          {label}{required && <span className="ml-1 text-danger" aria-hidden="true">*</span>}{optional && <span className="ml-1 font-normal text-text-muted">(optional)</span>}
        </label>
      )}
      {children}
      {(error || hint) && <div className={cn("text-xs", error ? "text-danger" : "text-text-muted")}>{error ?? hint}</div>}
    </div>
  );
}
