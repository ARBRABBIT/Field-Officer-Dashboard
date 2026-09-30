"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/cn";

export const ToastProvider = ToastPrimitive.Provider;
export const ToastViewport = React.forwardRef<React.ElementRef<typeof ToastPrimitive.Viewport>, React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>>(({ className, ...props }, ref) => <ToastPrimitive.Viewport ref={ref} className={cn("fixed right-0 bottom-0 z-80 flex max-h-screen w-full flex-col gap-3 p-4 sm:max-w-md", className)} {...props} />);
ToastViewport.displayName = ToastPrimitive.Viewport.displayName;
export const Toast = React.forwardRef<React.ElementRef<typeof ToastPrimitive.Root>, React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> & { status?: "success" | "danger" | "neutral" }>(({ className, children, status = "neutral", ...props }, ref) => <ToastPrimitive.Root ref={ref} className={cn("relative flex items-start gap-3 rounded-xl border bg-surface p-4 pr-10 text-sm shadow-medium", status === "success" && "border-success/20", status === "danger" && "border-danger/20", className)} {...props}>{status === "success" && <CheckCircle2 className="size-5 shrink-0 text-success" />}{children}<ToastPrimitive.Close className="glc-focus absolute top-3 right-3 rounded-full p-1 text-text-muted hover:bg-surface-hover" aria-label="Dismiss"><X className="size-4" /></ToastPrimitive.Close></ToastPrimitive.Root>);
Toast.displayName = ToastPrimitive.Root.displayName;
export const ToastTitle = React.forwardRef<React.ElementRef<typeof ToastPrimitive.Title>, React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>>(({ className, ...props }, ref) => <ToastPrimitive.Title ref={ref} className={cn("font-semibold", className)} {...props} />);
ToastTitle.displayName = ToastPrimitive.Title.displayName;
export const ToastDescription = React.forwardRef<React.ElementRef<typeof ToastPrimitive.Description>, React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>>(({ className, ...props }, ref) => <ToastPrimitive.Description ref={ref} className={cn("mt-0.5 text-text-muted", className)} {...props} />);
ToastDescription.displayName = ToastPrimitive.Description.displayName;
