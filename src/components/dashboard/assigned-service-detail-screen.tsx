"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  ChevronDown,
  ClipboardList,
  Droplets,
  FileCheck,
  FileText,
  LandPlot,
  Leaf,
  MapPin,
  Minus,
  Plus,
  Sprout,
  Tractor,
} from "lucide-react";
import { Avatar } from "@/components/ui";
import { ServiceRecord } from "./assigned-services-screen";
import { GenerateEstimationScreen } from "./generate-estimation-screen";

export interface AssignedServiceDetailScreenProps {
  record: ServiceRecord;
  onBack: () => void;
  onProceedToWorkOrder?: (record: ServiceRecord) => void;
}

function GLCLogo() {
  return (
    <div className="flex items-center gap-3">
      {/* 4-quadrant GLC geometric brand mark */}
      <div className="relative size-10 grid grid-cols-2 gap-0.5 p-1 rounded-lg bg-surface border border-border/40 shadow-low">
        <span className="rounded-xs bg-[#bdd327]" />
        <span className="rounded-xs bg-success" />
        <span className="rounded-xs bg-accent" />
        <span className="rounded-xs bg-accent-hover" />
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-sm tracking-tight text-text leading-tight">
          GREEN LAND CAPITAL
        </span>
        <span className="text-[10px] font-medium text-text-muted tracking-wide">
          Save for Next
        </span>
      </div>
    </div>
  );
}

