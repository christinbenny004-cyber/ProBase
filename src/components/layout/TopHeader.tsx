"use client";

import { Building2, Menu, Moon, Search, Sun } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { useTheme } from "@/components/theme/ThemeProvider";

interface TopHeaderProps {
  onOpenMobileMenu: () => void;
  globalSearch: string;
  onGlobalSearchChange: (value: string) => void;
}

export function TopHeader({
  onOpenMobileMenu,
  globalSearch,
  onGlobalSearchChange,
}: TopHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-30 flex h-[64px] shrink-0 items-center justify-between gap-4 border-b border-[var(--border-subtle)] bg-[var(--bg-header)] px-4 sm:px-6 lg:px-7">
      {/* Left: Mobile Menu + Breadcrumbs */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] lg:hidden cursor-pointer"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="hidden sm:block truncate">
          <Breadcrumbs
            items={[
              { label: "Platform" },
              { label: "Hospitals" },
              { label: "Active hospitals", current: true },
            ]}
          />
        </div>
        <span className="text-[13px] font-medium text-[var(--text-primary)] sm:hidden">
          Active hospitals
        </span>
      </div>

      {/* Right: Global Search + Platform Label + Theme Toggle + Avatar */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="relative hidden md:block w-[260px] xl:w-[340px]">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={globalSearch}
            onChange={(e) => onGlobalSearchChange(e.target.value)}
            placeholder="Search hospitals, Organisation IDs or administrators..."
            aria-label="Global search"
            className="h-[34px] w-full rounded-md border border-[var(--border-input)] bg-[var(--bg-surface)] pl-8.5 pr-3 text-[12.5px] text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-colors focus:border-[#1686D9] focus:outline-none"
          />
        </div>

        <div className="hidden sm:flex h-[34px] items-center gap-2 rounded-md border border-[var(--border-input)] bg-[var(--bg-surface)] px-2.5 text-[12.5px] font-medium text-[var(--text-body)] select-none">
          <Building2
            className="h-3.5 w-3.5 text-[var(--text-subtle)]"
            aria-hidden="true"
          />
          <span>ProBase Platform</span>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="inline-flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-md border border-[var(--border-input)] bg-[var(--bg-surface)] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-input-hover)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1686D9]"
        >
          {isDark ? (
            <Sun className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Moon className="h-4 w-4" aria-hidden="true" />
          )}
        </button>

        <div
          title="Platform Administrator (PA)"
          aria-label="Account profile PA"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1686D9] text-[11px] font-semibold tracking-wide text-white"
        >
          PA
        </div>
      </div>
    </header>
  );
}
