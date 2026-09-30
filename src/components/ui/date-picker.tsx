"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";

// --- Date Helpers ---
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function formatReadableDate(date: Date): string {
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()].slice(0, 3);
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

function formatReadableTime(hours: number, minutes: number): string {
  const ampm = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;
  const mStr = minutes.toString().padStart(2, "0");
  return `${h12}:${mStr} ${ampm}`;
}

// Convert "YYYY-MM-DD" or ISO to Date
function parseDateString(str?: string): Date | null {
  if (!str) return null;
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

// Format Date to "YYYY-MM-DD"
function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Format Date to "YYYY-MM-DDTHH:mm"
function toISODateTime(date: Date, hours: number, minutes: number): string {
  const datePart = toISODate(date);
  const h = hours.toString().padStart(2, "0");
  const m = minutes.toString().padStart(2, "0");
  return `${datePart}T${h}:${m}`;
}

// ----------------------------------------------------
// 1. DATE PICKER (GLC Design System)
// ----------------------------------------------------
export interface DatePickerProps {
  value?: string; // YYYY-MM-DD
  onChange: (val: string) => void;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
  className?: string;
  triggerClassName?: string;
  disabled?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date...",
  minDate,
  maxDate,
  className,
  triggerClassName,
  disabled = false,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const selectedDate = React.useMemo(() => parseDateString(value), [value]);

  const [viewDate, setViewDate] = React.useState(() => {
    return selectedDate ? new Date(selectedDate) : new Date();
  });

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && selectedDate) {
      setViewDate(new Date(selectedDate));
    }
  };

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const canGoPrevMonth = React.useMemo(() => {
    if (!minDate) return true;
    const min = parseDateString(minDate);
    if (!min) return true;
    const minYear = min.getFullYear();
    const minMonth = min.getMonth();
    if (currentYear < minYear) return false;
    if (currentYear === minYear && currentMonth <= minMonth) return false;
    return true;
  }, [minDate, currentYear, currentMonth]);

  const handlePrevMonth = () => {
    if (!canGoPrevMonth) return;
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Calendar cells generation
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

  const cells: { date: Date; isCurrentMonth: boolean }[] = [];

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    cells.push({
      date: new Date(currentYear, currentMonth - 1, prevMonthDays - i),
      isCurrentMonth: false,
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({
      date: new Date(currentYear, currentMonth, i),
      isCurrentMonth: true,
    });
  }

  const remaining = 35 - cells.length;
  for (let i = 1; i <= Math.max(0, remaining); i++) {
    cells.push({
      date: new Date(currentYear, currentMonth + 1, i),
      isCurrentMonth: false,
    });
  }

  const today = new Date();
  const isToday = (d: Date) =>
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  const isSelected = (d: Date) =>
    selectedDate &&
    d.getDate() === selectedDate.getDate() &&
    d.getMonth() === selectedDate.getMonth() &&
    d.getFullYear() === selectedDate.getFullYear();

  const isDateDisabled = (d: Date) => {
    if (minDate && toISODate(d) < minDate) return true;
    if (maxDate && toISODate(d) > maxDate) return true;
    return false;
  };

  const selectPreset = (daysFromNow: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysFromNow);
    const targetIso = toISODate(target);
    if (minDate && targetIso < minDate) return;
    if (maxDate && targetIso > maxDate) return;
    onChange(targetIso);
    setOpen(false);
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger asChild disabled={disabled}>
        <button
          type="button"
          aria-expanded={open}
          className={cn(
            "glc-focus flex h-11 w-full items-center justify-between gap-2.5 rounded-xl border border-border bg-surface px-4 text-sm text-text transition-[border-color,box-shadow] hover:border-border-strong cursor-pointer select-none",
            open && "border-accent ring-3 ring-accent/20",
            disabled && "cursor-not-allowed opacity-(--glc-disabled-opacity) bg-surface-muted",
            triggerClassName,
            className
          )}
        >
          <div className="flex items-center gap-2.5 truncate">
            <CalendarIcon className="size-4 text-text-muted shrink-0" />
            {selectedDate ? (
              <span className="font-semibold text-text">
                {formatReadableDate(selectedDate)}
              </span>
            ) : (
              <span className="text-text-muted">{placeholder}</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {selectedDate && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange("");
                }}
                className="grid size-5 place-items-center rounded-full hover:bg-surface-muted text-text-muted hover:text-text cursor-pointer transition-colors"
                title="Clear date"
              >
                <X className="size-3" />
              </span>
            )}
            <ChevronDown
              className={cn(
                "size-4 text-text-muted transition-transform duration-200",
                open && "rotate-180 text-accent"
              )}
            />
          </div>
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={6}
          align="start"
          className="z-50 w-80 rounded-2xl border border-border/80 bg-surface p-4 text-text shadow-high outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-150"
        >
          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 pb-3 border-b border-border/60 overflow-x-auto">
            <button
              type="button"
              onClick={() => selectPreset(0)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-surface-subtle border border-border/60 text-text hover:bg-surface-hover hover:border-border transition-colors cursor-pointer"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => selectPreset(1)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-surface-subtle border border-border/60 text-text hover:bg-surface-hover hover:border-border transition-colors cursor-pointer"
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => selectPreset(7)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-surface-subtle border border-border/60 text-text hover:bg-surface-hover hover:border-border transition-colors cursor-pointer"
            >
              +1 Week
            </button>
            <button
              type="button"
              onClick={() => selectPreset(30)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-surface-subtle border border-border/60 text-text hover:bg-surface-hover hover:border-border transition-colors cursor-pointer"
            >
              +1 Month
            </button>
          </div>

          {/* Month / Year Navigation */}
          <div className="flex items-center justify-between pt-3 pb-2 px-1">
            <button
              type="button"
              disabled={!canGoPrevMonth}
              onClick={handlePrevMonth}
              className={cn(
                "grid size-8 place-items-center rounded-lg transition-colors",
                canGoPrevMonth
                  ? "hover:bg-surface-hover text-text-secondary hover:text-text cursor-pointer"
                  : "opacity-25 cursor-not-allowed pointer-events-none text-text-muted/40"
              )}
            >
              <ChevronLeft className="size-4" />
            </button>

            <span className="font-bold text-sm text-text">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="grid size-8 place-items-center rounded-lg hover:bg-surface-hover text-text-secondary hover:text-text cursor-pointer transition-colors"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Weekday Names */}
          <div className="grid grid-cols-7 gap-1 text-center py-1">
            {WEEKDAYS.map((wd) => (
              <span
                key={wd}
                className="text-[11px] font-semibold text-text-muted select-none"
              >
                {wd}
              </span>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 pt-1">
            {cells.slice(0, 35).map((cell, idx) => {
              const disabledCell = isDateDisabled(cell.date);
              const selected = isSelected(cell.date);
              const todayCell = isToday(cell.date);

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={disabledCell}
                  onClick={() => {
                    if (disabledCell) return;
                    onChange(toISODate(cell.date));
                    setOpen(false);
                  }}
                  className={cn(
                    "size-9 rounded-xl text-xs font-medium grid place-items-center transition-all select-none",
                    disabledCell
                      ? "opacity-25 cursor-not-allowed pointer-events-none text-text-muted/30"
                      : "cursor-pointer",
                    !disabledCell &&
                      selected &&
                      "bg-accent text-white font-bold shadow-xs hover:bg-accent-hover",
                    !disabledCell &&
                      !selected &&
                      todayCell &&
                      "border border-accent text-accent font-bold",
                    !disabledCell &&
                      !selected &&
                      !todayCell &&
                      cell.isCurrentMonth &&
                      "text-text hover:bg-surface-hover hover:text-accent",
                    !disabledCell &&
                      !selected &&
                      !todayCell &&
                      !cell.isCurrentMonth &&
                      "text-text-muted/35 hover:bg-surface-hover/50"
                  )}
                >
                  {cell.date.getDate()}
                </button>
              );
            })}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

// ----------------------------------------------------
// 2. DATE & TIME PICKER (GLC Design System)
// ----------------------------------------------------
export interface DateTimePickerProps {
  value?: string; // "YYYY-MM-DDTHH:mm" or ISO
  onChange: (val: string) => void;
  placeholder?: string;
  minDate?: string;
  className?: string;
  triggerClassName?: string;
  disabled?: boolean;
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = "Select date & time...",
  minDate,
  className,
  triggerClassName,
  disabled = false,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Parse state from value
  const parsed = React.useMemo(() => {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }, [value]);

  const [selectedDay, setSelectedDay] = React.useState<Date | null>(() => parsed);
  const [hours, setHours] = React.useState<number>(() => (parsed ? parsed.getHours() : 10));
  const [minutes, setMinutes] = React.useState<number>(() => (parsed ? parsed.getMinutes() : 0));
  const [viewDate, setViewDate] = React.useState(() => (parsed ? new Date(parsed) : new Date()));

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && parsed) {
      setSelectedDay(new Date(parsed));
      setHours(parsed.getHours());
      setMinutes(parsed.getMinutes());
      setViewDate(new Date(parsed));
    }
  };

  const isDateDisabled = (d: Date) => {
    if (minDate && toISODate(d) < minDate) return true;
    return false;
  };

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const canGoPrevMonth = React.useMemo(() => {
    if (!minDate) return true;
    const min = parseDateString(minDate);
    if (!min) return true;
    const minYear = min.getFullYear();
    const minMonth = min.getMonth();
    if (currentYear < minYear) return false;
    if (currentYear === minYear && currentMonth <= minMonth) return false;
    return true;
  }, [minDate, currentYear, currentMonth]);

  const handlePrevMonth = () => {
    if (!canGoPrevMonth) return;
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Calendar cells
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

  const cells: { date: Date; isCurrentMonth: boolean }[] = [];

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    cells.push({
      date: new Date(currentYear, currentMonth - 1, prevMonthDays - i),
      isCurrentMonth: false,
    });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({
      date: new Date(currentYear, currentMonth, i),
      isCurrentMonth: true,
    });
  }
  const remaining = 35 - cells.length;
  for (let i = 1; i <= Math.max(0, remaining); i++) {
    cells.push({
      date: new Date(currentYear, currentMonth + 1, i),
      isCurrentMonth: false,
    });
  }

  const today = new Date();
  const isToday = (d: Date) =>
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear();

  const isDaySelected = (d: Date) =>
    selectedDay &&
    d.getDate() === selectedDay.getDate() &&
    d.getMonth() === selectedDay.getMonth() &&
    d.getFullYear() === selectedDay.getFullYear();

  const handleApply = () => {
    const dayToUse = selectedDay || new Date();
    const finalIso = toISODateTime(dayToUse, hours, minutes);
    onChange(finalIso);
    setOpen(false);
  };

  const handleQuickTime = (h: number, m: number) => {
    setHours(h);
    setMinutes(m);
    if (selectedDay) {
      onChange(toISODateTime(selectedDay, h, m));
    }
  };

  // Display text in trigger
  const displayLabel = React.useMemo(() => {
    if (!parsed) return "";
    return `${formatReadableDate(parsed)}, ${formatReadableTime(
      parsed.getHours(),
      parsed.getMinutes()
    )}`;
  }, [parsed]);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger asChild disabled={disabled}>
        <button
          type="button"
          aria-expanded={open}
          className={cn(
            "glc-focus flex h-11 w-full items-center justify-between gap-2.5 rounded-xl border border-border bg-surface px-4 text-sm text-text transition-[border-color,box-shadow] hover:border-border-strong cursor-pointer select-none",
            open && "border-accent ring-3 ring-accent/20",
            disabled && "cursor-not-allowed opacity-(--glc-disabled-opacity) bg-surface-muted",
            triggerClassName,
            className
          )}
        >
          <div className="flex items-center gap-2.5 truncate">
            <CalendarIcon className="size-4 text-text-muted shrink-0" />
            {displayLabel ? (
              <span className="font-semibold text-text">{displayLabel}</span>
            ) : (
              <span className="text-text-muted">{placeholder}</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {parsed && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDay(null);
                  onChange("");
                }}
                className="grid size-5 place-items-center rounded-full hover:bg-surface-muted text-text-muted hover:text-text cursor-pointer transition-colors"
                title="Clear date and time"
              >
                <X className="size-3" />
              </span>
            )}
            <ChevronDown
              className={cn(
                "size-4 text-text-muted transition-transform duration-200",
                open && "rotate-180 text-accent"
              )}
            />
          </div>
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={6}
          align="start"
          className="z-50 w-84 rounded-2xl border border-border/80 bg-surface p-4 text-text shadow-high outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 px-1">
            <button
              type="button"
              disabled={!canGoPrevMonth}
              onClick={handlePrevMonth}
              className={cn(
                "grid size-8 place-items-center rounded-lg transition-colors",
                canGoPrevMonth
                  ? "hover:bg-surface-hover text-text-secondary hover:text-text cursor-pointer"
                  : "opacity-25 cursor-not-allowed pointer-events-none text-text-muted/40"
              )}
            >
              <ChevronLeft className="size-4" />
            </button>

            <span className="font-bold text-sm text-text">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="grid size-8 place-items-center rounded-lg hover:bg-surface-hover text-text-secondary hover:text-text cursor-pointer transition-colors"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Weekday Names */}
          <div className="grid grid-cols-7 gap-1 text-center py-1">
            {WEEKDAYS.map((wd) => (
              <span
                key={wd}
                className="text-[11px] font-semibold text-text-muted select-none"
              >
                {wd}
              </span>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 pt-1">
            {cells.slice(0, 35).map((cell, idx) => {
              const selected = isDaySelected(cell.date);
              const todayCell = isToday(cell.date);
              const disabledCell = isDateDisabled(cell.date);

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={disabledCell}
                  onClick={() => {
                    if (disabledCell) return;
                    setSelectedDay(cell.date);
                    // auto trigger update with current hours & minutes
                    onChange(toISODateTime(cell.date, hours, minutes));
                  }}
                  className={cn(
                    "size-9 rounded-xl text-xs font-medium grid place-items-center transition-all select-none",
                    disabledCell
                      ? "opacity-25 cursor-not-allowed pointer-events-none text-text-muted/30"
                      : "cursor-pointer",
                    !disabledCell &&
                      selected &&
                      "bg-accent text-white font-bold shadow-xs hover:bg-accent-hover",
                    !disabledCell &&
                      !selected &&
                      todayCell &&
                      "border border-accent text-accent font-bold",
                    !disabledCell &&
                      !selected &&
                      !todayCell &&
                      cell.isCurrentMonth &&
                      "text-text hover:bg-surface-hover hover:text-accent",
                    !disabledCell &&
                      !selected &&
                      !todayCell &&
                      !cell.isCurrentMonth &&
                      "text-text-muted/35 hover:bg-surface-hover/50"
                  )}
                >
                  {cell.date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Time Picker Section */}
          <div className="mt-4 pt-3 border-t border-border/70 flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-text-secondary">
              <span className="flex items-center gap-1.5 text-text-muted">
                <Clock className="size-3.5" />
                Select Time
              </span>
              <span className="font-bold text-accent">
                {formatReadableTime(hours, minutes)}
              </span>
            </div>

            {/* Quick time pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "10:00 AM", h: 10, m: 0 },
                { label: "11:30 AM", h: 11, m: 30 },
                { label: "02:00 PM", h: 14, m: 0 },
                { label: "04:30 PM", h: 16, m: 30 },
                { label: "06:00 PM", h: 18, m: 0 },
              ].map((slot) => {
                const active = hours === slot.h && minutes === slot.m;
                return (
                  <button
                    key={slot.label}
                    type="button"
                    onClick={() => handleQuickTime(slot.h, slot.m)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer",
                      active
                        ? "bg-accent-soft text-accent border-accent/40 font-bold"
                        : "bg-surface-subtle border-border/60 text-text-secondary hover:bg-surface-hover"
                    )}
                  >
                    {slot.label}
                  </button>
                );
              })}
            </div>

            {/* Direct Hours & Minutes selector */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1.5">
                <select
                  value={hours % 12 || 12}
                  onChange={(e) => {
                    const h12 = parseInt(e.target.value, 10);
                    const isPm = hours >= 12;
                    const newHours = isPm ? (h12 === 12 ? 12 : h12 + 12) : h12 === 12 ? 0 : h12;
                    setHours(newHours);
                    if (selectedDay) onChange(toISODateTime(selectedDay, newHours, minutes));
                  }}
                  className="glc-focus h-8 rounded-lg border border-border bg-surface px-2 text-xs font-semibold text-text cursor-pointer"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                    <option key={h} value={h}>
                      {h.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>

                <span className="text-xs font-bold text-text-muted">:</span>

                <select
                  value={minutes}
                  onChange={(e) => {
                    const m = parseInt(e.target.value, 10);
                    setMinutes(m);
                    if (selectedDay) onChange(toISODateTime(selectedDay, hours, m));
                  }}
                  className="glc-focus h-8 rounded-lg border border-border bg-surface px-2 text-xs font-semibold text-text cursor-pointer"
                >
                  {[0, 15, 30, 45].map((m) => (
                    <option key={m} value={m}>
                      {m.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>

                {/* AM / PM Toggle */}
                <div className="flex rounded-lg border border-border bg-surface overflow-hidden">
                  <button
                    type="button"
                    onClick={() => {
                      if (hours >= 12) {
                        const newH = hours - 12;
                        setHours(newH);
                        if (selectedDay) onChange(toISODateTime(selectedDay, newH, minutes));
                      }
                    }}
                    className={cn(
                      "px-2 py-1 text-[11px] font-bold transition-colors cursor-pointer",
                      hours < 12
                        ? "bg-accent text-white"
                        : "text-text-muted hover:bg-surface-hover"
                    )}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (hours < 12) {
                        const newH = hours + 12;
                        setHours(newH);
                        if (selectedDay) onChange(toISODateTime(selectedDay, newH, minutes));
                      }
                    }}
                    className={cn(
                      "px-2 py-1 text-[11px] font-bold transition-colors cursor-pointer",
                      hours >= 12
                        ? "bg-accent text-white"
                        : "text-text-muted hover:bg-surface-hover"
                    )}
                  >
                    PM
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleApply}
                className="px-3.5 py-1.5 rounded-xl bg-accent text-white text-xs font-bold shadow-xs hover:bg-accent-hover transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