export function AssignedServiceDetailScreen({
  record,
  onBack,
  onProceedToWorkOrder,
}: AssignedServiceDetailScreenProps) {
  const [activeNav, setActiveNav] = React.useState<"services" | "site-visits">("services");
  const [isNavDropdownOpen, setIsNavDropdownOpen] = React.useState(false);
  const [isGeneratingEstimation, setIsGeneratingEstimation] = React.useState(false);
  const dropdownTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const [zoomLevel, setZoomLevel] = React.useState(1);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setIsNavDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsNavDropdownOpen(false);
    }, 180);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 1));
  };

  // Resolve Primary Service Display Title
  const primaryServiceName = React.useMemo(() => {
    if (record.service.toLowerCase().includes("farmhouse")) return "Farmhouse Construction";
    if (record.service.toLowerCase().includes("borewell")) return "Borewell Drilling";
    if (record.service.toLowerCase().includes("fencing")) return "Fencing";
    if (record.service.toLowerCase().includes("organic")) return "Organic Management";
    return record.service;
  }, [record.service]);

  // Clean Farmland ID
  const displayLandId = record.farmlandId
    ? record.farmlandId.replace(/\s+/g, "")
    : "GLCSOS001";

  // Dynamic Address based on location
  const displayAddress = `Plot 42, Green Valley, Shamshabad Mandal, ${record.location || "Hyderabad"}.`;

  if (isGeneratingEstimation) {
    return (
      <GenerateEstimationScreen
        record={record}
        onBack={() => setIsGeneratingEstimation(false)}
        onSuccess={() => {
          setIsGeneratingEstimation(false);
          if (onProceedToWorkOrder) {
            onProceedToWorkOrder(record);
          } else {
            onBack();
          }
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] py-8 px-4 sm:px-6 lg:px-10 2xl:px-14 3xl:px-16 4xl:px-20 flex flex-col items-center animate-in fade-in duration-200">
      <div className="w-full max-w-[1440px] 2xl:max-w-[1780px] 3xl:max-w-[2180px] 4xl:max-w-[2400px] flex flex-col gap-6">
        
        {/* TOP NAVIGATION BAR */}
        <header className="w-full flex items-center justify-between gap-4 shrink-0">
          {/* Logo */}
          <GLCLogo />

          {/* Navigation Items (Pill Bar) */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-3">
            <button
              type="button"
              className="glc-focus inline-flex h-14 items-center gap-2 rounded-full bg-surface px-4 py-2.5 text-sm font-medium text-text shadow-low hover:bg-surface-hover transition-colors"
            >
              <span className="grid size-9 place-items-center rounded-full bg-surface border border-border/50 text-text-secondary">
                <Sprout className="size-4" />
              </span>
              <span>Farmlands</span>
            </button>

            <button
              type="button"
              className="glc-focus inline-flex h-14 items-center gap-2 rounded-full bg-surface px-4 py-2.5 text-sm font-medium text-text shadow-low hover:bg-surface-hover transition-colors"
            >
              <span className="grid size-9 place-items-center rounded-full bg-surface border border-border/50 text-text-secondary">
                <FileText className="size-4" />
              </span>
              <span>Drafts</span>
            </button>

            <button
              type="button"
              className="glc-focus inline-flex h-14 items-center gap-2 rounded-full bg-surface px-4 py-2.5 text-sm font-medium text-text shadow-low hover:bg-surface-hover transition-colors"
            >
              <span className="grid size-9 place-items-center rounded-full bg-surface border border-border/50 text-text-secondary">
                <ClipboardList className="size-4" />
              </span>
              <span>Request info</span>
            </button>

            <button
              type="button"
              className="glc-focus inline-flex h-14 items-center gap-2 rounded-full bg-surface px-4 py-2.5 text-sm font-medium text-text shadow-low hover:bg-surface-hover transition-colors"
            >
              <span className="grid size-9 place-items-center rounded-full bg-surface border border-border/50 text-text-secondary">
                <LandPlot className="size-4" />
              </span>
              <span>Assigned Farmlands</span>
            </button>

            {/* Merged Navigation Pill with Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                aria-expanded={isNavDropdownOpen}
                aria-haspopup="menu"
                onClick={() => setIsNavDropdownOpen((prev) => !prev)}
                className={`glc-focus inline-flex h-14 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition-all cursor-pointer ${
                  activeNav === "services" || activeNav === "site-visits"
                    ? "bg-[#1C5F9D] text-text-inverse shadow-medium"
                    : "bg-surface text-text hover:bg-surface-hover shadow-low"
                }`}
              >
                <span className="grid size-9 place-items-center rounded-full bg-surface text-[#1C5F9D]">
                  {activeNav === "site-visits" ? (
                    <MapPin className="size-4" />
                  ) : (
                    <FileCheck className="size-4" />
                  )}
                </span>
                <span className="font-semibold text-sm">Assigned services</span>
                <ChevronDown
                  className={`size-3.5 transition-transform duration-200 ${
                    isNavDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Hover Dropdown Menu */}
              {isNavDropdownOpen && (
                <div
                  role="menu"
                  className="absolute top-full right-0 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  <div className="w-64 rounded-2xl border border-border bg-surface p-2 shadow-high">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setActiveNav("services");
                        setIsNavDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-colors cursor-pointer ${
                        activeNav === "services"
                          ? "bg-accent text-text-inverse font-semibold shadow-low"
                          : "hover:bg-surface-hover text-text hover:text-accent"
                      }`}
                    >
                      <div
                        className={`grid size-7 place-items-center rounded-lg ${
                          activeNav === "services"
                            ? "bg-white/20 text-white"
                            : "bg-surface-muted text-text-secondary"
                        }`}
                      >
                        <FileCheck className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm whitespace-nowrap">Maintenance services</p>
                        <p
                          className={`text-[10px] ${
                            activeNav === "services" ? "text-white/80" : "text-text-muted"
                          }`}
                        >
                          Maintenance and field tasks
                        </p>
                      </div>
                      {activeNav === "services" && (
                        <span className="size-2 rounded-full bg-white shrink-0" />
                      )}
                    </button>

                    <Link
                      href="/site-visits"
                      role="menuitem"
                      onClick={() => setIsNavDropdownOpen(false)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium transition-colors cursor-pointer mt-1 hover:bg-surface-hover text-text hover:text-accent"
                    >
                      <div className="grid size-7 place-items-center rounded-lg bg-surface-muted text-text-secondary">
                        <MapPin className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm whitespace-nowrap">Site visits</p>
                        <p className="text-[10px] text-text-muted">
                          Field inspection logs
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right utility buttons: Notifications & Avatar */}
          <div className="flex items-center gap-3.5 shrink-0">
            <button
              type="button"
              aria-label="Notifications"
              className="glc-focus relative grid size-13 place-items-center rounded-full bg-surface border border-border/60 shadow-low hover:bg-surface-hover transition-colors"
            >
              <Bell className="size-6 text-text" />
              <span
                className="absolute top-3.5 right-3.5 size-2 rounded-full bg-danger"
                aria-hidden="true"
              />
            </button>

            <Avatar
              size="lg"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
              alt="Officer profile"
              fallback="FO"
              className="border-2 border-surface shadow-low"
            />
          </div>
        </header>

        {/* CONTENT SECTION */}
        <div className="flex flex-col gap-5 pb-6">
          
          {/* HEADER: Back Button & Active Service Request Title */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to assigned services"
              className="glc-focus grid size-10 place-items-center rounded-full bg-surface text-text border border-border/50 shadow-xs hover:bg-surface-hover transition-colors cursor-pointer"
            >
              <ArrowLeft className="size-5 text-text" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text">
              Active Service Request: {record.customer} – {primaryServiceName}
            </h1>
          </div>

          {/* 2-COLUMN MAIN CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* LEFT CARD: DETAILS TABLE */}
            <div className="lg:col-span-6 bg-surface rounded-[28px] p-6 sm:p-7 2xl:p-8 3xl:p-10 border border-border/50 shadow-[0px_10px_30px_rgba(0,105,107,0.04)] flex flex-col justify-between">
              <div className="divide-y divide-[#F1F5F9] text-sm 3xl:text-base flex-1 flex flex-col justify-between">
                
                {/* Land ID */}
                <div className="py-2.5 first:pt-0 grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-5 font-semibold text-text-muted text-sm">
                    Land ID
                  </div>
                  <div className="col-span-7 font-bold text-text text-base">
                    {displayLandId}
                  </div>
                </div>

                {/* Customer Name */}
                <div className="py-2.5 grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-5 font-semibold text-text-muted text-sm">
                    Customer Name
                  </div>
                  <div className="col-span-7 font-bold text-text text-base">
                    {record.customer}
                  </div>
                </div>

                {/* Land Size */}
                <div className="py-2.5 grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-5 font-semibold text-text-muted text-sm">
                    Land Size
                  </div>
                  <div className="col-span-7 font-bold text-text text-base">
                    {record.land || "5.0 Acres"}
                  </div>
                </div>

                {/* Address */}
                <div className="py-2.5 grid grid-cols-12 gap-4 items-start">
                  <div className="col-span-5 font-semibold text-text-muted text-sm pt-0.5">
                    Address
                  </div>
                  <div className="col-span-7 font-medium text-text leading-relaxed text-sm">
                    {displayAddress}
                  </div>
                </div>

                {/* Preferred Visit Date */}
                <div className="py-2.5 grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-5 font-semibold text-text-muted text-sm">
                    Preferred Visit Date
                  </div>
                  <div className="col-span-7 font-medium text-text">
                    Oct 24, 2026
                  </div>
                </div>

                {/* Services */}
                <div className="py-2.5 grid grid-cols-12 gap-4 items-start">
                  <div className="col-span-5 font-semibold text-text-muted text-sm pt-0.5">
                    Services
                  </div>
                  <div className="col-span-7 space-y-2">
                    {/* Service 1: Farmhouse Construction */}
                    <div className="flex items-center gap-2.5">
                      <div className="grid size-5 place-items-center text-[#16A34A] shrink-0">
                        <Tractor className="size-4.5" />
                      </div>
                      <span className="font-semibold text-text text-sm">
                        Farmhouse Construction
                      </span>
                    </div>

                    {/* Service 2: Borewell Drilling */}
                    <div className="flex items-center gap-2.5">
                      <div className="grid size-5 place-items-center text-[#16A34A] shrink-0">
                        <Droplets className="size-4.5" />
                      </div>
                      <span className="font-semibold text-text text-sm">
                        Borewell Drilling
                      </span>
                    </div>

                    {/* Service 3: Organic Farming Setup */}
                    <div className="flex items-start gap-2.5">
                      <div className="grid size-5 place-items-center text-[#16A34A] shrink-0 mt-0.5">
                        <Leaf className="size-4.5" />
                      </div>
                      <div>
                        <span className="font-semibold text-text text-sm block">
                          Organic Farming Setup
                        </span>
                        <span className="text-[11px] text-text-muted block">
                          (Premium Timber / Orchard (60/40))
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div className="py-2.5 last:pb-0 grid grid-cols-12 gap-4 items-start">
                  <div className="col-span-5 font-semibold text-text-muted text-sm pt-0.5">
                    Requirements
                  </div>
                  <div className="col-span-7 text-xs italic text-text-muted leading-relaxed">
                    &ldquo;Need a 2-BHK farmhouse with a wide porch and deep borewell near the north gate.&rdquo;
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT CARD: SATELLITE MAP & GENERATE ESTIMATION BUTTON */}
            <div className="lg:col-span-6 flex flex-col justify-between min-h-[500px] 2xl:min-h-[580px] 3xl:min-h-[660px] 4xl:min-h-[720px] gap-4">
              
              {/* Satellite Map Container */}
              <div className="flex-1 min-h-[420px] 2xl:min-h-[500px] 3xl:min-h-[580px] 4xl:min-h-[640px] relative w-full rounded-[28px] overflow-hidden border border-border/50 shadow-[0px_10px_30px_rgba(0,105,107,0.06)] bg-slate-900 group">
                {/* Aerial Imagery with Zoom */}
                <div
                  className="w-full h-full transition-transform duration-300 ease-out origin-center"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  <img
                    src="/images/indian_farmland_satellite_map.jpg"
                    alt="Asset Live Location Satellite Map"
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />
                </div>

                {/* Overlay Badge: Asset Live Location */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-md px-3.5 py-1.5 shadow-md border border-black/5">
                    <span className="size-2 rounded-full bg-[#1C5F9D] animate-pulse" />
                    <span className="text-xs font-bold text-[#1C5F9D]">
                      Asset Live Location
                    </span>
                  </div>
                </div>

                {/* Map Zoom Controls (+ / -) */}
                <div className="absolute bottom-4 right-4 z-10 flex flex-col rounded-xl bg-white shadow-lg border border-border/60 overflow-hidden divide-y divide-border/50">
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    aria-label="Zoom in"
                    className="size-9 grid place-items-center text-text hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <Plus className="size-4.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    aria-label="Zoom out"
                    className="size-9 grid place-items-center text-text hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <Minus className="size-4.5" />
                  </button>
                </div>
              </div>

              {/* Action Button: Generate Estimation */}
              <button
                type="button"
                onClick={() => setIsGeneratingEstimation(true)}
                style={{ fontWeight: 600 }}
                className="shrink-0 glc-focus w-full h-13 rounded-2xl bg-[#96C9ED] hover:bg-[#7FBDE9] active:scale-[0.99] text-black font-semibold text-sm uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center justify-center"
              >
                <span className="font-semibold" style={{ fontWeight: 600 }}>Generate Estimation</span>
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
