"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronUp,
  Layers,
  LayoutDashboard,
  MapPin,
  Palette,
} from "lucide-react";

export function NavigationSwitcher() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  const isDesignSystem = pathname?.startsWith("/design-system");
  const isSiteVisits = pathname?.startsWith("/site-visits");
  const isAssignedServices = !isDesignSystem && !isSiteVisits;

  return (
    <div
      aria-label="Navigation switcher"
      className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2 font-sans select-none"
    >
      {/* Expanded Menu of Screens / Pages */}
      {isOpen && (
        <div className="w-80 rounded-2xl border border-border bg-surface p-3 shadow-high animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="mb-2 px-2 py-1 border-b border-border/50 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Available Pages & Screens
            </span>
            <span className="text-[10px] font-semibold bg-accent-soft text-accent px-2 py-0.5 rounded-full">
              GLC System
            </span>
          </div>

          <div className="space-y-1">
            {/* Screen 1: Field Officer Dashboard / Maintenance Services */}
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-colors cursor-pointer ${
                isAssignedServices
                  ? "bg-accent text-text-inverse font-semibold shadow-low"
                  : "hover:bg-surface-hover text-text hover:text-accent"
              }`}
            >
              <div
                className={`grid size-7 place-items-center rounded-lg ${
                  isAssignedServices ? "bg-white/20 text-white" : "bg-surface-muted text-text-secondary"
                }`}
              >
                <LayoutDashboard className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-semibold">Maintenance Services</p>
                <p className={`text-[10px] truncate ${isAssignedServices ? "text-white/80" : "text-text-muted"}`}>
                  Field Officer Dashboard (/)
                </p>
              </div>
              {isAssignedServices && (
                <span className="size-2 rounded-full bg-white shrink-0" />
              )}
            </Link>

            {/* Screen 2: Site Visit Details */}
            <Link
              href="/site-visits"
              onClick={() => setIsOpen(false)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-colors cursor-pointer ${
                isSiteVisits
                  ? "bg-accent text-text-inverse font-semibold shadow-low"
                  : "hover:bg-surface-hover text-text hover:text-accent"
              }`}
            >
              <div
                className={`grid size-7 place-items-center rounded-lg ${
                  isSiteVisits ? "bg-white/20 text-white" : "bg-surface-muted text-text-secondary"
                }`}
              >
                <MapPin className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-semibold">Site Visit Details</p>
                <p className={`text-[10px] truncate ${isSiteVisits ? "text-white/80" : "text-text-muted"}`}>
                  Inspection entry form (/site-visits)
                </p>
              </div>
              {isSiteVisits && (
                <span className="size-2 rounded-full bg-white shrink-0" />
              )}
            </Link>

            {/* Design System Showcase */}
            <Link
              href="/design-system"
              onClick={() => setIsOpen(false)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-colors cursor-pointer ${
                isDesignSystem
                  ? "bg-accent text-text-inverse font-semibold shadow-low"
                  : "hover:bg-surface-hover text-text hover:text-accent"
              }`}
            >
              <div
                className={`grid size-7 place-items-center rounded-lg ${
                  isDesignSystem ? "bg-white/20 text-white" : "bg-surface-muted text-text-secondary"
                }`}
              >
                <Palette className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-semibold">Design System Showcase</p>
                <p className={`text-[10px] truncate ${isDesignSystem ? "text-white/80" : "text-text-muted"}`}>
                  Tokens, UI Primitives (/design-system)
                </p>
              </div>
              {isDesignSystem && (
                <span className="size-2 rounded-full bg-white shrink-0" />
              )}
            </Link>
          </div>
        </div>
      )}

      {/* Floating Action Pill Bar */}
      <div className="flex items-center gap-1.5 rounded-full border border-border/80 bg-surface/95 p-1.5 shadow-high backdrop-blur-md">
        {/* Button: Pages Menu Toggle */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`glc-focus inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
            !isDesignSystem
              ? "bg-accent text-text-inverse shadow-low"
              : "text-text hover:bg-surface-hover hover:text-accent"
          }`}
          title="Browse Available Pages"
        >
          <Layers className="size-4" />
          <span>{isSiteVisits ? "Site Visits" : "Pages"}</span>
        </button>

        {/* Button: Design System */}
        <Link
          href="/design-system"
          onClick={() => setIsOpen(false)}
          className={`glc-focus inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
            isDesignSystem
              ? "bg-accent text-text-inverse shadow-low"
              : "text-text hover:bg-surface-hover hover:text-accent"
          }`}
          title="Go to GLC Design System Showcase"
        >
          <Palette className="size-4" />
          <span>Design System</span>
        </Link>

        {/* Toggle Menu Dropdown Icon Button */}
        <button
          type="button"
          aria-expanded={isOpen}
          aria-label="Toggle page menu"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`glc-focus grid size-8 place-items-center rounded-full transition-colors cursor-pointer ${
            isOpen
              ? "bg-surface-muted text-text rotate-180"
              : "text-text-muted hover:bg-surface-hover hover:text-text"
          }`}
        >
          <ChevronUp className="size-4 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
}
