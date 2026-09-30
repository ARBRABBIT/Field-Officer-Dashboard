import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

export function EmptyState({ icon: Icon, title, description, action, className }: { icon?: LucideIcon; title: React.ReactNode; description?: React.ReactNode; action?: React.ReactNode; className?: string }) { return <div className={cn("flex flex-col items-center rounded-2xl border border-dashed bg-surface-subtle px-6 py-12 text-center", className)}>{Icon && <span className="mb-4 grid size-12 place-items-center rounded-full bg-accent-soft text-accent"><Icon className="size-6" /></span>}<h3 className="text-heading">{title}</h3>{description && <p className="mt-2 max-w-md text-sm text-text-muted">{description}</p>}{action && <div className="mt-6">{action}</div>}</div>; }
