"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md text-[13px] font-medium transition-colors cursor-pointer disabled:pointer-events-none disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1686D9] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--bg-app)]",
          variant === "primary" &&
            "bg-[#1686D9] text-white hover:bg-[#0875C5] border border-[#1686D9] hover:border-[#0875C5]",
          variant === "secondary" &&
            "bg-[var(--bg-input)] text-[var(--text-body)] border border-[var(--border-default)] hover:bg-[var(--bg-hover)] hover:border-[var(--border-input-hover)]",
          variant === "ghost" &&
            "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]",
          variant === "danger" &&
            "bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] hover:bg-[#FEE2E2] dark:bg-[#2A1719] dark:text-[#F87171] dark:border-[#5C262B] dark:hover:bg-[#3A1E21]",
          size === "sm" && "h-8 px-2.5 text-[12px]",
          size === "md" && "h-[34px] px-3",
          size === "icon" && "h-[34px] w-[34px] p-0",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
