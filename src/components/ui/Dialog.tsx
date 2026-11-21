"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxWidthClassName?: string;
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  icon,
  children,
  maxWidthClassName = "max-w-[560px]",
}: DialogProps) {
  React.useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div
        className="fixed inset-0 bg-black/65"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative z-10 flex w-full flex-col gap-[18px] rounded-[12px] border border-white/12 bg-[#1a1a1a] p-[24px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.45)]",
          maxWidthClassName
        )}
      >
        <div className="flex items-start gap-[18px]">
          {icon && (
            <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full border border-white/12 bg-[#1f1f1f] text-white">
              {icon}
            </div>
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
            <h2
              id="dialog-title"
              className="font-display text-[16px] font-semibold leading-[24px] text-white"
            >
              {title}
            </h2>
            {description && (
              <p className="text-[14px] font-normal leading-[20px] text-[#a0a0a0]">
                {description}
              </p>
            )}
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
