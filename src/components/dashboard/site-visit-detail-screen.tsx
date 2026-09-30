"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  AlertTriangle,
  Bell,
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  FileCheck,
  FileEdit,
  FileText,
  LandPlot,
  MapPin,
  MessageSquareQuote,
  Phone,
  Plus,
  Quote,
  Save,
  Sprout,
  Star,
  ThumbsUp,
  X,
} from "lucide-react";
import {
  Button,
  Card,
  CustomSelect,
  DateTimePicker,
  FormField,
  Input,
  Textarea,
} from "@/components/ui";

function GLCLogo() {
  return (
    <Link href="/" className="flex items-center gap-3">
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
    </Link>
  );
}

export interface SiteVisitRecord {
  id: string;
  customer: string;
  farmlandId: string;
  visitDate: string;
  land: string;
  status: "Completed" | "In Progress" | "Scheduled";
  location: string;
  phone: string;
  propertyId: string;
  buyerFrom: string;
  checkedIn?: string;
  duration?: string;
  visitors?: string;
  accompaniedBy?: string;
}

export interface SiteVisitDetailScreenProps {
  initialRecord?: SiteVisitRecord | null;
  onBack?: () => void;
}

export function SiteVisitDetailScreen({
  initialRecord,
  onBack,
}: SiteVisitDetailScreenProps = {}) {
  const router = useRouter();

  // Top nav dropdown state
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

  // Header & Customer details (Retained from visit or initialized from record)
  const [customerName, setCustomerName] = React.useState(initialRecord?.customer || "Pooja");
  const [farmlandId, setFarmlandId] = React.useState(
    initialRecord
      ? initialRecord.farmlandId.startsWith("#")
        ? initialRecord.farmlandId
        : `#${initialRecord.farmlandId}`
      : "#GLCSOS 088"
  );
  const [phone, setPhone] = React.useState(initialRecord?.phone || "+91 9849012345");
  const [visitStatus, setVisitStatus] = React.useState<"Completed" | "In Progress" | "Scheduled">(
    initialRecord?.status || "Completed"
  );
  const [scheduledHeader, setScheduledHeader] = React.useState(initialRecord?.visitDate || "25th Sep - 10:00 AM");

  // 1. Visit Details Form state (Retained as requested)
  const [propertyId, setPropertyId] = React.useState(initialRecord?.propertyId || "GLC SOS 07");
  const [farmlandLocation, setFarmlandLocation] = React.useState(initialRecord?.location || "Nunna, Krishna Dist.");
  const [buyerFrom, setBuyerFrom] = React.useState(initialRecord?.buyerFrom || "Vijayawada, Benz Circle");
  const [scheduled, setScheduled] = React.useState(initialRecord?.visitDate || "25th Sep - 10:00 AM");
  const [checkedIn, setCheckedIn] = React.useState(initialRecord?.checkedIn || "2026-09-25T10:12");

  // Helper to parse duration string (e.g. "1 hr 25 min", "45 min", "2 hrs")
  const parseInitialDuration = (val?: string) => {
    if (!val) return { h: 1, m: 25 };
    const hMatch = val.match(/(\d+)\s*(?:hr|hour|h)/i);
    const mMatch = val.match(/(\d+)\s*(?:min|minute|m)/i);
    const h = hMatch ? parseInt(hMatch[1], 10) : 0;
    const m = mMatch ? parseInt(mMatch[1], 10) : 0;
    return { h: isNaN(h) ? 0 : h, m: isNaN(m) ? 0 : m };
  };

  const initialDur = React.useMemo(
    () => parseInitialDuration(initialRecord?.duration || "1 hr 25 min"),
    [initialRecord?.duration]
  );
  const [durationHours, setDurationHours] = React.useState<number>(initialDur.h);
  const [durationMinutes, setDurationMinutes] = React.useState<number>(initialDur.m);

  const handleDurationChange = (newH: number, newM: number) => {
    setDurationHours(newH);
    setDurationMinutes(newM);
  };

  const minuteOptions = React.useMemo(() => {
    const defaults = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    if (!defaults.includes(durationMinutes)) {
      return [...defaults, durationMinutes].sort((a, b) => a - b);
    }
    return defaults;
  }, [durationMinutes]);

  const [visitors, setVisitors] = React.useState(initialRecord?.visitors || `${initialRecord?.customer || "Pooja"} + spouse`);
  const [accompaniedBy, setAccompaniedBy] = React.useState(initialRecord?.accompaniedBy || "Ramesh Babu");

  // 2. Feedback Summary Form state (Starts EMPTY for officer entry)
  const [overallRating, setOverallRating] = React.useState<number>(0);
  const [interestLevel, setInterestLevel] = React.useState<"Hot" | "Warm" | "Cold" | "">("");

  // Budget: min - max range + Lakh / Cr selector
  const [budgetMin, setBudgetMin] = React.useState("");
  const [budgetMax, setBudgetMax] = React.useState("");
  const [budgetUnit, setBudgetUnit] = React.useState<"Lakh" | "Cr">("Lakh");

  // Preferred Plot Size (Acres only)
  const [plotSize, setPlotSize] = React.useState(initialRecord?.land || "");

  // Purchase Timeline: dropdown + custom date calculation
  const [timelineType, setTimelineType] = React.useState<
    "" | "Within 1 month" | "Within 2 months" | "Within 3 months" | "Custom"
  >("");
  const [customTimelineDate, setCustomTimelineDate] = React.useState("");
  const [isTimelineOpen, setIsTimelineOpen] = React.useState(false);
  const [timelineViewDate, setTimelineViewDate] = React.useState(() => new Date());

  const handleTimelineOpenChange = (open: boolean) => {
    setIsTimelineOpen(open);
    if (open && customTimelineDate) {
      const parsed = new Date(customTimelineDate);
      if (!isNaN(parsed.getTime())) {
        setTimelineViewDate(parsed);
      }
    }
  };

  const formatReadableDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const toISODate = (d: Date) => {
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const todayIso = React.useMemo(() => toISODate(new Date()), []);

  // Financing dropdown
  const [financing, setFinancing] = React.useState("");

  // Next Step dropdown
  const [nextStep, setNextStep] = React.useState("");

  // Next Follow-up date selector
  const [followUpDate, setFollowUpDate] = React.useState("");

  // 3. Buyer Feedback Checkboxes & Comments (Starts EMPTY for officer entry)
  const defaultLikedPoints = [
    "Clear land title & 100% legal clearance",
    "Good road approach & highway connectivity",
    "Abundant water yield & fertile soil",
    "Scenic peaceful surroundings & green canopy",
    "Secure perimeter fencing & demarcation",
    "High future appreciation & ROI potential",
  ];

  const defaultConcernPoints = [
    "Price slightly above expected budget",
    "Distance from main highway / city center",
    "Internal road width / tar road needed",
    "Water availability during peak summer",
    "Electricity connection / transformer pending",
    "Clear survey stone & boundary verification",
  ];

  const [likedOptions, setLikedOptions] = React.useState<string[]>(defaultLikedPoints);
  const [selectedLikes, setSelectedLikes] = React.useState<string[]>([]);
  const [customLikeInput, setCustomLikeInput] = React.useState("");

  const [concernOptions, setConcernOptions] = React.useState<string[]>(defaultConcernPoints);
  const [selectedConcerns, setSelectedConcerns] = React.useState<string[]>([]);
  const [customConcernInput, setCustomConcernInput] = React.useState("");

  const [buyerComments, setBuyerComments] = React.useState("");
  const [executiveNotes, setExecutiveNotes] = React.useState("");

  const [savedSuccess, setSavedSuccess] = React.useState(false);

  const toggleLike = (point: string) => {
    setSelectedLikes((prev) =>
      prev.includes(point) ? prev.filter((p) => p !== point) : [...prev, point]
    );
  };

  const handleAddCustomLike = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customLikeInput.trim();
    if (!trimmed) return;
    if (!likedOptions.includes(trimmed)) {
      setLikedOptions((prev) => [...prev, trimmed]);
    }
    if (!selectedLikes.includes(trimmed)) {
      setSelectedLikes((prev) => [...prev, trimmed]);
    }
    setCustomLikeInput("");
  };

  const handleRemoveCustomLike = (point: string) => {
    setLikedOptions((prev) => prev.filter((p) => p !== point));
    setSelectedLikes((prev) => prev.filter((p) => p !== point));
  };

  const toggleConcern = (point: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(point) ? prev.filter((p) => p !== point) : [...prev, point]
    );
  };

  const handleAddCustomConcern = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customConcernInput.trim();
    if (!trimmed) return;
    if (!concernOptions.includes(trimmed)) {
      setConcernOptions((prev) => [...prev, trimmed]);
    }
    if (!selectedConcerns.includes(trimmed)) {
      setSelectedConcerns((prev) => [...prev, trimmed]);
    }
    setCustomConcernInput("");
  };

  const handleRemoveCustomConcern = (point: string) => {
    setConcernOptions((prev) => prev.filter((p) => p !== point));
    setSelectedConcerns((prev) => prev.filter((p) => p !== point));
  };

  // Helper to calculate days from today
  const getDaysFromNow = (dateStr: string) => {
    if (!dateStr) return "";
    const target = new Date(dateStr);
    const now = new Date();
    target.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (isNaN(diffDays)) return "";
    if (diffDays <= 0) return "Today / Immediate";
    return `${diffDays} days from now`;
  };

  // Timeline calendar cells
  const timelineCurrentYear = timelineViewDate.getFullYear();
  const timelineCurrentMonth = timelineViewDate.getMonth();

  const canTimelineGoPrevMonth = React.useMemo(() => {
    const now = new Date();
    const minYear = now.getFullYear();
    const minMonth = now.getMonth();
    if (timelineCurrentYear < minYear) return false;
    if (timelineCurrentYear === minYear && timelineCurrentMonth <= minMonth) return false;
    return true;
  }, [timelineCurrentYear, timelineCurrentMonth]);

  const timelineDaysInMonth = new Date(timelineCurrentYear, timelineCurrentMonth + 1, 0).getDate();
  const timelineFirstDayOfWeek = new Date(timelineCurrentYear, timelineCurrentMonth, 1).getDay();
  const timelinePrevMonthDays = new Date(timelineCurrentYear, timelineCurrentMonth, 0).getDate();

  const timelineCells: { date: Date; isCurrentMonth: boolean }[] = [];
  for (let i = timelineFirstDayOfWeek - 1; i >= 0; i--) {
    timelineCells.push({
      date: new Date(timelineCurrentYear, timelineCurrentMonth - 1, timelinePrevMonthDays - i),
      isCurrentMonth: false,
    });
  }
  for (let i = 1; i <= timelineDaysInMonth; i++) {
    timelineCells.push({
      date: new Date(timelineCurrentYear, timelineCurrentMonth, i),
      isCurrentMonth: true,
    });
  }
  const timelineRemaining = 35 - timelineCells.length;
  for (let i = 1; i <= Math.max(0, timelineRemaining); i++) {
    timelineCells.push({
      date: new Date(timelineCurrentYear, timelineCurrentMonth + 1, i),
      isCurrentMonth: false,
    });
  }

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] py-8 px-4 sm:px-6 lg:px-10 flex flex-col items-center">
      {/* 1440px desktop container */}
      <div className="w-full max-w-[1360px] flex flex-col gap-8">

        {/* TOP NAVIGATION BAR */}
        <header className="w-full flex items-center justify-between gap-4">
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

            {/* Active Pill: Assigned Services (with Site Visits active) */}
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
                className="glc-focus inline-flex h-14 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold bg-[#1C5F9D] text-text-inverse shadow-medium cursor-pointer transition-all"
              >
                <span className="grid size-9 place-items-center rounded-full bg-surface text-[#1C5F9D]">
                  <MapPin className="size-4" />
                </span>
                <span className="font-semibold text-sm">Site visits</span>
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
                    {/* Option 1: Maintenance services */}
                    <Link
                      href="/"
                      role="menuitem"
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium hover:bg-surface-hover text-text hover:text-accent transition-colors"
                    >
                      <div className="grid size-7 place-items-center rounded-lg bg-surface-muted text-text-secondary">
                        <FileCheck className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm whitespace-nowrap">Maintenance services</p>
                        <p className="text-[10px] text-text-muted">Maintenance and field tasks</p>
                      </div>
                    </Link>

                    {/* Option 2: Site visits (Active) */}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setIsNavDropdownOpen(false);
                        if (onBack) onBack();
                        else router.push("/site-visits");
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-medium bg-accent text-text-inverse font-semibold shadow-low transition-colors mt-1 cursor-pointer"
                    >
                      <div className="grid size-7 place-items-center rounded-lg bg-white/20 text-white">
                        <MapPin className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm whitespace-nowrap">Site visits</p>
                        <p className="text-[10px] text-white/80">Field inspection logs</p>
                      </div>
                      <span className="size-2 rounded-full bg-white shrink-0" />
                    </button>
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

            <div className="size-13 rounded-full overflow-hidden border-2 border-surface shadow-low grid place-items-center bg-accent-soft font-semibold text-accent-hover text-base">
              RB
            </div>
          </div>
        </header>

        {/* BREADCRUMB / BACK NAVIGATION BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack ? onBack : () => router.push("/site-visits")}
            className="glc-focus inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface px-4 py-2 text-xs font-semibold text-text shadow-xs hover:border-accent hover:text-accent hover:bg-surface-hover transition-colors cursor-pointer group"
          >
            <ChevronLeft className="size-4 text-text-muted group-hover:text-accent transition-colors" />
            <span>Back to Site Visits</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Link href="/" className="hover:text-accent transition-colors">Assigned Services</Link>
            <span>/</span>
            <button
              type="button"
              onClick={onBack ? onBack : () => router.push("/site-visits")}
              className="hover:text-accent transition-colors cursor-pointer"
            >
              Site Visits
            </button>
            <span>/</span>
            <span className="font-semibold text-text">{customerName}</span>
            <span className="text-[11px] text-accent font-medium">({farmlandId})</span>
          </div>
        </div>

        {/* TOP STATUS BANNER / CUSTOMER SUMMARY CARD */}
        <Card
          variant="default"
          padding="none"
          className="rounded-[24px] border border-border/60 bg-surface p-6 shadow-[0px_10px_30px_rgba(0,105,107,0.04)]"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Customer Avatar & Primary Identifiers */}
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-full bg-[#1C5F9D] text-white font-bold text-lg flex items-center justify-center shadow-low shrink-0">
                {customerName.slice(0, 2).toUpperCase()}
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="font-bold text-xl text-text bg-transparent border-b border-transparent hover:border-border focus:border-accent focus:outline-none transition-colors max-w-[200px]"
                    placeholder="Customer Name"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 text-sm text-text-muted">
                  <span className="text-text-secondary">Farmland ID:</span>
                  <input
                    type="text"
                    value={farmlandId}
                    onChange={(e) => setFarmlandId(e.target.value)}
                    className="font-semibold text-accent bg-transparent border-b border-transparent hover:border-border focus:border-accent focus:outline-none transition-colors w-28 text-sm"
                  />
                  <span>•</span>
                  <div className="inline-flex items-center gap-1.5 text-text-secondary">
                    <Phone className="size-3.5 text-accent" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="text-text-secondary bg-transparent border-b border-transparent hover:border-border focus:border-accent focus:outline-none transition-colors w-32 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Visit Status & Date Display */}
            <div className="flex items-center gap-6 self-end md:self-center">
              {/* Status Badge */}
              <div className="flex items-center gap-2 rounded-full bg-[#E5F6E6] border border-[#00801F]/30 px-3.5 py-1 text-xs font-semibold text-[#00801F]">
                <span className="size-2 rounded-full bg-[#00801F]" />
                <select
                  value={visitStatus}
                  onChange={(e) => setVisitStatus(e.target.value as "Completed" | "In Progress" | "Scheduled")}
                  className="bg-transparent font-semibold text-xs text-[#00801F] focus:outline-none cursor-pointer"
                >
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
              </div>

              {/* Timestamp */}
              <div className="text-right">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  Site Visit
                </p>
                <input
                  type="text"
                  value={scheduledHeader}
                  onChange={(e) => setScheduledHeader(e.target.value)}
                  className="font-bold text-base text-text text-right bg-transparent border-b border-transparent hover:border-border focus:border-accent focus:outline-none transition-colors w-44"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* 2-COLUMN GRID: Visit Details & Feedback Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* CARD 1: VISIT DETAILS (Retained from visit) */}
          <Card
            variant="default"
            padding="none"
            className="rounded-[28px] border border-border/60 bg-surface p-6 sm:p-8 shadow-[0px_10px_30px_rgba(0,105,107,0.04)] flex flex-col gap-6"
          >
            {/* Card Header with Icon */}
            <div className="flex items-center gap-3 border-b border-border/40 pb-4">
              <span className="grid size-9 place-items-center rounded-full bg-accent-soft text-accent">
                <MapPin className="size-4" />
              </span>
              <h2 className="text-lg font-bold text-text">Visit Details</h2>
            </div>

            {/* 2-Column Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Property ID */}
              <FormField label="PROPERTY ID">
                <Input
                  value={propertyId}
                  onChange={(e) => setPropertyId(e.target.value)}
                  className="font-semibold text-base text-text"
                />
              </FormField>

              {/* Farmland Location */}
              <FormField label="FARMLAND LOCATION">
                <Input
                  value={farmlandLocation}
                  onChange={(e) => setFarmlandLocation(e.target.value)}
                  className="text-sm text-text"
                />
              </FormField>

              {/* Buyer From */}
              <FormField label="BUYER FROM">
                <Input
                  value={buyerFrom}
                  onChange={(e) => setBuyerFrom(e.target.value)}
                  className="text-sm text-text"
                />
              </FormField>

              {/* Scheduled */}
              <FormField label="SCHEDULED">
                <Input
                  value={scheduled}
                  onChange={(e) => setScheduled(e.target.value)}
                  className="text-sm text-text"
                />
              </FormField>

              {/* Checked In */}
              <FormField label="CHECKED IN">
                <DateTimePicker
                  value={checkedIn}
                  onChange={(val) => setCheckedIn(val)}
                  placeholder="Select check-in date & time..."
                />
              </FormField>

              {/* Duration (hr and min selector) */}
              <FormField label="DURATION">
                <div className="flex h-11 items-center rounded-xl border border-border bg-surface px-3.5 gap-2 transition-[border-color,box-shadow] focus-within:border-accent focus-within:ring-3 focus-within:ring-accent/20 hover:border-border-strong">
                  <Clock className="size-4 text-accent shrink-0" aria-hidden="true" />

                  {/* Hours selector */}
                  <div className="relative flex-1 flex items-center min-w-0">
                    <select
                      aria-label="Duration hours"
                      value={durationHours}
                      onChange={(e) => handleDurationChange(Number(e.target.value), durationMinutes)}
                      className="w-full appearance-none bg-transparent pr-5 text-sm font-semibold text-text focus:outline-none cursor-pointer"
                    >
                      {Array.from({ length: 13 }, (_, i) => (
                        <option key={i} value={i} className="bg-surface text-text">
                          {i} {i === 1 ? "hr" : "hrs"}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-0.5 size-3.5 text-text-muted" />
                  </div>

                  <span className="text-border-strong select-none font-medium px-1">/</span>

                  {/* Minutes selector */}
                  <div className="relative flex-1 flex items-center min-w-0">
                    <select
                      aria-label="Duration minutes"
                      value={durationMinutes}
                      onChange={(e) => handleDurationChange(durationHours, Number(e.target.value))}
                      className="w-full appearance-none bg-transparent pr-5 text-sm font-semibold text-text focus:outline-none cursor-pointer"
                    >
                      {minuteOptions.map((m) => (
                        <option key={m} value={m} className="bg-surface text-text">
                          {m} min
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-0.5 size-3.5 text-text-muted" />
                  </div>
                </div>
              </FormField>

              {/* Visitors */}
              <FormField label="VISITORS">
                <Input
                  value={visitors}
                  onChange={(e) => setVisitors(e.target.value)}
                  className="text-sm text-text"
                />
              </FormField>

              {/* Accompanied By */}
              <FormField label="ACCOMPANIED BY">
                <div className="flex items-center gap-2">
                  <div className="size-9 rounded-full bg-accent text-white font-bold text-xs flex items-center justify-center shrink-0">
                    RB
                  </div>
                  <Input
                    value={accompaniedBy}
                    onChange={(e) => setAccompaniedBy(e.target.value)}
                    className="text-sm font-semibold text-text"
                  />
                </div>
              </FormField>
            </div>
          </Card>

          {/* CARD 2: FEEDBACK SUMMARY (Starts EMPTY for officer entry) */}
          <Card
            variant="default"
            padding="none"
            className="rounded-[28px] border border-border/60 bg-surface p-6 sm:p-8 shadow-[0px_10px_30px_rgba(0,105,107,0.04)] flex flex-col gap-6"
          >
            {/* Card Header with Icon */}
            <div className="flex items-center gap-3 border-b border-border/40 pb-4">
              <span className="grid size-9 place-items-center rounded-full bg-accent-soft text-accent">
                <ClipboardList className="size-4" />
              </span>
              <h2 className="text-lg font-bold text-text">Feedback Summary</h2>
            </div>

            {/* 2-Column Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Overall Experience */}
              <FormField label="OVERALL EXPERIENCE">
                <div className="flex items-center gap-3 h-11 px-3 rounded-xl border border-border bg-surface hover:border-border-strong transition-colors">
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setOverallRating(star)}
                        className="glc-focus text-[#F59E0B] hover:scale-125 transition-transform cursor-pointer"
                        aria-label={`Rate ${star} stars`}
                      >
                        <Star
                          className={`size-4.5 transition-colors ${
                            star <= overallRating
                              ? "fill-[#F59E0B] text-[#F59E0B]"
                              : "text-border stroke-[#C0C7D2]"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-bold text-text ml-auto">
                    {overallRating > 0 ? `${overallRating}/5` : "0/5"}
                  </span>
                </div>
              </FormField>

              {/* Interest Level */}
              <FormField label="INTEREST LEVEL">
                <div className="flex items-center gap-2 h-11">
                  {(["Hot", "Warm", "Cold"] as const).map((level) => (
                    <button
                      type="button"
                      key={level}
                      onClick={() => setInterestLevel(level)}
                      className={`glc-focus flex-1 inline-flex items-center justify-center gap-1 rounded-full py-2 px-2 text-xs font-semibold border transition-all cursor-pointer ${
                        interestLevel === level
                          ? level === "Hot"
                            ? "bg-danger-soft text-danger border-danger/40 shadow-xs"
                            : level === "Warm"
                            ? "bg-warning-soft text-warning border-warning/40 shadow-xs"
                            : "bg-surface-muted text-text-secondary border-border shadow-xs"
                          : "bg-surface text-text-muted border-border hover:bg-surface-hover"
                      }`}
                    >
                      {level === "Hot" && "🔥"}
                      {level === "Warm" && "⚡"}
                      {level === "Cold" && "❄️"}
                      <span>{level}</span>
                    </button>
                  ))}
                </div>
              </FormField>

              {/* Budget with Min - Max range and Lakh or Cr option */}
              <FormField label="BUDGET">
                <div className="flex h-11 items-center rounded-xl border border-border bg-surface overflow-hidden transition-[border-color,box-shadow] focus-within:border-accent focus-within:ring-3 focus-within:ring-accent/20 hover:border-border-strong">
                  <span className="pl-3.5 pr-1.5 text-sm font-semibold text-text-muted select-none">₹</span>

                  {/* Min Budget */}
                  <input
                    type="text"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value)}
                    placeholder="e.g. 55"
                    className="min-w-0 flex-1 bg-transparent px-2 text-sm font-semibold text-text outline-none placeholder:text-text-muted/60 text-center"
                  />

                  {/* Middle Dash Separator */}
                  <span className="px-1 text-sm font-bold text-text-muted select-none">–</span>

                  {/* Max Budget */}
                  <input
                    type="text"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value)}
                    placeholder="e.g. 65"
                    className="min-w-0 flex-1 bg-transparent px-2 text-sm font-semibold text-text outline-none placeholder:text-text-muted/60 text-center"
                  />

                  {/* Unit Selector */}
                  <div className="h-full border-l border-border shrink-0">
                    <CustomSelect
                      value={budgetUnit}
                      onChange={(v) => setBudgetUnit(v as "Lakh" | "Cr")}
                      options={["Lakh", "Cr"]}
                      size="sm"
                      triggerClassName="h-full border-0 rounded-none bg-surface-subtle px-3 text-xs font-bold text-text-secondary hover:bg-surface-muted min-w-[84px] shadow-none"
                    />
                  </div>
                </div>
              </FormField>

              {/* Preferred Plot Size - strictly in acres */}
              <FormField label="PREFERRED PLOT SIZE">
                <div className="flex h-11 items-center rounded-xl border border-border bg-surface overflow-hidden transition-[border-color,box-shadow] focus-within:border-accent focus-within:ring-3 focus-within:ring-accent/20 hover:border-border-strong">
                  <input
                    type="text"
                    value={plotSize}
                    onChange={(e) => setPlotSize(e.target.value)}
                    placeholder="e.g. 3"
                    className="min-w-0 flex-1 bg-transparent px-3.5 text-sm font-semibold text-text outline-none placeholder:text-text-muted/60"
                  />
                  <span className="h-full border-l border-border bg-surface-subtle px-3.5 flex items-center text-xs font-bold text-text-muted select-none">
                    Acres
                  </span>
                </div>
              </FormField>

              {/* Purchase Timeline: Unified Dropdown & Custom Date in same place */}
              <FormField label="PURCHASE TIMELINE">
                <PopoverPrimitive.Root open={isTimelineOpen} onOpenChange={handleTimelineOpenChange}>
                  <PopoverPrimitive.Trigger asChild>
                    <button
                      type="button"
                      aria-expanded={isTimelineOpen}
                      className={`glc-focus flex h-11 w-full items-center justify-between gap-2.5 rounded-xl border border-border bg-surface px-4 text-sm text-text transition-[border-color,box-shadow] hover:border-border-strong cursor-pointer select-none ${
                        isTimelineOpen ? "border-accent ring-3 ring-accent/20" : ""
                      }`}
                    >
                      {timelineType === "Custom" && customTimelineDate ? (
                        <div className="flex items-center gap-2 min-w-0">
                          <CalendarIcon className="size-4 text-accent shrink-0" />
                          <span className="font-semibold text-text truncate">
                            {formatReadableDate(customTimelineDate)}
                          </span>
                          <span className="inline-flex items-center shrink-0 rounded-lg bg-accent-soft px-2.5 py-0.5 text-xs font-bold text-accent border border-accent/20">
                            {getDaysFromNow(customTimelineDate)}
                          </span>
                        </div>
                      ) : timelineType ? (
                        <span className="font-semibold text-text truncate">{timelineType}</span>
                      ) : (
                        <span className="text-text-muted truncate">Select timeline...</span>
                      )}

                      <div className="flex items-center gap-1.5 shrink-0">
                        {(timelineType || customTimelineDate) && (
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              setTimelineType("");
                              setCustomTimelineDate("");
                            }}
                            className="grid size-5 place-items-center rounded-full hover:bg-surface-muted text-text-muted hover:text-text cursor-pointer transition-colors"
                            title="Clear timeline"
                          >
                            <X className="size-3" />
                          </span>
                        )}
                        <ChevronDown
                          className={`size-4 text-text-muted transition-transform duration-200 ${
                            isTimelineOpen ? "rotate-180 text-accent" : ""
                          }`}
                        />
                      </div>
                    </button>
                  </PopoverPrimitive.Trigger>

                  <PopoverPrimitive.Portal>
                    <PopoverPrimitive.Content
                      sideOffset={6}
                      align="start"
                      className="z-50 w-84 rounded-2xl border border-border/80 bg-surface p-3 text-text shadow-high outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-150"
                    >
                      {/* Presets */}
                      <div className="space-y-1 pb-2.5 border-b border-border/60">
                        <p className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-text-muted">
                          Standard Timelines
                        </p>
                        {[
                          { label: "Within 1 month", desc: "Purchase within 30 days" },
                          { label: "Within 2 months", desc: "Purchase within 60 days" },
                          { label: "Within 3 months", desc: "Purchase within 90 days" },
                        ].map((item) => {
                          const isSelected = timelineType === item.label;
                          return (
                            <button
                              key={item.label}
                              type="button"
                              onClick={() => {
                                setTimelineType(item.label as typeof timelineType);
                                setCustomTimelineDate("");
                                setIsTimelineOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-semibold transition-colors cursor-pointer select-none ${
                                isSelected
                                  ? "bg-accent-soft text-accent"
                                  : "text-text hover:bg-surface-hover"
                              }`}
                            >
                              <div>
                                <p>{item.label}</p>
                                <p className="text-[10px] text-text-muted font-normal">
                                  {item.desc}
                                </p>
                              </div>
                              {isSelected && <Check className="size-4 text-accent" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom Date Calendar */}
                      <div className="pt-2.5">
                        <div className="flex items-center justify-between px-2 pb-1.5">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                            <CalendarIcon className="size-3.5 text-accent" />
                            Select Custom Date
                          </p>
                          {timelineType === "Custom" && customTimelineDate && (
                            <span className="text-[10px] font-bold text-accent bg-accent-soft px-2 py-0.5 rounded-full">
                              {getDaysFromNow(customTimelineDate)}
                            </span>
                          )}
                        </div>

                        {/* Quick Day Presets */}
                        <div className="flex items-center gap-1.5 py-1.5 px-1 border-b border-border/40 overflow-x-auto">
                          {[
                            { label: "15 Days", d: 15 },
                            { label: "30 Days", d: 30 },
                            { label: "45 Days", d: 45 },
                            { label: "60 Days", d: 60 },
                          ].map((preset) => (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() => {
                                const target = new Date();
                                target.setDate(target.getDate() + preset.d);
                                setTimelineType("Custom");
                                setCustomTimelineDate(toISODate(target));
                                setIsTimelineOpen(false);
                              }}
                              className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-surface-subtle border border-border/60 text-text hover:bg-surface-hover hover:border-border transition-colors cursor-pointer shrink-0"
                            >
                              +{preset.label}
                            </button>
                          ))}
                        </div>

                        {/* Month navigation */}
                        <div className="flex items-center justify-between py-1 px-1">
                          <button
                            type="button"
                            disabled={!canTimelineGoPrevMonth}
                            onClick={() => {
                              if (!canTimelineGoPrevMonth) return;
                              setTimelineViewDate(
                                new Date(timelineCurrentYear, timelineCurrentMonth - 1, 1)
                              );
                            }}
                            className={`grid size-7 place-items-center rounded-lg transition-colors ${
                              canTimelineGoPrevMonth
                                ? "hover:bg-surface-hover text-text-secondary cursor-pointer"
                                : "opacity-25 cursor-not-allowed pointer-events-none text-text-muted/40"
                            }`}
                            aria-label="Previous month"
                          >
                            <ChevronLeft className="size-3.5" />
                          </button>
                          <span className="text-xs font-bold text-text">
                            {[
                              "January", "February", "March", "April", "May", "June",
                              "July", "August", "September", "October", "November", "December"
                            ][timelineCurrentMonth]} {timelineCurrentYear}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setTimelineViewDate(
                                new Date(timelineCurrentYear, timelineCurrentMonth + 1, 1)
                              )
                            }
                            className="grid size-7 place-items-center rounded-lg hover:bg-surface-hover text-text-secondary cursor-pointer"
                            aria-label="Next month"
                          >
                            <ChevronRight className="size-3.5" />
                          </button>
                        </div>

                        {/* Weekday headers */}
                        <div className="grid grid-cols-7 gap-1 text-center py-1">
                          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((wd) => (
                            <span key={wd} className="text-[10px] font-semibold text-text-muted">
                              {wd}
                            </span>
                          ))}
                        </div>

                        {/* Calendar cells */}
                        <div className="grid grid-cols-7 gap-1 pt-1">
                          {timelineCells.map((cell, idx) => {
                            const cellIso = toISODate(cell.date);
                            const isPast = cellIso < todayIso;
                            const isSelected =
                              timelineType === "Custom" &&
                              customTimelineDate === cellIso;
                            const isToday = cellIso === todayIso;

                            return (
                              <button
                                key={idx}
                                type="button"
                                disabled={isPast}
                                onClick={() => {
                                  if (isPast) return;
                                  setTimelineType("Custom");
                                  setCustomTimelineDate(cellIso);
                                  setIsTimelineOpen(false);
                                }}
                                className={`size-8 rounded-lg text-xs font-medium grid place-items-center transition-all select-none ${
                                  isPast
                                    ? "opacity-25 cursor-not-allowed pointer-events-none text-text-muted/30"
                                    : isSelected
                                    ? "bg-accent text-white font-bold shadow-xs hover:bg-accent-hover cursor-pointer"
                                    : isToday
                                    ? "border border-accent text-accent font-bold hover:bg-surface-hover cursor-pointer"
                                    : cell.isCurrentMonth
                                    ? "text-text hover:bg-surface-hover hover:text-accent cursor-pointer"
                                    : "text-text-muted/30 hover:bg-surface-hover/50 cursor-pointer"
                                }`}
                              >
                                {cell.date.getDate()}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </PopoverPrimitive.Content>
                  </PopoverPrimitive.Portal>
                </PopoverPrimitive.Root>
              </FormField>

              {/* Financing dropdown */}
              <FormField label="FINANCING">
                <CustomSelect
                  value={financing}
                  onChange={(val) => setFinancing(val)}
                  placeholder="Select financing option..."
                  options={[
                    { value: "Self-funded", label: "Self-funded", description: "Own savings / liquid capital" },
                    { value: "Bank loan", label: "Bank loan", description: "Agricultural or mortgage loan" },
                    { value: "Joint funding", label: "Joint funding", description: "Partner or family co-investment" },
                    { value: "Investor financed", label: "Investor financed", description: "External investor" },
                    { value: "Other", label: "Other", description: "Custom financing" },
                  ]}
                />
              </FormField>

              {/* Next Step dropdown */}
              <FormField label="NEXT STEP">
                <CustomSelect
                  value={nextStep}
                  onChange={(val) => setNextStep(val)}
                  placeholder="Select next step..."
                  options={[
                    { value: "Token payment", label: "Token payment" },
                    { value: "Second visit", label: "Second visit" },
                    { value: "Price negotiation", label: "Price negotiation" },
                    { value: "Document verification", label: "Document verification" },
                    { value: "Follow-up call", label: "Follow-up call" },
                    { value: "Dropped / Not interested", label: "Dropped / Not interested" },
                  ]}
                />
              </FormField>

              {/* Follow-up On Date Selector */}
              <FormField label="FOLLOW-UP ON">
                <DateTimePicker
                  value={followUpDate}
                  onChange={(val) => setFollowUpDate(val)}
                  placeholder="Select follow-up date & time..."
                  minDate={todayIso}
                />
              </FormField>
            </div>
          </Card>
        </div>

        {/* CARD 3: BUYER FEEDBACK (Starts EMPTY for officer entry) */}
        <Card
          variant="default"
          padding="none"
          className="rounded-[28px] border border-border/60 bg-surface p-6 sm:p-8 shadow-[0px_10px_30px_rgba(0,105,107,0.04)] flex flex-col gap-6"
        >
          {/* Card Header with Icon */}
          <div className="flex items-center gap-3 border-b border-border/40 pb-4">
            <span className="grid size-9 place-items-center rounded-full bg-accent-soft text-accent">
              <MessageSquareQuote className="size-4" />
            </span>
            <h2 className="text-lg font-bold text-text">Buyer Feedback</h2>
          </div>

          {/* Checkboxes Row: What Buyer Liked & Concerns Raised */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* What the Buyer Liked */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between pb-1 border-b border-border/50">
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-text uppercase">
                  <span className="grid size-6 place-items-center rounded-full bg-success-soft text-success">
                    <ThumbsUp className="size-3.5" />
                  </span>
                  <span>What the Buyer Liked</span>
                </div>
                {selectedLikes.length > 0 && (
                  <span className="text-[11px] font-bold text-success bg-success-soft px-2 py-0.5 rounded-full">
                    {selectedLikes.length} selected
                  </span>
                )}
              </div>

              {/* Checkboxes List */}
              <div className="flex flex-col gap-2">
                {likedOptions.map((point) => {
                  const isChecked = selectedLikes.includes(point);
                  const isDefault = defaultLikedPoints.includes(point);
                  return (
                    <div
                      key={point}
                      onClick={() => toggleLike(point)}
                      className={`group flex items-center justify-between gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                        isChecked
                          ? "bg-success-soft/30 border-success/40 text-text font-medium shadow-xs"
                          : "bg-surface border-border/70 hover:bg-surface-hover/70 hover:border-border text-text-secondary"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`size-5 rounded-md flex items-center justify-center border transition-all shrink-0 ${
                            isChecked
                              ? "bg-success border-success text-white shadow-xs"
                              : "border-border-strong bg-surface group-hover:border-accent"
                          }`}
                        >
                          {isChecked && <Check className="size-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-xs sm:text-sm truncate">{point}</span>
                      </div>

                      {!isDefault && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveCustomLike(point);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-text-muted hover:text-danger rounded-md transition-opacity cursor-pointer"
                          title="Remove custom option"
                        >
                          <X className="size-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add Custom Liked Checkbox */}
              <form onSubmit={handleAddCustomLike} className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={customLikeInput}
                  onChange={(e) => setCustomLikeInput(e.target.value)}
                  placeholder="+ Add custom liked feature..."
                  className="h-10 text-xs rounded-xl border border-dashed border-border px-3.5 bg-surface-subtle text-text placeholder:text-text-muted focus:bg-surface focus:border-accent focus:outline-none flex-1 transition-colors"
                />
                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  disabled={!customLikeInput.trim()}
                  className="h-10 rounded-xl px-4 text-xs font-bold gap-1 shrink-0"
                >
                  <Plus className="size-3.5" />
                  <span>Add</span>
                </Button>
              </form>
            </div>

            {/* Concerns Raised */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between pb-1 border-b border-border/50">
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-text uppercase">
                  <span className="grid size-6 place-items-center rounded-full bg-warning-soft text-warning">
                    <AlertTriangle className="size-3.5" />
                  </span>
                  <span>Concerns Raised</span>
                </div>
                {selectedConcerns.length > 0 && (
                  <span className="text-[11px] font-bold text-warning bg-warning-soft px-2 py-0.5 rounded-full">
                    {selectedConcerns.length} selected
                  </span>
                )}
              </div>

              {/* Checkboxes List */}
              <div className="flex flex-col gap-2">
                {concernOptions.map((point) => {
                  const isChecked = selectedConcerns.includes(point);
                  const isDefault = defaultConcernPoints.includes(point);
                  return (
                    <div
                      key={point}
                      onClick={() => toggleConcern(point)}
                      className={`group flex items-center justify-between gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                        isChecked
                          ? "bg-warning-soft/30 border-warning/40 text-text font-medium shadow-xs"
                          : "bg-surface border-border/70 hover:bg-surface-hover/70 hover:border-border text-text-secondary"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`size-5 rounded-md flex items-center justify-center border transition-all shrink-0 ${
                            isChecked
                              ? "bg-warning border-warning text-white shadow-xs"
                              : "border-border-strong bg-surface group-hover:border-warning"
                          }`}
                        >
                          {isChecked && <Check className="size-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-xs sm:text-sm truncate">{point}</span>
                      </div>

                      {!isDefault && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveCustomConcern(point);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-text-muted hover:text-danger rounded-md transition-opacity cursor-pointer"
                          title="Remove custom option"
                        >
                          <X className="size-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add Custom Concern Checkbox */}
              <form onSubmit={handleAddCustomConcern} className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={customConcernInput}
                  onChange={(e) => setCustomConcernInput(e.target.value)}
                  placeholder="+ Add custom concern..."
                  className="h-10 text-xs rounded-xl border border-dashed border-border px-3.5 bg-surface-subtle text-text placeholder:text-text-muted focus:bg-surface focus:border-warning focus:outline-none flex-1 transition-colors"
                />
                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  disabled={!customConcernInput.trim()}
                  className="h-10 rounded-xl px-4 text-xs font-bold gap-1 shrink-0"
                >
                  <Plus className="size-3.5" />
                  <span>Add</span>
                </Button>
              </form>
            </div>
          </div>

          {/* Buyer's Comments Textarea */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-text-secondary uppercase">
              <Quote className="size-4 text-text-muted" />
              <span>Buyer&apos;s Comments</span>
            </div>
            <Textarea
              value={buyerComments}
              onChange={(e) => setBuyerComments(e.target.value)}
              className="rounded-2xl border-accent/40 bg-accent-soft/10 text-sm text-text p-4 min-h-[90px] focus:ring-accent/20"
              placeholder="Enter direct feedback or comments from the buyer during visit..."
            />
          </div>

          {/* Executive's Notes Textarea */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-text-secondary uppercase">
              <FileEdit className="size-4 text-text-muted" />
              <span>Executive&apos;s Notes</span>
            </div>
            <Textarea
              value={executiveNotes}
              onChange={(e) => setExecutiveNotes(e.target.value)}
              className="rounded-2xl border-border bg-surface-subtle text-sm text-text p-4 min-h-[90px] focus:ring-accent/20"
              placeholder="Enter officer assessment, negotiation notes, next action points..."
            />
          </div>

          {/* Footer Metadata & Save Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/40">
            <p className="text-xs text-text-muted">
              Feedback submitted by <span className="font-semibold text-text">{accompaniedBy}</span> on 25 Sep 2026
            </p>

            <div className="flex items-center gap-3">
              {savedSuccess && (
                <span className="text-xs font-semibold text-success flex items-center gap-1 animate-in fade-in">
                  <Check className="size-4" /> Feedback saved successfully!
                </span>
              )}

              <Button
                variant="primary"
                size="md"
                onClick={handleSave}
                className="gap-2 px-6 rounded-full shadow-medium"
              >
                <Save className="size-4" />
                <span>Save Site Visit Feedback</span>
              </Button>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
