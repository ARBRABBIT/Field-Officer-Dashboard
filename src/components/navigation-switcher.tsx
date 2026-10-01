"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronUp,
  GripVertical,
  Layers,
  LayoutDashboard,
  MapPin,
  Palette,
} from "lucide-react";

export function NavigationSwitcher() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const [position, setPosition] = React.useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const widgetRef = React.useRef<HTMLDivElement | null>(null);
  const dragStartRef = React.useRef<{
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    hasMoved: boolean;
  }>({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
    hasMoved: false,
  });

  const isDesignSystem = pathname?.startsWith("/design-system");
  const isSiteVisits = pathname?.startsWith("/site-visits");
  const isAssignedServices = !isDesignSystem && !isSiteVisits;

  // Initialize position on client
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const updateDefaultPos = () => {
        const x = Math.max(16, window.innerWidth - 320);
        const y = Math.max(16, window.innerHeight - 76);
        setPosition((prev) => (prev ? prev : { x, y }));
      };
      updateDefaultPos();
      window.addEventListener("resize", updateDefaultPos);
      return () => window.removeEventListener("resize", updateDefaultPos);
    }
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only trigger drag from primary button
    if (e.button !== 0) return;
    const currentRect = widgetRef.current?.getBoundingClientRect();
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position ? position.x : currentRect ? currentRect.left : 100,
      initialY: position ? position.y : currentRect ? currentRect.top : 100,
      hasMoved: false,
    };
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;

    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      dragStartRef.current.hasMoved = true;
    }

    if (dragStartRef.current.hasMoved) {
      const widgetWidth = widgetRef.current?.offsetWidth || 280;
      const widgetHeight = widgetRef.current?.offsetHeight || 50;
      const maxX = Math.max(10, window.innerWidth - widgetWidth - 10);
      const maxY = Math.max(10, window.innerHeight - widgetHeight - 10);

      const nextX = Math.min(Math.max(10, dragStartRef.current.initialX + dx), maxX);
      const nextY = Math.min(Math.max(10, dragStartRef.current.initialY + dy), maxY);

      setPosition({ x: nextX, y: nextY });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {}
    }
  };

  const isMenuAbove = position ? position.y > 340 : true;

  return (
    <div
      ref={widgetRef}
      aria-label="Navigation switcher"
      style={
        position
          ? {
              left: `${position.x}px`,
              top: `${position.y}px`,
              position: "fixed",
            }
          : {
              right: "24px",
              bottom: "24px",
              position: "fixed",
            }
      }
      className={`z-[9999] flex flex-col font-sans select-none transition-shadow ${
        isMenuAbove ? "items-end" : "items-end"
      }`}
    >
      {/* Expanded Menu of Screens / Pages */}
      {isOpen && (
        <div
          className={`w-80 rounded-2xl border border-border bg-surface p-3 shadow-2xl animate-in fade-in duration-150 ${
            isMenuAbove ? "mb-2 order-first" : "mt-2 order-last"
          }`}
        >
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

      {/* Floating Action Pill Bar (Draggable) */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`flex items-center gap-1.5 rounded-full border border-border/80 bg-surface/95 p-1.5 shadow-2xl backdrop-blur-md cursor-grab active:cursor-grabbing ${
          isDragging ? "ring-2 ring-accent shadow-2xl scale-[1.02]" : "hover:shadow-2xl"
        } transition-transform`}
      >
        {/* Grip Handle Indicator */}
        <div
          title="Drag to move anywhere"
          className="grid size-6 place-items-center text-text-muted/70 hover:text-text cursor-grab active:cursor-grabbing pl-1"
        >
          <GripVertical className="size-4" />
        </div>

        {/* Button: Pages Menu Toggle */}
        <button
          type="button"
          onClick={(e) => {
            if (dragStartRef.current.hasMoved) {
              e.preventDefault();
              return;
            }
            setIsOpen((prev) => !prev);
          }}
          className={`glc-focus inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
            !isDesignSystem
              ? "bg-accent text-text-inverse shadow-low"
              : "text-text hover:bg-surface-hover hover:text-accent"
          }`}
          title="Browse Available Pages"
        >
          <Layers className="size-3.5" />
          <span>{isSiteVisits ? "Site Visits" : "Pages"}</span>
        </button>

        {/* Button: Design System */}
        <Link
          href="/design-system"
          onClick={(e) => {
            if (dragStartRef.current.hasMoved) {
              e.preventDefault();
              return;
            }
            setIsOpen(false);
          }}
          className={`glc-focus inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
            isDesignSystem
              ? "bg-accent text-text-inverse shadow-low"
              : "text-text hover:bg-surface-hover hover:text-accent"
          }`}
          title="Go to GLC Design System Showcase"
        >
          <Palette className="size-3.5" />
          <span>Design System</span>
        </Link>

        {/* Toggle Menu Dropdown Icon Button */}
        <button
          type="button"
          aria-expanded={isOpen}
          aria-label="Toggle page menu"
          onClick={(e) => {
            if (dragStartRef.current.hasMoved) {
              e.preventDefault();
              return;
            }
            setIsOpen((prev) => !prev);
          }}
          className={`glc-focus grid size-7 place-items-center rounded-full transition-colors cursor-pointer ${
            isOpen
              ? "bg-surface-muted text-text rotate-180"
              : "text-text-muted hover:bg-surface-hover hover:text-text"
          }`}
        >
          <ChevronUp className="size-3.5 transition-transform duration-200" />
        </button>
      </div>
    </div>
  );
}
