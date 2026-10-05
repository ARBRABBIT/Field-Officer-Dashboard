"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  Calendar,
  Camera,
  ChevronDown,
  ClipboardList,
  FileCheck,
  FileText,
  LandPlot,
  MapPin,
  Plus,
  Sprout,
  Trash2,
} from "lucide-react";
import { Avatar } from "@/components/ui";

export interface WorkOrderService {
  serviceName: string;
  estimationQuote: string;
  lastUpdate: string;
  land?: string;
  commencementDate?: string;
  estimatedCompletion?: string;
  currentPhase?: string;
  milestones?: {
    name: string;
    status: "In Progress" | "Completed" | "Pending";
  }[];
}

export interface WorkOrderRecord {
  id: string;
  customer: string;
  lastUpdate: string;
  land: string;
  service: string;
  farmlandId: string;
  location: string;
  estimationQuote: string;
  services?: WorkOrderService[];
}

interface WorkOrderDetailScreenProps {
  record: WorkOrderRecord;
  onBack: () => void;
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

const defaultMilestones = [
  { name: "Ground water survey and point selection", status: "Completed" as const },
  { name: "Drilling", status: "In Progress" as const },
  { name: "Water quality test", status: "Pending" as const },
  { name: "Pump and electrical installation", status: "Pending" as const },
  { name: "Trail run and handover", status: "Pending" as const },
];

const defaultServices: WorkOrderService[] = [
  {
    serviceName: "Borewell",
    estimationQuote: "₹1,45,000",
    lastUpdate: "Oct 22, 2026",
    commencementDate: "Aug 01, 2026",
    estimatedCompletion: "Oct 30, 2026",
    currentPhase: "Drilling",
    milestones: [
      { name: "Ground water survey and point selection", status: "Completed" },
      { name: "Drilling", status: "In Progress" },
      { name: "Water quality test", status: "Pending" },
      { name: "Pump and electrical installation", status: "Pending" },
      { name: "Trail run and handover", status: "Pending" },
    ],
  },
  {
    serviceName: "Fencing",
    estimationQuote: "₹2,10,000",
    lastUpdate: "Oct 24, 2026",
    commencementDate: "July 15, 2026",
    estimatedCompletion: "Nov 10, 2026",
    currentPhase: "Pole Erection",
    milestones: [
      { name: "Boundary Marking", status: "Completed" },
      { name: "Pole Erection", status: "In Progress" },
      { name: "Wire Mesh Fixing", status: "Pending" },
      { name: "Gate Installation", status: "Pending" },
      { name: "Final Handover", status: "Pending" },
    ],
  },
  {
    serviceName: "Farmhouse Construction",
    estimationQuote: "₹4,50,000",
    lastUpdate: "Oct 24, 2026",
    commencementDate: "July 15, 2026",
    estimatedCompletion: "Nov 10, 2026",
    currentPhase: "Foundation",
    milestones: [
      { name: "Site Clearing", status: "In Progress" },
      { name: "Foundation", status: "Pending" },
      { name: "Brickwork", status: "Pending" },
      { name: "Plumbing & Electrical", status: "Pending" },
      { name: "Finishing", status: "Pending" },
    ],
  },
  {
    serviceName: "Organic Farming",
    estimationQuote: "₹85,000",
    lastUpdate: "Oct 25, 2026",
    commencementDate: "Aug 10, 2026",
    estimatedCompletion: "Nov 15, 2026",
    currentPhase: "Drip Irrigation Setup",
    milestones: [
      { name: "Soil Testing & Land Preparation", status: "Completed" },
      { name: "Organic Manure & Bed Preparation", status: "Completed" },
      { name: "Drip Irrigation Setup", status: "In Progress" },
      { name: "Sapling Plantation", status: "Pending" },
      { name: "Bio-Pest Control & Mulching", status: "Pending" },
    ],
  },
];

const defaultInitialImages = [
  "https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=500&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=80",
];

export function WorkOrderDetailScreen({
  record,
  onBack,
}: WorkOrderDetailScreenProps) {
  const [activeNav, setActiveNav] = React.useState<"services" | "site-visits">("services");
  const [isNavDropdownOpen, setIsNavDropdownOpen] = React.useState(false);
  const dropdownTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setIsNavDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsNavDropdownOpen(false);
    }, 180);
  };

  const servicesList =
    record.services && record.services.length > 0
      ? record.services
      : defaultServices;

  // Active service pill index
  const [activeServiceIdx, setActiveServiceIdx] = React.useState(() => {
    const foundIdx = servicesList.findIndex(
      (s) => s.serviceName.toLowerCase() === record.service.toLowerCase()
    );
    return foundIdx !== -1 ? foundIdx : 0;
  });

  const activeService = servicesList[activeServiceIdx] || servicesList[0];
  const milestones =
    activeService.milestones && activeService.milestones.length > 0
      ? activeService.milestones
      : defaultMilestones;

  // Form State
  const [phase, setPhase] = React.useState(() => {
    return (
      activeService.currentPhase ||
      milestones.find((m) => m.status === "In Progress")?.name ||
      milestones[0]?.name ||
      "Drilling"
    );
  });
  const [isPhaseOpen, setIsPhaseOpen] = React.useState(false);
  const [updateDate, setUpdateDate] = React.useState("October 24, 2026");
  const [description, setDescription] = React.useState(
    "Work is progressing as per schedule. Site conditions are optimal and safety checks have been completed."
  );

  // Sync phase whenever active service changes
  React.useEffect(() => {
    const currentMilestones =
      activeService.milestones && activeService.milestones.length > 0
        ? activeService.milestones
        : defaultMilestones;
    const currentActivePhase =
      activeService.currentPhase ||
      currentMilestones.find((m) => m.status === "In Progress")?.name ||
      currentMilestones[0]?.name ||
      "Drilling";
    setPhase(currentActivePhase);
  }, [activeServiceIdx, activeService]);

  // Uploaded Images
  const [images, setImages] = React.useState<string[]>(defaultInitialImages);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newUrl = URL.createObjectURL(file);
      setImages((prev) => [...prev, newUrl]);
    }
  };

  const handleClearAllImages = () => {
    setImages([]);
  };

  const workOrderId = `ID-${record.farmlandId ? record.farmlandId.replace(/\D/g, "") || "2098" : "2098"}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#F2F4F7] py-6 px-4 sm:px-6 lg:px-8 2xl:px-12 3xl:px-16 4xl:px-20 animate-in fade-in duration-200">
      <div className="w-full max-w-[1536px] 2xl:max-w-[1780px] 3xl:max-w-[2180px] 4xl:max-w-[2400px] mx-auto flex flex-col gap-5">
        
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
          <div className="flex items-center gap-3.5">
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

        {/* WORK ORDER CONTENT SECTION */}
        <div className="flex flex-col gap-5 pb-6">
          {/* WORK ORDER HEADER: Back Button & Active Work Order Title */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to table"
              className="glc-focus grid size-10 place-items-center rounded-full bg-surface text-text border border-border/50 shadow-xs hover:bg-surface-hover transition-colors cursor-pointer"
            >
              <ArrowLeft className="size-5 text-text" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text">
              Active Work Order: {record.customer} – {activeService.serviceName} #{workOrderId}
            </h1>
          </div>

          {/* SERVICE PILLS NAVIGATION */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {servicesList.map((srv, idx) => {
              const isActive = activeServiceIdx === idx;
              const isCompleted = srv.milestones?.every((m) => m.status === "Completed") || srv.currentPhase === "Completed";
              return (
                <button
                  key={srv.serviceName}
                  type="button"
                  onClick={() => {
                    setActiveServiceIdx(idx);
                    if (srv.currentPhase) setPhase(srv.currentPhase);
                  }}
                  className={`glc-focus rounded-full px-5 py-2 text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? "bg-[#1C5F9D] text-white shadow-xs"
                      : "bg-[#F1F3F5] text-text hover:bg-[#E5E8EB]"
                  }`}
                >
                  {isCompleted ? (
                    <span className="size-4.5 rounded-full bg-[#86EFAC] text-[#15803D] flex items-center justify-center text-[10px] font-bold shrink-0">
                      ✓
                    </span>
                  ) : (
                    <span className="size-4.5 rounded-full bg-[#FFA8A8] text-[#B91C1C] flex items-center justify-center text-[10px] font-extrabold shrink-0">
                      !
                    </span>
                  )}
                  <span>{srv.serviceName}</span>
                </button>
              );
            })}
          </div>

          {/* 3-COLUMN CARDS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* CARD 1: PROJECT ROADMAP (Left 3 cols) */}
            <div className="lg:col-span-3 bg-surface rounded-[28px] p-6 2xl:p-7 3xl:p-8 border border-border/50 shadow-[0px_10px_30px_rgba(0,105,107,0.04)] flex flex-col justify-between min-h-[520px] 3xl:min-h-[640px] 4xl:min-h-[700px]">
              <div className="flex flex-col flex-1">
                <h2 className="text-lg font-bold text-text mb-5 shrink-0">
                  Project Roadmap
                </h2>

                {/* Vertical Milestone Stepper (Scrollable inside card) */}
                <div className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-1">
                  {milestones.map((milestone, idx) => {
                    const isCurrent = milestone.status === "In Progress";
                    const isCompleted = milestone.status === "Completed";
                    const isLast = idx === milestones.length - 1;

                    return (
                      <div key={milestone.name} className="flex items-start gap-4">
                        {/* Node + Line column */}
                        <div className="flex flex-col items-center">
                          <div
                            className={`size-6 rounded-lg border-2 grid place-items-center transition-colors shrink-0 ${
                              isCurrent
                                ? "border-[#10B981] bg-white shadow-xs"
                                : isCompleted
                                ? "border-[#10B981] bg-[#10B981] text-white"
                                : "border-[#CBD5E1] bg-white"
                            }`}
                          >
                            {isCompleted && (
                              <span className="text-xs font-bold">✓</span>
                            )}
                          </div>
                          {!isLast && (
                            <div className="w-[1.5px] h-12 bg-[#E2E8F0] my-1" />
                          )}
                        </div>

                        {/* Content column */}
                        <div className="pt-0.5">
                          <p className="text-sm font-bold text-text leading-tight">
                            {milestone.name}
                          </p>
                          <p
                            className={`text-xs mt-1 font-semibold ${
                              isCurrent
                                ? "text-[#10B981]"
                                : isCompleted
                                ? "text-text-muted"
                                : "text-text-muted/80 font-normal"
                            }`}
                          >
                            {milestone.status}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Dates Footer */}
              <div className="border-t border-[#F1F5F9] pt-4 mt-4 flex items-center justify-between gap-4 shrink-0">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Commencement Date
                  </p>
                  <p className="text-sm font-bold text-text mt-1">
                    {activeService.commencementDate || "July 15, 2026"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Estimated Completion
                  </p>
                  <p className="text-sm font-bold text-text mt-1">
                    {activeService.estimatedCompletion || "Nov 10, 2026"}
                  </p>
                </div>
              </div>
            </div>

            {/* CARD 2: UPLOAD PROGRESS IMAGES (Middle 5 cols) */}
            <div className="lg:col-span-5 bg-surface rounded-[28px] p-6 2xl:p-7 3xl:p-8 border border-border/50 shadow-[0px_10px_30px_rgba(0,105,107,0.04)] flex flex-col justify-between min-h-[520px] 3xl:min-h-[640px] 4xl:min-h-[700px]">
              <div className="flex flex-col flex-1 min-h-0">
                <h2 className="text-lg font-bold text-text shrink-0">
                  Upload Progress Images – {phase}
                </h2>
                <p className="text-xs text-text-muted mt-0.5 shrink-0">
                  Document daily milestones for stakeholder visibility.
                </p>

                {/* Dashed Dropzone */}
                <div className="mt-4 flex-1 min-h-[140px] rounded-2xl border-2 border-dashed border-[#B8D8F4] bg-[#F7FAFC]/80 p-5 flex flex-col items-center justify-center text-center">
                  <div className="grid size-12 place-items-center rounded-full bg-[#EBF5FF] text-[#1C5F9D] mb-2.5">
                    <Camera className="size-6 text-[#1C5F9D]" />
                  </div>
                  <p className="text-sm font-semibold text-text">
                    Drag and drop daily site images here
                  </p>
                  <p className="text-[11px] text-text-muted mt-1">
                    Supported formats: JPG, PNG, HEIC (Max 10MB)
                  </p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="glc-focus inline-flex items-center justify-center rounded-full border border-border/60 bg-surface px-5 py-2 text-xs font-semibold text-text shadow-xs hover:bg-surface-hover mt-3.5 transition-colors cursor-pointer"
                  >
                    Select from Device
                  </button>
                </div>
              </div>

              {/* Selected Images Section */}
              <div className="mt-4 shrink-0">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-text">
                    Selected Images ({images.length})
                  </span>
                  {images.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAllImages}
                      className="text-xs font-bold text-[#10B981] hover:text-[#059669] transition-colors cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Image Previews + Add Box */}
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {images.map((imgUrl, i) => (
                    <div
                      key={i}
                      className="relative group size-20 sm:size-24 rounded-2xl overflow-hidden shrink-0 border border-border/40 shadow-xs bg-surface-muted"
                    >
                      <img
                        src={imgUrl}
                        alt={`Site image ${i + 1}`}
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                      />
                      <button
                        type="button"
                        aria-label="Remove image"
                        onClick={() =>
                          setImages((prev) => prev.filter((_, idx) => idx !== i))
                        }
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity grid place-items-center text-white cursor-pointer"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}

                  {/* Add Image Placeholder Box */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="glc-focus size-20 sm:size-24 rounded-2xl border-2 border-dashed border-[#CBD5E1] hover:border-[#1C5F9D] hover:bg-[#F0F7FD] transition-colors shrink-0 grid place-items-center text-text-muted hover:text-[#1C5F9D] cursor-pointer"
                  >
                    <Plus className="size-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 3: DAILY PROGRESS UPDATE (Right 4 cols) */}
            <div className="lg:col-span-4 bg-surface rounded-[28px] p-6 2xl:p-7 3xl:p-8 border border-border/50 shadow-[0px_10px_30px_rgba(0,105,107,0.04)] flex flex-col justify-between min-h-[520px] 3xl:min-h-[640px] 4xl:min-h-[700px]">
              <div className="space-y-3.5 flex-1 min-h-0 overflow-y-auto pr-0.5">
                <div>
                  <h2 className="text-lg font-bold text-text">
                    Daily Progress Update
                  </h2>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mt-0.5">
                    Client Notification
                  </p>
                </div>

                {/* Form Controls */}
                <div className="space-y-3 pt-1">
                  {/* Field 1: Phase */}
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1">
                      Phase
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsPhaseOpen((prev) => !prev)}
                        className="glc-focus w-full h-11 px-4 rounded-xl bg-[#F8FAFC] border border-border/50 text-sm font-semibold text-text flex items-center justify-between cursor-pointer hover:border-border-strong transition-colors"
                      >
                        <span className="truncate pr-2">{phase}</span>
                        <ChevronDown
                          className={`size-4 text-text-muted transition-transform duration-150 shrink-0 ${
                            isPhaseOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isPhaseOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 z-30 rounded-xl bg-surface border border-border shadow-high p-1 max-h-52 overflow-y-auto">
                          {milestones.map((m) => (
                            <button
                              key={m.name}
                              type="button"
                              onClick={() => {
                                setPhase(m.name);
                                setIsPhaseOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                                phase === m.name
                                  ? "bg-[#1C5F9D] text-white"
                                  : "text-text hover:bg-surface-hover"
                              }`}
                            >
                              {m.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Field 2: Update Date */}
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1">
                      Update Date
                    </label>
                    <div className="w-full h-11 px-4 rounded-xl bg-[#F8FAFC] border border-border/50 text-sm font-medium text-text flex items-center gap-2.5">
                      <Calendar className="size-4 text-text-muted shrink-0" />
                      <input
                        type="text"
                        value={updateDate}
                        onChange={(e) => setUpdateDate(e.target.value)}
                        className="w-full bg-transparent text-sm font-semibold text-text focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Field 3: Update Description */}
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-1">
                      Update Description
                    </label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full rounded-2xl bg-[#F8FAFC] border border-border/50 p-3.5 text-xs text-text placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Action Button */}
              <div className="pt-4 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    alert(
                      `Progress update uploaded successfully for ${record.customer} (${activeService.serviceName})!`
                    );
                    onBack();
                  }}
                  className="glc-focus w-full h-12 rounded-2xl bg-[#96C9ED] hover:bg-[#7FBDE9] active:scale-[0.99] text-black font-semibold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer"
                  style={{ fontWeight: 600 }}
                >
                  <span className="font-semibold" style={{ fontWeight: 600 }}>Upload Now</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
