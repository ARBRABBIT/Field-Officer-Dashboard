"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

export interface CustomSelectProps {
  value?: string;
  onChange: (value: string) => void;
  options: (string | SelectOption)[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  size?: "sm" | "md" | "lg";
  invalid?: boolean;
  prefixIcon?: React.ReactNode;
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select an option...",
  disabled = false,
  className,
  triggerClassName,
  contentClassName,
  size = "md",
  invalid = false,
  prefixIcon,
}: CustomSelectProps) {
  const [open, setOpen] = React.useState(false);

  // Normalize options
  const normalizedOptions: SelectOption[] = React.useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === "string") {
        return { value: opt, label: opt };
      }
      return opt;
    });
  }, [options]);

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  const sizeClasses = {
    sm: "h-9 text-xs px-3 rounded-lg",
    md: "h-11 text-sm px-4 rounded-xl",
    lg: "h-13 text-base px-4 rounded-xl",
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger
        asChild
        disabled={disabled}
      >
        <button
          type="button"
          aria-expanded={open}
          className={cn(
            "glc-focus flex w-full items-center justify-between gap-3 border border-border bg-surface text-text transition-[border-color,box-shadow] hover:border-border-strong cursor-pointer select-none",
            sizeClasses[size],
            open && "border-accent ring-3 ring-accent/20",
            invalid && "border-danger ring-danger/20",
            disabled && "cursor-not-allowed opacity-(--glc-disabled-opacity) bg-surface-muted",
            triggerClassName,
            className
          )}
        >
          <div className="flex items-center gap-2.5 truncate">
            {prefixIcon && (
              <span className="text-text-muted shrink-0">{prefixIcon}</span>
            )}
            {selectedOption ? (
              <span className="font-semibold text-text truncate">
                {selectedOption.label}
              </span>
            ) : (
              <span className="text-text-muted truncate">{placeholder}</span>
            )}
          </div>

          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-text-muted transition-transform duration-200",
              open && "rotate-180 text-accent"
            )}
          />
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={6}
          align="start"
          className={cn(
            "z-50 min-w-[200px] w-(--radix-popover-trigger-width) max-h-72 overflow-y-auto rounded-2xl border border-border/80 bg-surface p-1.5 text-text shadow-high outline-none animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-150",
            contentClassName
          )}
        >
          <div className="space-y-1">
            {normalizedOptions.length === 0 ? (
              <div className="py-3 text-center text-xs text-text-muted">
                No options available
              </div>
            ) : (
              normalizedOptions.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-left text-sm transition-colors cursor-pointer select-none",
                      isSelected
                        ? "bg-accent-soft text-accent font-semibold"
                        : "text-text hover:bg-surface-hover hover:text-accent font-medium"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {option.icon && (
                        <span className="shrink-0 text-base">{option.icon}</span>
                      )}
                      <div className="truncate">
                        <p className="truncate">{option.label}</p>
                        {option.description && (
                          <p className="text-[11px] text-text-muted truncate font-normal">
                            {option.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="size-4 shrink-0 text-accent animate-in zoom-in-50 duration-100" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
