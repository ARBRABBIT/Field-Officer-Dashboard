import * as React from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/cn";

export function Spinner({ className, label = "Loading" }: { className?: string; label?: string }) { return <span role="status" className="inline-flex"><LoaderCircle className={cn("size-5 animate-spin", className)} aria-hidden="true" /><span className="sr-only">{label}</span></span>; }
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div aria-hidden="true" className={cn("animate-pulse rounded-lg bg-surface-muted", className)} {...props} />; }
export function Progress({ value = 0, label }: { value?: number; label?: string }) { const safe = Math.min(100, Math.max(0, value)); return <div className="grid gap-2">{label && <div className="flex justify-between text-xs text-text-muted"><span>{label}</span><span>{safe}%</span></div>}<div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={safe} className="h-2 overflow-hidden rounded-full bg-surface-muted"><div className="h-full rounded-full bg-accent transition-[width] duration-260" style={{ width: `${safe}%` }} /></div></div>; }
