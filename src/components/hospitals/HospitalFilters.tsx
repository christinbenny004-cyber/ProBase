"use client";

import { Check, ChevronDown, Filter } from "lucide-react";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import type { DateRangeFilter } from "@/types/hospital";

const DATE_FILTER_OPTIONS: Array<{ value: DateRangeFilter; label: string }> = [
  { value: "all", label: "All created dates" },
  { value: "may_jun_2026", label: "May – Jun 2026" },
  { value: "jul_aug_2026", label: "Jul – Aug 2026" },
  { value: "sep_2026", label: "Sep 2026" },
];

interface HospitalFiltersProps {
  dateFilter: DateRangeFilter;
  onDateFilterChange: (value: DateRangeFilter) => void;
  onClearFilters: () => void;
}

export function HospitalFilters({
  dateFilter,
  onDateFilterChange,
  onClearFilters,
}: HospitalFiltersProps) {
  const hasActiveFilter = dateFilter !== "all";

  return (
    <Dropdown
      align="right"
      menuClassName="min-w-[205px]"
      trigger={({ toggle }) => (
        <button
          type="button"
          onClick={toggle}
          className="inline-flex h-[30px] items-center gap-[6px] rounded-[6px] border border-white/20 bg-[#1a1a1a] px-[10px] font-display text-[14px] font-medium leading-[20px] text-white transition-colors hover:bg-[#242424] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c75b3]"
        >
          <Filter strokeWidth={1.6} className="h-[14px] w-[14px] text-[#a0a0a0]" />
          <span>Filter</span>
          {hasActiveFilter && (
            <span
              className="h-1.5 w-1.5 rounded-full bg-[#1c75b3]"
              aria-label="Filter active"
            />
          )}
          <ChevronDown strokeWidth={1.6} className="h-[13px] w-[13px] text-[#a0a0a0]" />
        </button>
      )}
    >
      {(close) => (
        <>
          <div className="px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-[#707070]">
            Created Date
          </div>
          {DATE_FILTER_OPTIONS.map((option) => {
            const isActive = dateFilter === option.value;
            return (
              <DropdownItem
                key={option.value}
                active={isActive}
                onClick={() => {
                  onDateFilterChange(option.value);
                  close();
                }}
              >
                <span className="flex items-center justify-between gap-2">
                  <span>{option.label}</span>
                  {isActive && <Check className="h-3.5 w-3.5 text-[#1c75b3]" />}
                </span>
              </DropdownItem>
            );
          })}
          {hasActiveFilter && (
            <div className="mt-1 border-t border-white/12 pt-1">
              <DropdownItem
                onClick={() => {
                  onClearFilters();
                  close();
                }}
                className="text-[#1c75b3] hover:text-white"
              >
                Clear filters
              </DropdownItem>
            </div>
          )}
        </>
      )}
    </Dropdown>
  );
}
