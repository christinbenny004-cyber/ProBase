"use client";

import { Building2, Menu, Search } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

interface TopHeaderProps {
  onOpenMobileMenu: () => void;
  globalSearch: string;
  onGlobalSearchChange: (value: string) => void;
  currentBreadcrumbLabel?: string;
}

export function TopHeader({
  onOpenMobileMenu,
  globalSearch,
  onGlobalSearchChange,
  currentBreadcrumbLabel = "Active hospitals",
}: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-[64px] w-full shrink-0 items-center justify-between gap-[16px] border-b border-white/12 bg-[#121212] px-4 sm:px-[24px]">
      {/* Left: Mobile toggle + Brand + Divider + Breadcrumb */}
      <div className="flex min-w-0 items-center gap-[16px]">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="inline-flex h-[32px] w-[32px] items-center justify-center rounded-[6px] border border-white/20 bg-[#1a1a1a] text-[#a0a0a0] hover:bg-[#1f1f1f] hover:text-white lg:hidden cursor-pointer"
        >
          <Menu className="h-[16px] w-[16px]" />
        </button>

        <div className="flex shrink-0 items-center gap-[10px]">
          <div
            className="h-[22px] w-[22px] shrink-0 rounded-[6px] bg-[#1c75b3]"
            aria-hidden="true"
          />
          <span className="font-display text-[16px] font-semibold leading-[24px] text-white">
            probase
          </span>
        </div>

        <div
          className="hidden h-[22px] w-px shrink-0 bg-white/12 sm:block"
          aria-hidden="true"
        />

        <div className="hidden min-w-0 truncate sm:block">
          <Breadcrumbs
            items={[
              { label: "Platform" },
              { label: "Hospitals" },
              { label: currentBreadcrumbLabel, current: true },
            ]}
          />
        </div>
      </div>

      {/* Right: Global Search + Tenant Pill + Avatar */}
      <div className="flex items-center gap-[12px] sm:gap-[16px]">
        <div className="relative hidden md:flex h-[34px] w-[280px] lg:w-[380px] xl:w-[516px] items-center gap-[8px] rounded-[8px] border border-white/20 bg-[#1a1a1a] px-[12px] focus-within:border-[#1c75b3] transition-colors">
          <Search
            strokeWidth={1.6}
            className="h-[16px] w-[16px] shrink-0 text-[#707070]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={globalSearch}
            onChange={(e) => onGlobalSearchChange(e.target.value)}
            placeholder="Search hospitals, Organisation IDs or administrators"
            aria-label="Global search"
            className="w-full min-w-0 bg-transparent text-[14px] font-normal leading-[20px] text-white placeholder-[#707070] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-[8px] rounded-[8px] border border-white/12 bg-[var(--color-surface-overlay)] px-[12px] py-[7px]">
          <Building2
            strokeWidth={1.6}
            className="h-[16px] w-[16px] shrink-0 text-[#a0a0a0]"
            aria-hidden="true"
          />
          <span className="hidden font-display text-[14px] font-medium leading-[20px] text-white sm:inline whitespace-nowrap">
            ProBase Platform
          </span>
        </div>

        <div
          title="Platform Administrator (PA)"
          aria-label="Account profile PA"
          className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full bg-[#1c75b3] text-[12px] font-normal leading-[16px] text-white"
        >
          PA
        </div>
      </div>
    </header>
  );
}
