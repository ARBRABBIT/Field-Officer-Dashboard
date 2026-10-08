"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Calculator,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  DollarSign,
  Droplets,
  FileCheck,
  FileText,
  Home,
  LandPlot,
  MapPin,
  Plus,
  Receipt,
  Search,
  Send,
  Shield,
  Sparkles,
  Sprout,
  Trees,
  X,
} from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Avatar } from "@/components/ui";
import { ServiceRecord } from "./assigned-services-screen";

export interface GenerateEstimationScreenProps {
  record: ServiceRecord;
  onBack: () => void;
  onSuccess?: () => void;
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

export interface CostField {
  id: string;
  label: string;
  placeholder?: string;
  amount: number | string;
}

export interface ServiceEstimationState {
  landSize: string;
  estimatedFeet?: string;
  perFeetRate?: string;
  wireLength?: string;
  wireRate?: string;
  organicPlan?: "1 Year Plan" | "5-15 Year Plan";
  organicYears?: string;
  organicCustomDate?: string;
  yieldingCrops?: string[];
  description: string;
  fields: CostField[];
}

export interface YieldingCropInfo {
  name: string;
  category: "Fruit Crop" | "Timber & Agroforestry" | "Intercrop & Spice";
  icon: string;
  timeline: string;
  badge: string;
}

export const detailedYieldingCrops: YieldingCropInfo[] = [
  { name: "Mango", category: "Fruit Crop", icon: "🥭", timeline: "Yield in 3-4 yrs", badge: "High Yield" },
  { name: "Guava", category: "Fruit Crop", icon: "🍐", timeline: "Yield in 2-3 yrs", badge: "Fast Growth" },
  { name: "Pomegranate", category: "Fruit Crop", icon: "🍎", timeline: "Yield in 2.5-3 yrs", badge: "Commercial" },
  { name: "Lemon (Citrus)", category: "Fruit Crop", icon: "🍋", timeline: "Yield in 2 yrs", badge: "Year-Round" },
  { name: "Dragon Fruit", category: "Fruit Crop", icon: "🐉", timeline: "Yield in 1.5 yrs", badge: "High Value" },
  { name: "Papaya", category: "Fruit Crop", icon: "🍈", timeline: "Yield in 9-12 mos", badge: "Cash Crop" },
  { name: "Custard Apple", category: "Fruit Crop", icon: "🍈", timeline: "Yield in 3 yrs", badge: "Drought Hardy" },
  { name: "Amla (Gooseberry)", category: "Fruit Crop", icon: "🫒", timeline: "Yield in 3-4 yrs", badge: "Low Water" },
  { name: "Coconut", category: "Fruit Crop", icon: "🥥", timeline: "Yield in 5-6 yrs", badge: "Perennial" },
  { name: "Teakwood", category: "Timber & Agroforestry", icon: "🪵", timeline: "Harvest 12-15 yrs", badge: "High Value" },
  { name: "Sandalwood", category: "Timber & Agroforestry", icon: "🌳", timeline: "Harvest 15 yrs", badge: "Precious" },
  { name: "Red Sandalwood", category: "Timber & Agroforestry", icon: "🪵", timeline: "Harvest 15 yrs", badge: "Export Grade" },
  { name: "Malabar Neem", category: "Timber & Agroforestry", icon: "🌿", timeline: "Harvest 6-8 yrs", badge: "Fast Timber" },
  { name: "Mahogany", category: "Timber & Agroforestry", icon: "🌲", timeline: "Harvest 12-15 yrs", badge: "Hardwood" },
  { name: "Turmeric", category: "Intercrop & Spice", icon: "🫚", timeline: "Harvest 9 mos", badge: "Organic Spice" },
  { name: "Ginger", category: "Intercrop & Spice", icon: "🫚", timeline: "Harvest 8-9 mos", badge: "Intercrop" },
];

export const availableYieldingCrops = detailedYieldingCrops.map((c) => c.name);

function OrganicPlanDropdownUI({
  value,
  onChange,
}: {
  value: "1 Year Plan" | "5-15 Year Plan";
  onChange: (val: "1 Year Plan" | "5-15 Year Plan") => void;
}) {
  const [open, setOpen] = React.useState(false);

  const plans = [
    {
      id: "1 Year Plan" as const,
      title: "1 Year Plan",
      subtitle: "Annual organic soil testing, bio-fertilizers & routine crop care",
      badge: "Annual Package",
      icon: <Sprout className="size-4 text-emerald-600" />,
    },
    {
      id: "5-15 Year Plan" as const,
      title: "5-15 Year Plan",
      subtitle: "Multi-year commercial orchard setup & high-value timber agroforestry",
      badge: "Commercial / Long-Term",
      icon: <Trees className="size-4 text-[#1C5F9D]" />,
    },
  ];

  const currentPlan = plans.find((p) => p.id === value) || plans[0];

  return (
    <div className="w-full">
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <button
            type="button"
            className="glc-focus flex w-full h-12 items-center justify-between gap-3 px-4 rounded-2xl bg-surface border border-border/70 text-sm font-semibold text-text shadow-xs hover:border-border-strong cursor-pointer transition-[border-color,box-shadow]"
          >
            <div className="flex items-center gap-2.5 truncate">
              <span className="grid size-7 place-items-center rounded-lg bg-[#F0F7FD] shrink-0">
                {currentPlan.icon}
              </span>
              <span className="font-bold text-text truncate">{currentPlan.title}</span>
              <span className="text-[10px] font-bold text-[#1C5F9D] px-2 py-0.5 rounded-full bg-[#1C5F9D]/10 shrink-0">
                {currentPlan.badge}
              </span>
            </div>
            <ChevronDown
              className={`size-4 text-text-muted transition-transform duration-200 shrink-0 ${
                open ? "rotate-180 text-accent" : ""
              }`}
            />
          </button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            sideOffset={6}
            align="start"
            className="z-50 w-[360px] max-w-[90vw] rounded-2xl border border-border/80 bg-surface p-2 text-text shadow-high outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-150"
          >
            <div className="space-y-1">
              <p className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-text-muted">
                Select Organic Farming Plan
              </p>
              {plans.map((p) => {
                const isSelected = p.id === value;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      onChange(p.id);
                      setOpen(false);
                    }}
                    className={`w-full flex items-start justify-between gap-3 p-3 rounded-xl text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#1C5F9D]/10 border border-[#1C5F9D]/30 text-text"
                        : "hover:bg-surface-hover text-text border border-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="grid size-7 place-items-center rounded-lg bg-surface shrink-0 shadow-2xs mt-0.5">
                        {p.icon}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-text">{p.title}</span>
                          <span className="text-[10px] font-bold text-[#1C5F9D] px-2 py-0.5 rounded-full bg-white border border-[#1C5F9D]/20">
                            {p.badge}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted mt-0.5 leading-snug">
                          {p.subtitle}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="size-4.5 text-[#1C5F9D] shrink-0 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  );
}

function OrganicCustomDatePicker({
  value,
  onChange,
}: {
  value: string; // YYYY-MM-DD
  onChange: (val: string, calculatedYears?: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  // Parse ISO date
  const parsedDate = React.useMemo(() => {
    if (!value) return new Date(2031, 9, 24);
    const parts = value.split("-").map((p) => parseInt(p, 10));
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    const d = new Date(value);
    return isNaN(d.getTime()) ? new Date(2031, 9, 24) : d;
  }, [value]);

  const [viewYear, setViewYear] = React.useState(parsedDate.getFullYear());
  const [viewMonth, setViewMonth] = React.useState(parsedDate.getMonth());

  // Keep view in sync when opening
  React.useEffect(() => {
    if (open) {
      setViewYear(parsedDate.getFullYear());
      setViewMonth(parsedDate.getMonth());
    }
  }, [open, parsedDate]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const shortMonths = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const availableYears = [
    2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039, 2040, 2041
  ];

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      if (viewYear > 2027) {
        setViewYear(viewYear - 1);
        setViewMonth(11);
      }
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      if (viewYear < 2041) {
        setViewYear(viewYear + 1);
        setViewMonth(0);
      }
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // Calendar cells
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

  const cells: { dateStr: string; day: number; isCurrentMonth: boolean }[] = [];

  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    const m = viewMonth === 0 ? 12 : viewMonth;
    const y = viewMonth === 0 ? viewYear - 1 : viewYear;
    cells.push({
      dateStr: `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      day,
      isCurrentMonth: false,
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({
      dateStr: `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`,
      day: i,
      isCurrentMonth: true,
    });
  }

  const remaining = 35 - cells.length;
  for (let i = 1; i <= Math.max(0, remaining); i++) {
    const m = viewMonth === 11 ? 1 : viewMonth + 2;
    const y = viewMonth === 11 ? viewYear + 1 : viewYear;
    cells.push({
      dateStr: `${y}-${String(m).padStart(2, "0")}-${String(i).padStart(2, "0")}`,
      day: i,
      isCurrentMonth: false,
    });
  }

  const calculatedYears = calculateYearsFromDate(value);
  const formattedDisplay = `${parsedDate.getDate()} ${shortMonths[parsedDate.getMonth()]} ${parsedDate.getFullYear()}`;

  const handleSelectDay = (dateStr: string) => {
    const years = calculateYearsFromDate(dateStr);
    onChange(dateStr, years);
    setOpen(false);
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          className={`glc-focus flex w-full h-12 items-center justify-between gap-3 px-4 rounded-2xl bg-surface border border-border/70 text-sm font-semibold text-text shadow-xs hover:border-border-strong cursor-pointer transition-[border-color,box-shadow] ${
            open ? "border-accent ring-2 ring-accent/20" : ""
          }`}
        >
          <div className="flex items-center gap-2.5 truncate">
            <span className="grid size-7 place-items-center rounded-lg bg-[#1C5F9D]/10 text-[#1C5F9D] shrink-0">
              <Calendar className="size-4 text-[#1C5F9D]" />
            </span>
            <span className="font-bold text-text truncate">
              {formattedDisplay}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold text-[#1C5F9D] px-2.5 py-0.5 rounded-full bg-[#1C5F9D]/10 border border-[#1C5F9D]/20">
              {calculatedYears} {calculatedYears === "1" ? "Year" : "Years"} Plan
            </span>
            <ChevronDown
              className={`size-4 text-text-muted transition-transform duration-200 ${
                open ? "rotate-180 text-accent" : ""
              }`}
            />
          </div>
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={6}
          align="start"
          className="z-50 w-[340px] max-w-[92vw] rounded-2xl border border-border/80 bg-surface p-4 text-text shadow-high outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-150"
        >
          {/* Header with Month / Year Dropdowns & Navigation */}
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-border/60">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={viewYear === 2027 && viewMonth === 0}
              className="grid size-8 place-items-center rounded-lg text-text-secondary hover:bg-surface-hover hover:text-text disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronLeft className="size-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {/* Month Selector */}
              <div className="relative">
                <select
                  value={viewMonth}
                  onChange={(e) => setViewMonth(parseInt(e.target.value, 10))}
                  className="appearance-none bg-surface-muted hover:bg-surface-hover text-xs font-bold text-text pl-2.5 pr-6 py-1.5 rounded-lg border border-border/60 focus:outline-none focus:border-accent cursor-pointer"
                >
                  {months.map((m, idx) => (
                    <option key={m} value={idx}>
                      {m}
                    </option>
                  ))}
                </select>
                <ChevronDown className="size-3 text-text-muted pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
              </div>

              {/* Year Selector */}
              <div className="relative">
                <select
                  value={viewYear}
                  onChange={(e) => setViewYear(parseInt(e.target.value, 10))}
                  className="appearance-none bg-surface-muted hover:bg-surface-hover text-xs font-bold text-text pl-2.5 pr-6 py-1.5 rounded-lg border border-border/60 focus:outline-none focus:border-accent cursor-pointer"
                >
                  {availableYears.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr} ({yr - 2026}Y)
                    </option>
                  ))}
                </select>
                <ChevronDown className="size-3 text-text-muted pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              disabled={viewYear === 2041 && viewMonth === 11}
              className="grid size-8 place-items-center rounded-lg text-text-secondary hover:bg-surface-hover hover:text-text disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center py-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((wd) => (
              <span key={wd} className="text-[11px] font-semibold text-text-muted select-none">
                {wd}
              </span>
            ))}
          </div>

          {/* Calendar Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((cell, idx) => {
              const isSelected = cell.dateStr === value;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectDay(cell.dateStr)}
                  className={`size-9 rounded-xl text-xs font-medium grid place-items-center transition-all select-none cursor-pointer ${
                    isSelected
                      ? "bg-[#1C5F9D] text-white font-bold shadow-xs hover:bg-[#1C5F9D]/90"
                      : cell.isCurrentMonth
                      ? "text-text hover:bg-surface-hover hover:text-accent font-semibold"
                      : "text-text-muted/40 hover:bg-surface-hover/50"
                  }`}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          {/* Footer with calculated plan information */}
          <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between text-xs">
            <span className="text-text-muted">Target Duration:</span>
            <span className="font-bold text-[#1C5F9D]">
              {calculatedYears} {calculatedYears === "1" ? "Year" : "Years"} Cultivation Plan
            </span>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

