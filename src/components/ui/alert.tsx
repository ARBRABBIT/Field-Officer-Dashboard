import * as React from "react";
import { AlertCircle, CheckCircle2, Info, TriangleAlert, type LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const alertVariants = cva("flex gap-3 rounded-xl border p-4 text-sm", { variants: { variant: { info: "border-info/20 bg-info-soft text-info", success: "border-success/20 bg-success-soft text-success", warning: "border-warning/20 bg-warning-soft text-warning", danger: "border-danger/20 bg-danger-soft text-danger", neutral: "border-border bg-surface text-text-secondary" } }, defaultVariants: { variant: "neutral" } });
const icons: Record<string, LucideIcon> = { info: Info, success: CheckCircle2, warning: TriangleAlert, danger: AlertCircle, neutral: Info };
export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">, VariantProps<typeof alertVariants> { title?: React.ReactNode }
export function Alert({ variant = "neutral", title, children, className, ...props }: AlertProps) { const Icon = icons[variant ?? "neutral"]; return <div role={variant === "danger" ? "alert" : "status"} className={cn(alertVariants({ variant }), className)} {...props}><Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" /><div>{title && <div className="font-semibold">{title}</div>}<div className={cn(title && "mt-1 opacity-85")}>{children}</div></div></div>; }
