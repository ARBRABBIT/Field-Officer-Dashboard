import * as React from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/cn";

export const Table = React.forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(({ className, ...props }, ref) => <div className="w-full overflow-auto rounded-2xl border bg-surface"><table ref={ref} className={cn("w-full caption-bottom border-collapse text-sm", className)} {...props} /></div>);
Table.displayName = "Table";
export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => <thead ref={ref} className={cn("bg-surface-subtle text-left text-xs uppercase tracking-wide text-text-muted [&_tr]:border-b", className)} {...props} />);
TableHeader.displayName = "TableHeader";
export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />);
TableBody.displayName = "TableBody";
export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement> & { selected?: boolean }>(({ className, selected, ...props }, ref) => <tr ref={ref} data-state={selected ? "selected" : undefined} className={cn("border-b transition-colors hover:bg-surface-subtle data-[state=selected]:bg-accent-soft", className)} {...props} />);
TableRow.displayName = "TableRow";
export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => <th ref={ref} className={cn("h-12 px-5 font-semibold", className)} {...props} />);
TableHead.displayName = "TableHead";
export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => <td ref={ref} className={cn("px-5 py-4 align-middle", className)} {...props} />);
TableCell.displayName = "TableCell";
export function SortableTableHead({ direction, children, className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement> & { direction?: "asc" | "desc" | false }) { const Icon = direction === "asc" ? ArrowUp : direction === "desc" ? ArrowDown : ChevronsUpDown; return <TableHead aria-sort={direction === "asc" ? "ascending" : direction === "desc" ? "descending" : "none"} className={className} {...props}><button type="button" className="glc-focus inline-flex items-center gap-2 rounded-md"><span>{children}</span><Icon className="size-3.5" /></button></TableHead>; }
export const TableCaption = ({ className, ...props }: React.HTMLAttributes<HTMLTableCaptionElement>) => <caption className={cn("mt-4 text-sm text-text-muted", className)} {...props} />;
