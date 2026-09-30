"use client";

import * as React from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/cn";

export interface FileUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> { title?: string; description?: string; invalid?: boolean }
export const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(({ className, title = "Drag and drop files", description = "or browse from your device", invalid, id, ...props }, ref) => {
  const generated = React.useId(); const inputId = id ?? generated;
  return <label htmlFor={inputId} className={cn("glc-focus flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed bg-surface-subtle px-6 py-8 text-center transition-colors hover:border-accent hover:bg-accent-soft/40", invalid && "border-danger bg-danger-soft/30", className)}><span className="mb-3 grid size-10 place-items-center rounded-full bg-accent-soft text-accent"><UploadCloud className="size-5" /></span><span className="text-sm font-semibold text-text">{title}</span><span className="mt-1 text-xs text-text-muted">{description}</span><input ref={ref} id={inputId} type="file" className="sr-only" aria-invalid={invalid || undefined} {...props} /></label>;
});
FileUpload.displayName = "FileUpload";
