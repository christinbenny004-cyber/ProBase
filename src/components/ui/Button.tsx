"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "secondary", size = "md", type = "button", ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-[6px] transition-colors cursor-pointer disabled:pointer-events-none disabled:opacity-45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c75b3] focus-visible:ring-offset-1 focus-visible:ring-offset-[#121212]",
          variant === "primary" &&
            "bg-[#1c75b3] text-white font-semibold hover:bg-[#17649a]",
          variant === "outline" &&
            "bg-transparent border border-white/20 text-white font-medium hover:bg-white/[0.06]",
          variant === "secondary" &&
            "bg-[#1a1a1a] border border-white/20 text-white font-medium hover:bg-[#242424]",
          variant === "ghost" &&
            "bg-transparent text-[#a0a0a0] font-medium hover:text-white hover:bg-white/[0.06]",
          variant === "danger" &&
            "bg-transparent border border-[#c93a2e] text-[#f0705f] font-medium hover:bg-[#c93a2e]/15",
          size === "sm" &&
            "h-[30px] px-[12px] rounded-[6px] text-[13px] leading-[17px]",
          size === "md" &&
            "h-[38px] px-[16px] rounded-[8px] text-[14px] leading-[18px]",
          size === "icon" && "h-[30px] w-[36px] rounded-[6px] px-[10px]",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
