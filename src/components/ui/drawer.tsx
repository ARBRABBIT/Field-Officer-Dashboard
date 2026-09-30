"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { DialogOverlay } from "./dialog";

const drawerVariants = cva("fixed z-70 flex bg-surface shadow-high outline-none data-[state=open]:animate-in data-[state=closed]:animate-out", { variants: { side: { right: "inset-y-0 right-0 w-[min(28rem,90vw)] flex-col border-l", left: "inset-y-0 left-0 w-[min(28rem,90vw)] flex-col border-r", bottom: "inset-x-0 bottom-0 max-h-[90dvh] flex-col rounded-t-2xl border-t" } }, defaultVariants: { side: "right" } });
export const Drawer = DialogPrimitive.Root;
export const DrawerTrigger = DialogPrimitive.Trigger;
export const DrawerClose = DialogPrimitive.Close;
export interface DrawerContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>, VariantProps<typeof drawerVariants> {}
export const DrawerContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, DrawerContentProps>(({ side, className, children, ...props }, ref) => <DialogPrimitive.Portal><DialogOverlay /><DialogPrimitive.Content ref={ref} className={cn(drawerVariants({ side }), className)} {...props}>{children}<DialogPrimitive.Close className="glc-focus absolute top-5 right-5 rounded-full p-1 text-text-muted hover:bg-surface-hover" aria-label="Close drawer"><X className="size-5" /></DialogPrimitive.Close></DialogPrimitive.Content></DialogPrimitive.Portal>);
DrawerContent.displayName = "DrawerContent";
export const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("border-b p-6 pr-14", className)} {...props} />;
export const DrawerBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("min-h-0 flex-1 overflow-auto p-6", className)} {...props} />;
export const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("border-t p-6", className)} {...props} />;
export const DrawerTitle = DialogPrimitive.Title;
export const DrawerDescription = DialogPrimitive.Description;
