import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/cn";

export function Pagination({ className, ...props }: React.HTMLAttributes<HTMLElement>) { return <nav aria-label="Pagination" className={cn("flex items-center justify-center", className)} {...props} />; }
export const PaginationList = ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => <ul className={cn("flex items-center gap-1", className)} {...props} />;
export const PaginationItem = (props: React.HTMLAttributes<HTMLLIElement>) => <li {...props} />;
export interface PaginationLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> { active?: boolean }
export const PaginationLink = ({ active, className, ...props }: PaginationLinkProps) => <a aria-current={active ? "page" : undefined} className={cn("glc-focus inline-flex size-9 items-center justify-center rounded-lg text-sm text-text-secondary hover:bg-surface-hover", active && "bg-accent text-text-inverse hover:bg-accent-hover", className)} {...props} />;
export const PaginationPrevious = (props: PaginationLinkProps) => <PaginationLink aria-label="Previous page" {...props}><ChevronLeft className="size-4" /><span className="sr-only">Previous</span></PaginationLink>;
export const PaginationNext = (props: PaginationLinkProps) => <PaginationLink aria-label="Next page" {...props}><span className="sr-only">Next</span><ChevronRight className="size-4" /></PaginationLink>;
export const PaginationEllipsis = () => <span className="grid size-9 place-items-center text-text-muted" aria-hidden="true"><MoreHorizontal className="size-4" /></span>;
