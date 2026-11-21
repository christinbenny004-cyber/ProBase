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
        "flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-[2px] border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c75b3] focus-visible:ring-offset-1 focus-visible:ring-offset-[#121212]",
        checked || indeterminate
          ? "border-[#1c75b3] bg-[#1c75b3] text-white"
          : "border-white/20 bg-[#1a1a1a] hover:border-white/35",
        className
      )}
    >
      {indeterminate ? (
        <Minus className="h-2.5 w-2.5 stroke-[2.5]" />
      ) : checked ? (
        <Check className="h-2.5 w-2.5 stroke-[2.5]" />
      ) : null}
    </button>
  );
}
