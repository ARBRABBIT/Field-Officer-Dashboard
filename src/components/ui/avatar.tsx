import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  status?: "online" | "offline" | "busy";
}

const sizes = { sm: "size-8 text-xs", md: "size-10 text-sm", lg: "size-13 text-base", xl: "size-20 text-xl" };
export function Avatar({ src, alt, fallback, size = "md", status, className, ...props }: AvatarProps) {
  const initials = fallback ?? alt.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return <span className={cn("relative inline-grid shrink-0 place-items-center overflow-visible rounded-full bg-accent-soft font-semibold text-accent-hover", sizes[size], className)} {...props}>{src ? <Image src={src} alt={alt} fill sizes="80px" unoptimized className="rounded-full object-cover" /> : <span aria-label={alt}>{initials}</span>}{status && <span className={cn("absolute right-0 bottom-0 z-10 size-2.5 rounded-full border-2 border-surface", status === "online" && "bg-success", status === "offline" && "bg-border-strong", status === "busy" && "bg-danger")} aria-label={status} />}</span>;
}
