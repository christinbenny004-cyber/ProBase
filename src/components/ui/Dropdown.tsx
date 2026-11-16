"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DropdownProps {
  trigger: (props: { isOpen: boolean; toggle: () => void }) => React.ReactNode;
  children: (close: () => void) => React.ReactNode;
  align?: "left" | "right";
  className?: string;
  menuClassName?: string;
}

export function Dropdown({
  trigger,
  children,
  align = "right",
  className,
  menuClassName,
}: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen((prev) => !prev), []);

  React.useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      {trigger({ isOpen, toggle })}
      {isOpen && (
        <div
          role="menu"
          className={cn(
            "absolute z-50 mt-1.5 min-w-[190px] rounded-lg border border-[var(--border-default)] bg-[var(--bg-dropdown)] py-1 shadow-xl shadow-black/10 dark:shadow-black/50",
            align === "right" ? "right-0" : "left-0",
            menuClassName
          )}
        >
          {children(close)}
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon?: React.ReactNode;
}

export function DropdownItem({
  children,
  active = false,
  icon,
  className,
  ...props
}: DropdownItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      className={cn(
        "flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-[13px] transition-colors cursor-pointer",
        active
          ? "bg-[var(--bg-dropdown-active)] text-[var(--text-primary)] font-medium"
          : "text-[var(--text-body)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]",
        className
      )}
      {...props}
    >
      {icon && <span className="text-[var(--text-subtle)] shrink-0">{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
    </button>
  );
}
