import * as React from "react";
import { cn } from "@/lib/cn";

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) { return <div className={cn("mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10", className)} {...props} />; }
export function Stack({ gap = "md", className, ...props }: React.HTMLAttributes<HTMLDivElement> & { gap?: "xs" | "sm" | "md" | "lg" | "xl" }) { const gaps = { xs: "gap-1", sm: "gap-2", md: "gap-4", lg: "gap-6", xl: "gap-8" }; return <div className={cn("flex flex-col", gaps[gap], className)} {...props} />; }
export function Inline({ gap = "md", align = "center", wrap = true, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { gap?: "xs" | "sm" | "md" | "lg"; align?: "start" | "center" | "end"; wrap?: boolean }) { const gaps = { xs: "gap-1", sm: "gap-2", md: "gap-4", lg: "gap-6" }; const aligns = { start: "items-start", center: "items-center", end: "items-end" }; return <div className={cn("flex", gaps[gap], aligns[align], wrap && "flex-wrap", className)} {...props} />; }
export function Grid({ columns = 3, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { columns?: 1 | 2 | 3 | 4 }) { const cols = { 1: "grid-cols-1", 2: "grid-cols-1 md:grid-cols-2", 3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3", 4: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4" }; return <div className={cn("grid gap-6", cols[columns], className)} {...props} />; }
export function Section({ className, ...props }: React.HTMLAttributes<HTMLElement>) { return <section className={cn("py-8 lg:py-12", className)} {...props} />; }
