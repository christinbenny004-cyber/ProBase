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
            "absolute z-50 mt-1.5 min-w-[190px] rounded-[8px] border border-white/12 bg-[#1a1a1a] py-1 shadow-[0px_8px_24px_0px_rgba(0,0,0,0.45)]",
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
          ? "bg-[#1f1f1f] text-white font-medium"
          : "text-[#a0a0a0] hover:bg-[#1f1f1f] hover:text-white",
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0 text-[#707070]">{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
    </button>
  );
}