function YieldingCropDropdownUI({
  value,
  onChange,
  size = "md",
}: {
  value: string;
  onChange: (crop: string) => void;
  size?: "sm" | "md";
}) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");

  const currentCropInfo =
    detailedYieldingCrops.find((c) => c.name.toLowerCase() === value?.toLowerCase()) ||
    detailedYieldingCrops[0];

  const filteredCrops = React.useMemo(() => {
    return detailedYieldingCrops.filter((crop) => {
      const matchesSearch =
        crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crop.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" ||
        (selectedCategory === "Fruit Crops" && crop.category === "Fruit Crop") ||
        (selectedCategory === "Timber" && crop.category === "Timber & Agroforestry") ||
        (selectedCategory === "Spices" && crop.category === "Intercrop & Spice");
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="w-full">
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <button
            type="button"
            className={`glc-focus flex w-full items-center justify-between gap-3 text-left bg-surface border border-border/70 font-semibold text-text shadow-xs hover:border-border-strong cursor-pointer transition-[border-color,box-shadow] ${
              size === "md"
                ? "h-12 px-4 rounded-2xl text-sm"
                : "h-11 px-3.5 rounded-xl text-sm bg-[#F8FAFC] border-border/60"
            } ${open ? "border-accent ring-2 ring-accent/20" : ""}`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <span className="text-base shrink-0">{currentCropInfo.icon}</span>
              <span className="font-bold text-text truncate">
                {currentCropInfo.name}
              </span>
              <span className="text-[10px] font-bold text-[#1C5F9D] px-2 py-0.5 rounded-full bg-[#1C5F9D]/10 shrink-0">
                {currentCropInfo.badge}
              </span>
            </div>
            <ChevronDown
              className={`size-4 text-text-muted transition-transform duration-200 shrink-0 ${
                open ? "rotate-180 text-accent" : ""
              }`}
            />
          </button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            sideOffset={6}
            align="start"
            className="z-50 w-[380px] max-w-[92vw] rounded-2xl border border-border/80 bg-surface p-3 text-text shadow-high outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-150"
          >
            {/* Search Input */}
            <div className="relative mb-2.5">
              <Search className="size-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search crop variety..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-8 text-xs font-semibold rounded-xl bg-surface-muted border border-border/50 text-text placeholder:text-text-muted/60 focus:outline-none focus:border-accent focus:bg-surface"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1 pb-2 border-b border-border/50 overflow-x-auto">
              {["All", "Fruit Crops", "Timber", "Spices"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#1C5F9D] text-white"
                      : "bg-surface text-text-muted hover:bg-surface-hover hover:text-text"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Crops List */}
            <div className="max-h-64 overflow-y-auto divide-y divide-border/30 pt-1">
              {filteredCrops.length === 0 ? (
                <div className="py-6 text-center text-xs text-text-muted">
                  No crops found matching "{searchQuery}"
                </div>
              ) : (
                filteredCrops.map((crop) => {
                  const isSelected =
                    crop.name.toLowerCase() === value?.toLowerCase();
                  return (
                    <button
                      key={crop.name}
                      type="button"
                      onClick={() => {
                        onChange(crop.name);
                        setOpen(false);
                      }}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-left transition-colors cursor-pointer rounded-xl ${
                        isSelected
                          ? "bg-[#1C5F9D]/10 text-text font-semibold"
                          : "hover:bg-surface-hover text-text"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xl shrink-0">{crop.icon}</span>
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-text truncate">
                              {crop.name}
                            </span>
                            <span className="text-[10px] font-bold text-[#1C5F9D] px-1.5 py-0.5 rounded-md bg-[#1C5F9D]/10">
                              {crop.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-text-muted truncate">
                            {crop.timeline} • {crop.category}
                          </p>
                        </div>
                      </div>

                      {isSelected && (
                        <Check className="size-4 text-[#1C5F9D] shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  );
}

const defaultBorewellFields: CostField[] = [
  { id: "labour", label: "Labour Charges", amount: 15000 },
  { id: "inspection", label: "Inspection Charges", amount: 5000 },
  { id: "estimatedFeets", label: "Estimated Feets", amount: 45000 },
  { id: "casingPipe", label: "Casing Pipe Charges", amount: 20000 },
  { id: "pump", label: "Pump Charges", amount: 35000 },
  { id: "electric", label: "Electric Charges", amount: 12000 },
  { id: "tax", label: "Tax (GST)", amount: 8000 },
  { id: "glcFee", label: "GLC Fee", amount: 5000 },
];

const defaultFencingFields: CostField[] = [
  { id: "labour", label: "Labour Charges", amount: 25000 },
  { id: "inspection", label: "Inspection Charges", amount: 5000 },
  { id: "wireLength", label: "Wire Length", amount: 60000 },
  { id: "materials", label: "Material & Mesh Charges", amount: 50000 },
  { id: "poles", label: "Pole Erection Charges", amount: 45000 },
  { id: "gate", label: "Gate Installation Charges", amount: 15000 },
  { id: "tax", label: "Tax (GST)", amount: 7000 },
  { id: "glcFee", label: "GLC Fee", amount: 3000 },
];

const defaultFarmhouseFields: CostField[] = [
  { id: "labour", label: "Labour Charges", amount: 80000 },
  { id: "inspection", label: "Inspection & Architecture", amount: 20000 },
  { id: "civil", label: "Civil & Foundation Charges", amount: 190000 },
  { id: "plumbingElectrical", label: "Plumbing & Electrical", amount: 90000 },
  { id: "finishing", label: "Finishing & Painting", amount: 40000 },
  { id: "tax", label: "Tax (GST)", amount: 20000 },
  { id: "glcFee", label: "GLC Fee", amount: 10000 },
];

const defaultOrganicFarmingFields: CostField[] = [
  { id: "soilPrep", label: "Soil Testing & Land Preparation", amount: 15000 },
  { id: "manureCompost", label: "Organic Manure & Bio-Fertilizers", amount: 20000 },
  { id: "farmerFees", label: "Farmer Fees", amount: 18000 },
  { id: "dripIrrigation", label: "Drip Irrigation Setup", amount: 25000 },
  { id: "yieldingCrops", label: "Select Yielding Crops", amount: 0 },
  { id: "seedCharges", label: "Seed Charges", amount: 10000 },
  { id: "plantingCharges", label: "Planting Charges", amount: 8000 },
  { id: "bioPestControl", label: "Bio-Pest Control & Mulching", amount: 8000 },
  { id: "tax", label: "Tax (GST)", amount: 3000 },
  { id: "glcFee", label: "GLC Fee", amount: 2000 },
];

function formatINR(val: number) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(val);
}

function formatDisplayCustomDate(isoDate?: string): string {
  if (!isoDate) return "Oct 24, 2031";
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return isoDate;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  } catch {
    return isoDate;
  }
}

function calculateYearsFromDate(isoDate?: string): string {
  if (!isoDate) return "5";
  try {
    const parts = isoDate.split("-").map((p) => parseInt(p, 10));
    if (parts.length >= 1 && !isNaN(parts[0])) {
      const diff = parts[0] - 2026;
      return diff > 0 ? String(diff) : "1";
    }
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return "5";
    const baseYear = 2026;
    const diff = d.getFullYear() - baseYear;
    return diff > 0 ? String(diff) : "1";
  } catch {
    return "5";
  }
}

export function GenerateEstimationScreen({
  record,
  onBack,
  onSuccess,
}: GenerateEstimationScreenProps) {
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

  // Available service categories
  const availableServices = React.useMemo(() => {
    if (record.services && record.services.length > 0) {
      const names = record.services.map((s) => s.serviceName);
      if (!names.some((n) => n.toLowerCase().includes("organic"))) {
        names.push("Organic Farming");
      }
      return names;
    }
    return ["Borewell", "Fencing", "Farmhouse Construction", "Organic Farming"];
  }, [record]);

  const [activeServiceIdx, setActiveServiceIdx] = React.useState(0);
  const activeServiceName = availableServices[activeServiceIdx] || availableServices[0] || "Borewell";
  const [confirmedServices, setConfirmedServices] = React.useState<Set<string>>(new Set());
  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
  const [isAllServicesPreviewOpen, setIsAllServicesPreviewOpen] = React.useState(false);
  const [expandedServices, setExpandedServices] = React.useState<Record<string, boolean>>({
    Borewell: true,
    Fencing: true,
    "Farmhouse Construction": true,
    "Organic Farming": true,
  });
  const [redirectingStage, setRedirectingStage] = React.useState<{
    nextServiceName: string;
    nextIndex?: number;
    isWorkOrder?: boolean;
  } | null>(null);
  const redirectTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
    };
  }, []);

  // State map by service name
  const [estimations, setEstimations] = React.useState<Record<string, ServiceEstimationState>>({
    Borewell: {
      landSize: record.land || "5.0 Acres",
      estimatedFeet: "450 Feet",
      perFeetRate: "₹100 / Foot",
      description: "Includes complete drilling up to 450ft, casing pipe installation, submersible pump fitting, electrical line setup, and water yield testing.",
      fields: defaultBorewellFields,
    },
    Fencing: {
      landSize: record.land || "5.0 Acres",
      wireLength: "1,200 Meters",
      wireRate: "₹50 / Meter",
      description: "Includes perimeter boundary marking, heavy-duty stone pole erection at 8ft intervals, 12-gauge barbed wire fixing, and main gate installation.",
      fields: defaultFencingFields,
    },
    "Farmhouse Construction": {
      landSize: record.land || "5.0 Acres",
      description: "Includes site clearing, 2-BHK structure foundation, brickwork, roofing, electrical and sanitary plumbing, tile flooring, and exterior finishing.",
      fields: defaultFarmhouseFields,
    },
    "Organic Farming": {
      landSize: record.land || "5.0 Acres",
      organicPlan: "1 Year Plan",
      organicYears: "5",
      organicCustomDate: "2031-10-24",
      yieldingCrops: ["Mango"],
      description: "Includes soil pH & nutrient testing, organic composting, micro-drip irrigation installation, certified non-GMO seed/sapling plantation, and biological pest control setup.",
      fields: defaultOrganicFarmingFields,
    },
  });

  // Get active service estimation
  const currentEst = estimations[activeServiceName] || {
    landSize: record.land || "5.0 Acres",
    estimatedFeet: "450 Feet",
    perFeetRate: "₹100 / Foot",
    wireLength: "1,200 Meters",
    wireRate: "₹50 / Meter",
    organicPlan: "1 Year Plan",
    organicYears: "5",
    organicCustomDate: "2031-10-24",
    yieldingCrops: ["Mango"],
    description: "",
    fields: defaultBorewellFields,
  };

  // Update a single cost field value
  const handleCostFieldChange = (fieldId: string, rawVal: string) => {
    // Strip non-digits except dot
    const cleanVal = rawVal.replace(/[^0-9]/g, "");
    const numericVal = cleanVal ? parseInt(cleanVal, 10) : "";

    setEstimations((prev) => {
      const currentServiceEst = prev[activeServiceName] || {
        landSize: record.land || "",
        estimatedFeet: "450 Feet",
        perFeetRate: "₹100 / Foot",
        wireLength: "1,200 Meters",
        wireRate: "₹50 / Meter",
        description: "",
        fields: defaultBorewellFields,
      };

      const updatedFields = currentServiceEst.fields.map((f) => {
        if (f.id === fieldId) {
          return { ...f, amount: numericVal };
        }
        return f;
      });

      return {
        ...prev,
        [activeServiceName]: {
          ...currentServiceEst,
          fields: updatedFields,
        },
      };
    });
  };

  // Helper to calculate feet * rate
  const calcBorewellFeetCharge = (feetStr: string, rateStr: string) => {
    const feetNum = parseInt(feetStr.replace(/[^0-9]/g, "") || "0", 10);
    const rateNum = parseInt(rateStr.replace(/[^0-9]/g, "") || "0", 10);
    return feetNum * rateNum;
  };

  // Helper to calculate wire length * rate
  const calcFencingWireCharge = (lengthStr: string, rateStr: string) => {
    const lengthNum = parseInt(lengthStr.replace(/[^0-9]/g, "") || "0", 10);
    const rateNum = parseInt(rateStr.replace(/[^0-9]/g, "") || "0", 10);
    return lengthNum * rateNum;
  };

  // Update land size
  const handleLandSizeChange = (val: string) => {
    setEstimations((prev) => {
      const currentServiceEst = prev[activeServiceName] || {
        landSize: "",
        estimatedFeet: "450 Feet",
        perFeetRate: "₹100 / Foot",
        wireLength: "1,200 Meters",
        wireRate: "₹50 / Meter",
        description: "",
        fields: defaultBorewellFields,
      };
      return {
        ...prev,
        [activeServiceName]: {
          ...currentServiceEst,
          landSize: val,
        },
      };
    });
  };

  // Update estimated feet for borewell and auto-calculate charge
  const handleEstimatedFeetChange = (val: string) => {
    setEstimations((prev) => {
      const currentServiceEst = prev[activeServiceName] || {
        landSize: "",
        estimatedFeet: "450 Feet",
        perFeetRate: "₹100 / Foot",
        wireLength: "1,200 Meters",
        wireRate: "₹50 / Meter",
        description: "",
        fields: defaultBorewellFields,
      };

      const newFeeCharge = calcBorewellFeetCharge(
        val,
        currentServiceEst.perFeetRate || "100"
      );

      const updatedFields = currentServiceEst.fields.map((f) => {
        if (f.id === "estimatedFeets") {
          return { ...f, amount: newFeeCharge > 0 ? newFeeCharge : 0 };
        }
        return f;
      });

      return {
        ...prev,
        [activeServiceName]: {
          ...currentServiceEst,
          estimatedFeet: val,
          fields: updatedFields,
        },
      };
    });
  };

  // Update per feet rate for borewell and auto-calculate charge
  const handlePerFeetRateChange = (val: string) => {
    setEstimations((prev) => {
      const currentServiceEst = prev[activeServiceName] || {
        landSize: "",
        estimatedFeet: "450 Feet",
        perFeetRate: "₹100 / Foot",
        wireLength: "1,200 Meters",
        wireRate: "₹50 / Meter",
        description: "",
        fields: defaultBorewellFields,
      };

      const newFeeCharge = calcBorewellFeetCharge(
        currentServiceEst.estimatedFeet || "450",
        val
      );

      const updatedFields = currentServiceEst.fields.map((f) => {
        if (f.id === "estimatedFeets") {
          return { ...f, amount: newFeeCharge > 0 ? newFeeCharge : 0 };
        }
        return f;
      });

      return {
        ...prev,
        [activeServiceName]: {
          ...currentServiceEst,
          perFeetRate: val,
          fields: updatedFields,
        },
      };
    });
  };

  // Update wire length for fencing and auto-calculate charge
  const handleWireLengthChange = (val: string) => {
    setEstimations((prev) => {
      const currentServiceEst = prev[activeServiceName] || {
        landSize: "",
        estimatedFeet: "450 Feet",
        perFeetRate: "₹100 / Foot",
        wireLength: "1,200 Meters",
        wireRate: "₹50 / Meter",
        description: "",
        fields: defaultFencingFields,
      };

      const newFeeCharge = calcFencingWireCharge(
        val,
        currentServiceEst.wireRate || "50"
      );

      const updatedFields = currentServiceEst.fields.map((f) => {
        if (f.id === "wireLength") {
          return { ...f, amount: newFeeCharge > 0 ? newFeeCharge : 0 };
        }
        return f;
      });

      return {
        ...prev,
        [activeServiceName]: {
          ...currentServiceEst,
          wireLength: val,
          fields: updatedFields,
        },
      };
    });
  };

  // Update wire rate for fencing and auto-calculate charge
  const handleWireRateChange = (val: string) => {
    setEstimations((prev) => {
      const currentServiceEst = prev[activeServiceName] || {
        landSize: "",
        estimatedFeet: "450 Feet",
        perFeetRate: "₹100 / Foot",
        wireLength: "1,200 Meters",
        wireRate: "₹50 / Meter",
        description: "",
        fields: defaultFencingFields,
      };

      const newFeeCharge = calcFencingWireCharge(
        currentServiceEst.wireLength || "1200",
        val
      );

      const updatedFields = currentServiceEst.fields.map((f) => {
        if (f.id === "wireLength") {
          return { ...f, amount: newFeeCharge > 0 ? newFeeCharge : 0 };
        }
        return f;
      });

      return {
        ...prev,
        [activeServiceName]: {
          ...currentServiceEst,
          wireRate: val,
          fields: updatedFields,
        },
      };
    });
  };

  // Update description
  const handleDescriptionChange = (val: string) => {
    setEstimations((prev) => {
      const currentServiceEst = prev[activeServiceName] || {
        landSize: "",
        description: "",
        fields: defaultBorewellFields,
      };
      return {
        ...prev,
        [activeServiceName]: {
          ...currentServiceEst,
          description: val,
        },
      };
    });
  };

  // Update Organic Farming Plan (1 Year Plan vs 5-15 Year Plan)
  const handleOrganicPlanChange = (plan: "1 Year Plan" | "5-15 Year Plan") => {
    setEstimations((prev) => {
      const currentServiceEst = prev[activeServiceName] || {
        landSize: record.land || "5.0 Acres",
        organicPlan: "1 Year Plan",
        organicYears: "5",
        organicCustomDate: "2031-10-24",
        yieldingCrops: ["Mango", "Guava", "Teakwood"],
        description: "",
        fields: defaultOrganicFarmingFields,
      };

      return {
        ...prev,
        [activeServiceName]: {
          ...currentServiceEst,
          organicPlan: plan,
          organicYears: plan === "5-15 Year Plan" ? currentServiceEst.organicYears || "5" : undefined,
          organicCustomDate: plan === "5-15 Year Plan" ? currentServiceEst.organicCustomDate || "2031-10-24" : undefined,
        },
      };
    });
  };

  // Update Organic Farming Custom Date for 5-15 Year Plan
  const handleOrganicCustomDateChange = (dateVal: string, explicitYears?: string) => {
    const calculatedYears = explicitYears || calculateYearsFromDate(dateVal);
    setEstimations((prev) => {
      const currentServiceEst = prev[activeServiceName] || {
        landSize: record.land || "5.0 Acres",
        organicPlan: "5-15 Year Plan",
        organicYears: calculatedYears,
        organicCustomDate: dateVal,
        yieldingCrops: ["Mango", "Guava", "Teakwood"],
        description: "",
        fields: defaultOrganicFarmingFields,
      };

      return {
        ...prev,
        [activeServiceName]: {
          ...currentServiceEst,
          organicCustomDate: dateVal,
          organicYears: calculatedYears,
        },
      };
    });
  };

  // Legacy/Fallback handler for Organic Farming Years
  const handleOrganicYearsChange = (years: string) => {
    const cleanYears = years.replace(/[^0-9]/g, "");
    const numericYears = parseInt(cleanYears, 10) || 5;
    const targetYear = 2026 + numericYears;
    const computedDate = `${targetYear}-10-24`;

    setEstimations((prev) => {
      const currentServiceEst = prev[activeServiceName] || {
        landSize: record.land || "5.0 Acres",
        organicPlan: "5-15 Year Plan",
        organicYears: "5",
        organicCustomDate: "2031-10-24",
        yieldingCrops: ["Mango", "Guava", "Teakwood"],
        description: "",
        fields: defaultOrganicFarmingFields,
      };

      return {
        ...prev,
        [activeServiceName]: {
          ...currentServiceEst,
          organicYears: cleanYears,
          organicCustomDate: computedDate,
        },
      };
    });
  };

  // Update single yielding crop (one selection only)
  const handleSingleYieldingCropChange = (crop: string) => {
    setEstimations((prev) => {
      const currentServiceEst = prev[activeServiceName] || {
        landSize: record.land || "5.0 Acres",
        organicPlan: "1 Year Plan",
        organicYears: "5",
        organicCustomDate: "2031-10-24",
        yieldingCrops: [crop],
        description: "",
        fields: defaultOrganicFarmingFields,
      };

      return {
        ...prev,
        [activeServiceName]: {
          ...currentServiceEst,
          yieldingCrops: [crop],
        },
      };
    });
  };

  // Automatically calculate total cost by summing all fields
  const calculatedTotal = React.useMemo(() => {
    return currentEst.fields.reduce((sum, item) => {
      const num = typeof item.amount === "number" ? item.amount : parseInt(String(item.amount).replace(/,/g, "") || "0", 10) || 0;
      return sum + num;
    }, 0);
  }, [currentEst.fields]);

  const rawId = record.farmlandId ? record.farmlandId.replace(/\D/g, "") || "01" : "01";
  const displayId = `ID ${rawId}`;

  // Helper to calculate total for any service
  const getServiceTotal = React.useCallback(
    (serviceName: string) => {
      const est = estimations[serviceName];
      if (!est) return 0;
      return est.fields.reduce((sum, item) => {
        const num =
          typeof item.amount === "number"
            ? item.amount
            : parseInt(String(item.amount).replace(/,/g, "") || "0", 10) || 0;
        return sum + num;
      }, 0);
    },
    [estimations]
  );

  // Grand total for all requested services
  const grandTotalAllServices = React.useMemo(() => {
    return availableServices.reduce((sum, s) => sum + getServiceTotal(s), 0);
  }, [availableServices, getServiceTotal]);

  const toggleServiceExpanded = (serviceName: string) => {
    setExpandedServices((prev) => ({
      ...prev,
      [serviceName]: !prev[serviceName],
    }));
  };

  const getServiceIcon = (serviceName: string) => {
    const s = serviceName.toLowerCase();
    if (s.includes("borewell")) {
      return <Droplets className="size-4 text-[#1C5F9D]" />;
    }
    if (s.includes("fencing")) {
      return <Shield className="size-4 text-[#00801F]" />;
    }
    if (s.includes("farmhouse")) {
      return <Home className="size-4 text-[#854D0E]" />;
    }
    if (s.includes("organic")) {
      return <Sprout className="size-4 text-[#166534]" />;
    }
    return <Trees className="size-4 text-[#1C5F9D]" />;
  };

  const getServiceSummaryText = (
    serviceName: string,
    est: ServiceEstimationState
  ) => {
    const s = serviceName.toLowerCase();
    if (s.includes("borewell")) {
      return `${est.estimatedFeet || "450 Feet"} • ${est.perFeetRate || "₹100 / Foot"}`;
    }
    if (s.includes("fencing")) {
      return `${est.wireLength || "1,200 Meters"} Wire • ${est.wireRate || "₹50 / Meter"}`;
    }
    if (s.includes("farmhouse")) {
      return "2-BHK Structure Foundation & Finishing";
    }
    if (s.includes("organic")) {
      const plan = est.organicPlan || "1 Year Plan";
      const crop = est.yieldingCrops?.[0] || "Mango";
      return `${plan} • Yielding Crop: ${crop}`;
    }
    return est.description ? est.description.slice(0, 45) + "..." : "";
  };

  const handleDispatch = () => {
    // If all services are already confirmed, dispatch button directly opens full preview
    const allOthersConfirmed = availableServices.every(
      (s) => s === activeServiceName || confirmedServices.has(s)
    );
    if (confirmedServices.has(activeServiceName) && allOthersConfirmed) {
      setIsAllServicesPreviewOpen(true);
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDispatch = () => {
    const updatedConfirmed = new Set(confirmedServices);
    updatedConfirmed.add(activeServiceName);
    setConfirmedServices(updatedConfirmed);
    setIsConfirmModalOpen(false);

    if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);

    // Check if this is the last service or if all services are now confirmed
    const nextIdx = activeServiceIdx + 1;
    const allConfirmed = availableServices.every((s) => updatedConfirmed.has(s));
    const isLastService = nextIdx >= availableServices.length || allConfirmed;

    if (isLastService) {
      // Hey when confirm last service it should give a preview pop up of all the services and then give proceed CTA
      setIsAllServicesPreviewOpen(true);
      return;
    }

    // Advance to next service tab (e.g. Borewell -> Fencing -> Farmhouse -> Organic Farming)
    if (nextIdx < availableServices.length) {
      const nextName = availableServices[nextIdx];
      setRedirectingStage({
        nextServiceName: nextName,
        nextIndex: nextIdx,
        isWorkOrder: false,
      });

      redirectTimeoutRef.current = setTimeout(() => {
        setActiveServiceIdx(nextIdx);
        setRedirectingStage(null);
      }, 1800);
    } else {
      // Check if any previous service was left unconfirmed
      const unconfirmedIdx = availableServices.findIndex(
        (s) => !updatedConfirmed.has(s)
      );
      if (unconfirmedIdx !== -1) {
        const nextName = availableServices[unconfirmedIdx];
        setRedirectingStage({
          nextServiceName: nextName,
          nextIndex: unconfirmedIdx,
          isWorkOrder: false,
        });

        redirectTimeoutRef.current = setTimeout(() => {
          setActiveServiceIdx(unconfirmedIdx);
          setRedirectingStage(null);
        }, 1800);
      } else {
        // Last service confirmed, open preview popup of all services
        setIsAllServicesPreviewOpen(true);
      }
    }
  };

  const handleProceedFromPreview = () => {
    setIsAllServicesPreviewOpen(false);
    if (onSuccess) {
      onSuccess();
    } else {
      onBack();
    }
  };

  const handleImmediateRedirect = () => {
    if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
    if (!redirectingStage) return;

    if (redirectingStage.isWorkOrder) {
      setRedirectingStage(null);
      if (onSuccess) onSuccess();
      else onBack();
    } else if (typeof redirectingStage.nextIndex === "number") {
      setActiveServiceIdx(redirectingStage.nextIndex);
      setRedirectingStage(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] py-8 px-4 sm:px-6 lg:px-10 2xl:px-14 3xl:px-16 4xl:px-20 flex flex-col items-center animate-in fade-in duration-200">
      <div className="w-full max-w-[1440px] 2xl:max-w-[1780px] 3xl:max-w-[2180px] 4xl:max-w-[2400px] flex flex-col gap-8">
        
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

        {/* MAIN CONTENT SECTION */}
        <div className="flex flex-col gap-6 w-full">
          
          {/* BREADCRUMB NAVIGATION */}
          <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-text-muted">
            <button
              type="button"
              onClick={onBack}
              className="hover:text-accent font-medium transition-colors cursor-pointer"
            >
              Field officer Dashboard
            </button>
            <ChevronRight className="size-3.5 text-text-muted/60" />
            <button
              type="button"
              onClick={onBack}
              className="hover:text-accent font-medium transition-colors cursor-pointer"
            >
              Assigned Services
            </button>
            <ChevronRight className="size-3.5 text-text-muted/60" />
            <button
              type="button"
              onClick={onBack}
              className="hover:text-accent font-medium transition-colors cursor-pointer"
            >
              Assigned
            </button>
            <ChevronRight className="size-3.5 text-text-muted/60" />
            <button
              type="button"
              onClick={onBack}
              className="hover:text-accent font-medium transition-colors cursor-pointer"
            >
              {record.customer}
            </button>
            <ChevronRight className="size-3.5 text-text-muted/60" />
            <span className="font-semibold text-text" aria-current="page">
              Generate Estimation
            </span>
          </nav>

          {/* PAGE HEADER: Back Button & Title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to active service request"
              className="glc-focus grid size-10 place-items-center rounded-full bg-surface text-text border border-border/50 shadow-xs hover:bg-surface-hover transition-colors cursor-pointer"
            >
              <ArrowLeft className="size-5 text-text" />
            </button>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-text">
              Generate Official Estimation – {displayId}
            </h1>
          </div>

          {/* 3-Column Summary Strip */}
          <div className="w-full rounded-2xl bg-surface border border-border/60 p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-2 shadow-xs">
            {/* 1. Owner Name */}
            <div className="sm:pr-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                OWNER NAME
              </p>
              <p className="text-base font-bold text-text mt-0.5">
                {record.customer}
              </p>
            </div>

            {/* 2. Service Category */}
            <div className="sm:border-l sm:border-[#E2E8F0] sm:px-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                SERVICE CATEGORY
              </p>
              <p className="text-base font-bold text-text mt-0.5">
                {activeServiceName} {availableServices.length > 1 ? `+${availableServices.length - 1} Others` : ""}
              </p>
            </div>

            {/* 3. Site Location */}
            <div className="sm:border-l sm:border-[#E2E8F0] sm:pl-6">
              <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                SITE LOCATION
              </p>
              <p className="text-base font-bold text-[#16A34A] mt-0.5 flex items-center gap-1.5">
                <MapPin className="size-4 text-[#16A34A] shrink-0" />
                <span>{record.location || "Hyderabad"}</span>
              </p>
            </div>
          </div>

          {/* Service Selection Switcher Pills */}
          <div className="flex flex-wrap items-center gap-3">
            {availableServices.map((srvName, idx) => {
              const isActive = activeServiceIdx === idx;
              const isConfirmed = confirmedServices.has(srvName);
              return (
                <button
                  key={srvName}
                  type="button"
                  onClick={() => setActiveServiceIdx(idx)}
                  className={`glc-focus rounded-full px-5 py-2.5 text-sm font-semibold transition-all cursor-pointer flex items-center gap-2.5 ${
                    isActive
                      ? "bg-[#1C5F9D] text-white shadow-xs"
                      : "bg-[#F1F3F5] text-text hover:bg-[#E2E6EA]"
                  }`}
                >
                  {isConfirmed ? (
                    <span className="size-5 rounded-full bg-[#86EFAC] text-[#15803D] flex items-center justify-center text-xs font-bold shrink-0 animate-in zoom-in-75 duration-200 shadow-2xs">
                      ✓
                    </span>
                  ) : (
                    <span className="size-5 rounded-full bg-[#FFA8A8] text-[#B91C1C] flex items-center justify-center text-xs font-extrabold shrink-0 shadow-2xs">
                      !
                    </span>
                  )}
                  <span>{srvName}</span>
                </button>
              );
            })}
          </div>

          {/* ESTIMATION FORM WITH DETAILED ITEMIZED COST BREAKDOWN */}
          <div className="flex flex-col gap-6 pt-1">
            
            {/* Header with Title & Live Calculated Total Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#F0F7FD] to-[#E9F4FE] border border-[#B8D8F4] p-5 rounded-2xl">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-text">
                  Itemized Cost Breakdown for {activeServiceName}
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Enter component charges below. Total cost calculates automatically in real-time.
                </p>
              </div>

              {/* Live Calculated Total Display */}
              <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-xl border border-[#B8D8F4] shadow-xs shrink-0">
                <div className="grid size-8 place-items-center rounded-lg bg-[#1C5F9D]/10 text-[#1C5F9D]">
                  <Calculator className="size-4.5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Total Estimated Cost
                  </p>
                  <p className="text-lg sm:text-xl font-extrabold text-[#1C5F9D] leading-tight">
                    ₹{formatINR(calculatedTotal)}
                  </p>
                </div>
              </div>
            </div>

            {/* Row: Land Size & Service Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-4">
              <div className="w-full">
                <label className="block text-xs font-semibold text-text-muted mb-2">
                  Enter Land Size
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5.0 Acres"
                  value={currentEst.landSize}
                  onChange={(e) => handleLandSizeChange(e.target.value)}
                  className="glc-focus w-full h-12 px-4 rounded-2xl bg-surface border border-border/70 text-sm font-semibold text-text placeholder:text-text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent shadow-xs"
                />
              </div>

              {activeServiceName === "Borewell" && (
                <>
                  <div className="w-full">
                    <label className="block text-xs font-semibold text-text-muted mb-2">
                      Estimated Feets
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 450 Feet"
                      value={currentEst.estimatedFeet || "450 Feet"}
                      onChange={(e) => handleEstimatedFeetChange(e.target.value)}
                      className="glc-focus w-full h-12 px-4 rounded-2xl bg-surface border border-border/70 text-sm font-semibold text-text placeholder:text-text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent shadow-xs"
                    />
                  </div>

                  <div className="w-full">
                    <label className="block text-xs font-semibold text-text-muted mb-2">
                      Per Feet Rate
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹100 / Foot"
                      value={currentEst.perFeetRate || "₹100 / Foot"}
                      onChange={(e) => handlePerFeetRateChange(e.target.value)}
                      className="glc-focus w-full h-12 px-4 rounded-2xl bg-surface border border-border/70 text-sm font-semibold text-text placeholder:text-text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent shadow-xs"
                    />
                  </div>
                </>
              )}

              {activeServiceName === "Fencing" && (
                <>
                  <div className="w-full">
                    <label className="block text-xs font-semibold text-text-muted mb-2">
                      Wire Length
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1,200 Meters"
                      value={currentEst.wireLength || "1,200 Meters"}
                      onChange={(e) => handleWireLengthChange(e.target.value)}
                      className="glc-focus w-full h-12 px-4 rounded-2xl bg-surface border border-border/70 text-sm font-semibold text-text placeholder:text-text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent shadow-xs"
                    />
                  </div>

                  <div className="w-full">
                    <label className="block text-xs font-semibold text-text-muted mb-2">
                      Wire Rate
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹50 / Meter"
                      value={currentEst.wireRate || "₹50 / Meter"}
                      onChange={(e) => handleWireRateChange(e.target.value)}
                      className="glc-focus w-full h-12 px-4 rounded-2xl bg-surface border border-border/70 text-sm font-semibold text-text placeholder:text-text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent shadow-xs"
                    />
                  </div>
                </>
              )}

              {activeServiceName === "Organic Farming" && (
                <>
                  {/* Organic Farming Plan: 1 Year Plan vs 5-15 Year Plan */}
                  <div className="w-full">
                    <label className="block text-xs font-semibold text-text-muted mb-2">
                      Organic Farming Plan
                    </label>
                    <OrganicPlanDropdownUI
                      value={currentEst.organicPlan || "1 Year Plan"}
                      onChange={handleOrganicPlanChange}
                    />
                  </div>

                  {/* If 5-15 Year Plan is selected, show Custom Date field */}
                  {currentEst.organicPlan === "5-15 Year Plan" && (
                    <div className="w-full animate-in fade-in duration-200">
                      <label className="block text-xs font-semibold text-text-muted mb-2">
                        Custom Date (1–15 Years)
                      </label>
                      <OrganicCustomDatePicker
                        value={currentEst.organicCustomDate || "2031-10-24"}
                        onChange={handleOrganicCustomDateChange}
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            {/* DETAILED ITEMIZED CHARGES GRID */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
                Cost Breakdown Items ({currentEst.fields.length} components)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-4 sm:gap-5">
                {currentEst.fields.map((field) => {
                  const isYieldingCropField =
                    field.id === "yieldingCrops" || field.id === "saplingsSeeds";

                  if (isYieldingCropField && activeServiceName === "Organic Farming") {
                    return (
                      <div
                        key={field.id}
                        className="p-4 rounded-2xl bg-surface border border-border/70 shadow-xs flex flex-col justify-between gap-2.5 hover:border-border-strong transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-text">
                            Select Yielding Crops
                          </span>
                          <span className="text-[10px] font-bold text-[#1C5F9D] px-2 py-0.5 rounded-full bg-[#1C5F9D]/10">
                            Crop Variety
                          </span>
                        </div>

                        {/* Dropdown to select ONE crop only with custom UI */}
                        <YieldingCropDropdownUI
                          value={currentEst.yieldingCrops?.[0] || "Mango"}
                          onChange={handleSingleYieldingCropChange}
                          size="sm"
                        />
                      </div>
                    );
                  }

                  return (
                    <div
                      key={field.id}
                      className="p-4 rounded-2xl bg-surface border border-border/70 shadow-xs flex flex-col justify-between gap-2.5 hover:border-border-strong transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="text-xs font-semibold text-text">
                            {field.label}
                          </span>
                          {field.id === "estimatedFeets" && activeServiceName === "Borewell" && (
                            <span className="text-[11px] text-text-muted font-medium">
                              ({currentEst.estimatedFeet?.replace(/[^0-9]/g, "") || "450"} ft × ₹{currentEst.perFeetRate?.replace(/[^0-9]/g, "") || "100"})
                            </span>
                          )}
                          {field.id === "wireLength" && activeServiceName === "Fencing" && (
                            <span className="text-[11px] text-text-muted font-medium">
                              ({currentEst.wireLength?.replace(/[^0-9]/g, "") || "1200"} m × ₹{currentEst.wireRate?.replace(/[^0-9]/g, "") || "50"})
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wide text-text-muted shrink-0">
                          INR
                        </span>
                      </div>

                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-sm font-bold text-text-muted pointer-events-none">
                          ₹
                        </span>
                        <input
                          type="text"
                          value={
                            field.amount !== ""
                              ? formatINR(
                                  typeof field.amount === "number"
                                    ? field.amount
                                    : parseInt(String(field.amount), 10) || 0
                                )
                              : ""
                          }
                          placeholder="0"
                          onChange={(e) => handleCostFieldChange(field.id, e.target.value)}
                          className="glc-focus w-full h-11 pl-7 pr-3.5 rounded-xl bg-[#F8FAFC] border border-border/50 text-sm font-bold text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Full Width Field: Service Description */}
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-2">
                Enter Service Scope & Notes
              </label>
              <textarea
                rows={4}
                placeholder="Describe the scope of work, parts required, and labor details..."
                value={currentEst.description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                className="w-full rounded-2xl bg-surface border border-border/70 p-4 text-sm text-text placeholder:text-text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none leading-relaxed shadow-xs"
              />
            </div>

            {/* Summary & Final Auto-Calculated Total Card */}
            <div className="w-full rounded-2xl bg-[#F8FAFC] border border-border/70 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-[#10B981]/10 text-[#10B981]">
                  <Receipt className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-text">
                    Calculated Summary for {activeServiceName}
                  </p>
                  <p className="text-[11px] text-text-muted">
                    {activeServiceName === "Borewell"
                      ? "Sum of Labour, Inspection, Estimated Feets, Borewell, Pump, Electric, Tax & GLC Fees"
                      : activeServiceName === "Fencing"
                      ? "Sum of Labour, Inspection, Wire Length, Materials, Poles, Gate, Tax & GLC Fees"
                      : activeServiceName === "Organic Farming"
                      ? "Sum of Soil Testing, Manure, Farmer Fees, Drip Irrigation, Yielding Crops, Pest Control, Tax & GLC Fees"
                      : "Sum of all itemized charges, taxes and official GLC fees"}
                  </p>
                </div>
              </div>

              <div className="text-right sm:text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Final Estimation Amount
                </p>
                <p className="text-2xl font-extrabold text-[#1C5F9D]">
                  ₹{formatINR(calculatedTotal)}
                </p>
              </div>
            </div>

            {/* Bottom Footer Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EAEFF4] mt-2 flex-wrap">
              {confirmedServices.size > 0 && (
                <button
                  type="button"
                  onClick={() => setIsAllServicesPreviewOpen(true)}
                  className="glc-focus h-12 px-6 rounded-full border border-border/80 bg-surface hover:bg-surface-hover text-text font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ClipboardList className="size-4 text-[#1C5F9D]" />
                  <span>Preview All Services</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleDispatch}
                style={{ fontWeight: 600 }}
                className="glc-focus h-12 px-8 rounded-full bg-[#96C9ED] hover:bg-[#7FBDE9] active:scale-[0.99] text-black font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="font-semibold" style={{ fontWeight: 600 }}>Dispatch Estimations</span>
                <span className="font-semibold" style={{ fontWeight: 600 }}>(₹{formatINR(calculatedTotal)})</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* CONFIRMATION POPUP MODAL */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg bg-surface rounded-[28px] border border-border shadow-high p-6 sm:p-8 flex flex-col gap-6 animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="size-12 rounded-2xl bg-[#96C9ED]/20 text-[#1C5F9D] grid place-items-center shrink-0">
                  <Send className="size-6 text-[#1C5F9D]" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-text">
                    Confirm Dispatch Estimation
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    Official quote notification will be sent to the customer.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                aria-label="Close modal"
                className="size-8 rounded-full grid place-items-center text-text-muted hover:text-text hover:bg-surface-muted transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Estimation Summary Box */}
            <div className="rounded-2xl bg-[#F8FAFC] border border-border/70 p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text-muted">Customer</span>
                <span className="font-bold text-text">{record.customer}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text-muted">Farmland ID</span>
                <span className="font-bold text-text">{displayId}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text-muted">Service</span>
                <span className="font-bold text-text">{activeServiceName}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text-muted">Land Size</span>
                <span className="font-bold text-text">{currentEst.landSize || record.land || "5.0 Acres"}</span>
              </div>
              {activeServiceName === "Organic Farming" && (
                <>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-text-muted">Organic Plan</span>
                    <span className="font-bold text-text">
                      {currentEst.organicPlan || "1 Year Plan"}
                      {currentEst.organicPlan === "5-15 Year Plan" ? ` (${currentEst.organicYears || calculateYearsFromDate(currentEst.organicCustomDate)} Years)` : ""}
                    </span>
                  </div>
                  {currentEst.organicPlan === "5-15 Year Plan" && currentEst.organicCustomDate && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-text-muted">Custom Date</span>
                      <span className="font-bold text-[#1C5F9D]">
                        {formatDisplayCustomDate(currentEst.organicCustomDate)}
                      </span>
                    </div>
                  )}
                  {currentEst.yieldingCrops && currentEst.yieldingCrops.length > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-text-muted">Yielding Crop</span>
                      <span className="font-bold text-[#1C5F9D] flex items-center gap-1.5">
                        <span>
                          {detailedYieldingCrops.find(
                            (c) => c.name.toLowerCase() === currentEst.yieldingCrops?.[0]?.toLowerCase()
                          )?.icon || "🥭"}
                        </span>
                        <span>{currentEst.yieldingCrops[0] || "Mango"}</span>
                      </span>
                    </div>
                  )}
                </>
              )}
              <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Total Quote Amount
                </span>
                <span className="text-xl font-extrabold text-[#1C5F9D]">
                  ₹{formatINR(calculatedTotal)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="glc-focus h-12 px-6 rounded-full border border-border/80 bg-surface hover:bg-surface-hover text-text font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDispatch}
                style={{ fontWeight: 600 }}
                className="glc-focus h-12 px-7 rounded-full bg-[#96C9ED] hover:bg-[#7FBDE9] active:scale-[0.99] text-black font-semibold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center gap-2"
              >
                <span>
                  {activeServiceIdx === availableServices.length - 1 ||
                  availableServices.every(
                    (s) => s === activeServiceName || confirmedServices.has(s)
                  )
                    ? "Confirm & Preview All Services"
                    : "Confirm & Dispatch"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ALL SERVICES PREVIEW MODAL */}
      {isAllServicesPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-4xl max-h-[92vh] bg-surface rounded-[28px] border border-border shadow-high flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="all-services-preview-title"
          >
            {/* Sticky Header */}
            <div className="flex items-start justify-between gap-4 p-5 sm:p-6 pb-4 border-b border-border/70 bg-surface shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="size-12 rounded-2xl bg-[#96C9ED]/20 text-[#1C5F9D] grid place-items-center shrink-0">
                  <ClipboardList className="size-6 text-[#1C5F9D]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3
                      id="all-services-preview-title"
                      className="text-lg sm:text-xl font-bold text-text"
                    >
                      All Services Estimation Preview
                    </h3>
                    <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E5F6E6] text-[#00801F] border border-[#00801F]/20">
                      <Check className="size-3" />
                      All Services Confirmed
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">
                    Review comprehensive breakdown across all{" "}
                    {availableServices.length} requested services before proceeding to work order.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAllServicesPreviewOpen(false)}
                aria-label="Close modal to edit"
                className="size-8 rounded-full grid place-items-center text-text-muted hover:text-text hover:bg-surface-muted transition-colors cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {/* Customer & Farmland Overview Strip */}
              <div className="rounded-2xl bg-[#F8FAFC] border border-border/70 p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-[11px] font-semibold text-text-muted block">
                    Customer
                  </span>
                  <span className="text-sm font-bold text-text mt-0.5 block">
                    {record.customer}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-text-muted block">
                    Farmland ID
                  </span>
                  <span className="text-sm font-bold text-text mt-0.5 block">
                    {displayId}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-text-muted block">
                    Land Size
                  </span>
                  <span className="text-sm font-bold text-text mt-0.5 block">
                    {record.land || "5.0 Acres"}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-text-muted block">
                    Location
                  </span>
                  <span className="text-sm font-bold text-text mt-0.5 block truncate">
                    {record.location || "Hyderabad, Telangana"}
                  </span>
                </div>
              </div>

              {/* List of All Services */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                    Itemized Service Breakdown ({availableServices.length} Services)
                  </h4>
                  <span className="text-xs text-text-muted">
                    Click any service to toggle line items
                  </span>
                </div>

                <div className="space-y-3.5">
                  {availableServices.map((sName) => {
                    const sTotal = getServiceTotal(sName);
                    const est = estimations[sName] || { fields: [] };
                    const isExpanded = expandedServices[sName] ?? true;

                    return (
                      <div
                        key={sName}
                        className="rounded-2xl border border-border/80 bg-surface overflow-hidden shadow-2xs hover:border-[#1C5F9D]/30 transition-colors"
                      >
                        {/* Service Header Row */}
                        <div
                          onClick={() => toggleServiceExpanded(sName)}
                          className="p-4 sm:p-4.5 bg-[#FAFBFD] flex items-center justify-between gap-3 cursor-pointer select-none hover:bg-surface-hover/80 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="size-9 rounded-xl bg-surface border border-border/60 grid place-items-center shrink-0 shadow-2xs">
                              {getServiceIcon(sName)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-sm text-text">
                                  {sName}
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E5F6E6] text-[#00801F] border border-[#00801F]/20">
                                  Confirmed
                                </span>
                              </div>
                              <p className="text-[11px] text-text-muted truncate mt-0.5">
                                {getServiceSummaryText(sName, est)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <span className="text-[10px] uppercase font-bold text-text-muted block">
                                Quotation
                              </span>
                              <span className="text-sm sm:text-base font-extrabold text-[#1C5F9D]">
                                ₹{formatINR(sTotal)}
                              </span>
                            </div>
                            <span className="text-text-muted p-1">
                              <ChevronDown
                                className={`size-4 transition-transform duration-200 ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              />
                            </span>
                          </div>
                        </div>

                        {/* Expanded Itemized Line Items */}
                        {isExpanded && (
                          <div className="p-4 sm:p-4.5 border-t border-border/60 bg-surface">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                              {est.fields.map((fld) => {
                                const amt =
                                  typeof fld.amount === "number"
                                    ? fld.amount
                                    : parseInt(
                                        String(fld.amount).replace(/,/g, "") ||
                                          "0",
                                        10
                                      ) || 0;
                                return (
                                  <div
                                    key={fld.id}
                                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8FAFC] border border-border/40"
                                  >
                                    <span className="text-text-muted truncate mr-2">
                                      {fld.label}
                                    </span>
                                    <span className="font-semibold text-text shrink-0">
                                      {amt === 0 && fld.id === "yieldingCrops" ? (
                                        <span className="text-[#1C5F9D] font-bold">
                                          {est.yieldingCrops?.[0] || "Selected"}
                                        </span>
                                      ) : (
                                        `₹${formatINR(amt)}`
                                      )}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Grand Total Summary Card */}
              <div className="rounded-2xl bg-gradient-to-br from-[#1C5F9D]/8 via-[#96C9ED]/15 to-[#1C5F9D]/5 border-2 border-[#1C5F9D]/30 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1C5F9D] text-white uppercase tracking-wider">
                    Consolidated Final Quotation
                  </span>
                  <h4 className="text-base font-bold text-text pt-1">
                    Grand Total ({availableServices.length} Services Combined)
                  </h4>
                  <p className="text-xs text-text-muted max-w-md">
                    Includes all field machinery, labour, materials, organic setup, seed & planting charges, taxes (GST), and platform fee.
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0 bg-surface/90 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none w-full sm:w-auto border sm:border-0 border-border/40">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block">
                    Total Quotation Amount
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#1C5F9D] tracking-tight">
                    ₹{formatINR(grandTotalAllServices)}
                  </span>
                </div>
              </div>
            </div>

            {/* Sticky Modal Footer with Proceed CTA */}
            <div className="p-4 sm:p-5 border-t border-border/80 bg-surface flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsAllServicesPreviewOpen(false)}
                className="w-full sm:w-auto h-11 px-6 rounded-full border border-border/80 bg-surface hover:bg-surface-hover text-text font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ArrowLeft className="size-4" />
                <span>Back to Edit</span>
              </button>

              <button
                type="button"
                onClick={handleProceedFromPreview}
                style={{ fontWeight: 600 }}
                className="w-full sm:w-auto h-11 px-8 rounded-full bg-[#96C9ED] hover:bg-[#7FBDE9] active:scale-[0.99] text-black font-semibold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Proceed to Work Order</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REDIRECTING POPUP MODAL */}
      {redirectingStage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-surface rounded-[28px] border border-border shadow-high p-6 sm:p-8 flex flex-col items-center text-center gap-5 animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Animated Icon with subtle pulse ring */}
            <div className="relative">
              <div className="size-16 rounded-full bg-[#E5F6E6] text-[#00801F] grid place-items-center shrink-0">
                <Check className="size-8 text-[#00801F]" />
              </div>
              <span className="absolute inset-0 rounded-full bg-[#00801F]/20 animate-ping" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-text">
                Estimation Dispatched!
              </h3>
              <p className="text-sm text-text-muted leading-relaxed max-w-xs">
                You are redirecting to <span className="font-bold text-text">{redirectingStage.nextServiceName}</span> (the next stage)...
              </p>
            </div>

            {/* Smooth animated progress bar */}
            <div className="w-full max-w-xs h-1.5 bg-surface-muted rounded-full overflow-hidden">
              <div className="h-full bg-[#1C5F9D] rounded-full animate-pulse w-full" />
            </div>

            <div className="w-full pt-1">
              <button
                type="button"
                onClick={handleImmediateRedirect}
                style={{ fontWeight: 600 }}
                className="w-full h-11 px-6 rounded-full bg-[#1C5F9D] hover:bg-[#164E83] active:scale-[0.99] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Proceed to {redirectingStage.nextServiceName}</span>
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
