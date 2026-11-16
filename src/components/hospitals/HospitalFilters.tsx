"use client";

import { Check, ChevronDown, Filter } from "lucide-react";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import type { DateRangeFilter } from "@/types/hospital";

const DATE_FILTER_OPTIONS: Array<{ value: DateRangeFilter; label: string }> = [
  { value: "all", label: "All created dates" },
  { value: "last_7_days", label: "Last 7 days" },
  { value: "last_30_days", label: "Last 30 days" },
  { value: "nov_2026", label: "November 2026" },
  { value: "oct_2026", label: "October 2026" },
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
          className="inline-flex h-[34px] items-center gap-2 rounded-md border border-[var(--border-default)] bg-[var(--bg-input)] px-3 text-[13px] font-medium text-[var(--text-body)] transition-colors hover:border-[var(--border-input-hover)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1686D9]"
        >
          <Filter className="h-3.5 w-3.5 text-[var(--text-subtle)]" />
          <span>Filter</span>
          {hasActiveFilter && (
            <span
              className="h-1.5 w-1.5 rounded-full bg-[#1686D9]"
              aria-label="Filter active"
            />
          )}
          <ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)]" />
        </button>
      )}
    >
      {(close) => (
        <>
          <div className="px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
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
                  {isActive && <Check className="h-3.5 w-3.5 text-[#1686D9]" />}
                </span>
              </DropdownItem>
            );
          })}
          {hasActiveFilter && (
            <div className="mt-1 border-t border-[var(--border-subtle)] pt-1">
              <DropdownItem
                onClick={() => {
                  onClearFilters();
                  close();
                }}
                className="text-[#1686D9] hover:text-[#0875C5] dark:text-[#60A5FA] dark:hover:text-[#93C5FD]"
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
