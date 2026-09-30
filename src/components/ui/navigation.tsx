import * as React from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const navItemVariants = cva("glc-focus inline-flex items-center gap-3 rounded-full font-medium transition-colors", { variants: { orientation: { horizontal: "h-11 px-5 text-sm", vertical: "min-h-11 w-full px-4 text-sm" }, active: { true: "bg-accent text-text-inverse", false: "text-text-secondary hover:bg-surface-hover hover:text-text" } }, defaultVariants: { orientation: "horizontal", active: false } });
export interface NavigationItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof navItemVariants> { icon?: LucideIcon; count?: number }
export const NavigationItem = React.forwardRef<HTMLAnchorElement, NavigationItemProps>(({ className, active, orientation, icon: Icon, count, children, ...props }, ref) => <a ref={ref} aria-current={active ? "page" : undefined} className={cn(navItemVariants({ active, orientation }), className)} {...props}>{Icon && <Icon className="size-4" aria-hidden="true" />}<span>{children}</span>{count !== undefined && <span className={cn("ml-auto rounded-full px-2 py-0.5 text-xs", active ? "bg-white/20" : "bg-accent-soft text-accent")}>{count}</span>}</a>);
NavigationItem.displayName = "NavigationItem";

export function Breadcrumb({ className, ...props }: React.HTMLAttributes<HTMLElement>) { return <nav aria-label="Breadcrumb" className={className} {...props} />; }
export const BreadcrumbList = ({ className, ...props }: React.OlHTMLAttributes<HTMLOListElement>) => <ol className={cn("flex flex-wrap items-center gap-2 text-sm text-text-muted", className)} {...props} />;
export const BreadcrumbItem = ({ className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) => <li className={cn("inline-flex items-center gap-2", className)} {...props} />;
export const BreadcrumbLink = ({ className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a className={cn("glc-focus rounded-sm hover:text-text", className)} {...props} />;
export const BreadcrumbSeparator = () => <ChevronRight className="size-4" aria-hidden="true" />;
export const BreadcrumbPage = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => <span aria-current="page" className={cn("font-medium text-text", className)} {...props} />;
