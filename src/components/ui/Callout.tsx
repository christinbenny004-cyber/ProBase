import * as React from "react";
import { cn } from "@/lib/utils";

interface CalloutProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function Callout({ icon, title, description, className }: CalloutProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-[12px] rounded-[8px] border border-[var(--color-border)] bg-[var(--color-surface-overlay)] p-[16px]",
        className
      )}
    >
      <span
        className="mt-[1px] shrink-0 text-[var(--color-text-muted)]"
        aria-hidden="true"
      >
        {icon}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-[3px] text-[14px] leading-[20px]">
        <p className="font-display font-medium text-[var(--color-text)]">
          {title}
        </p>
        <p className="font-normal text-[var(--color-text-muted)]">
          {description}
        </p>
      </div>
    </div>
  );
}
