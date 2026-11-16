"use client";

import * as React from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  ariaLabel: string;
  className?: string;
}

export function Checkbox({
  checked,
  indeterminate = false,
  onChange,
  ariaLabel,
  className,
}: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      aria-label={ariaLabel}
      onClick={onChange}
      className={cn(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1686D9] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--bg-surface)]",
        checked || indeterminate
          ? "border-[#1686D9] bg-[#1686D9] text-white"
          : "border-[#CBD5E1] dark:border-[#3B3F46] bg-transparent hover:border-[#94A3B8] dark:hover:border-[#525862]",
        className
      )}
    >
      {indeterminate ? (
        <Minus className="h-3 w-3 stroke-[2.5]" />
      ) : checked ? (
        <Check className="h-3 w-3 stroke-[2.5]" />
      ) : null}
    </button>
  );
}
