"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Checkbox } from "@/components/ui/Checkbox";
import { cn } from "@/lib/utils";
import type { HospitalSortField, SortDirection } from "@/types/hospital";

interface ColumnConfig {
  key: HospitalSortField;
  label: string;
  className?: string;
}

const COLUMNS: ColumnConfig[] = [
  { key: "name", label: "Hospital", className: "w-[294px] min-w-[294px]" },
  {
    key: "organisationId",
    label: "Organisation ID",
    className: "w-[230px] min-w-[230px]",
  },
  {
    key: "administrator",
    label: "Administrator",
    className: "w-[200px] min-w-[200px]",
  },
  {
    key: "adminEmail",
    label: "Admin Email",
    className: "w-[260px] min-w-[260px]",
  },
  { key: "createdAt", label: "Created", className: "w-[168px] min-w-[168px]" },
];

interface HospitalTableHeaderProps {
  allSelected: boolean;
  someSelected: boolean;
  onToggleSelectAll: () => void;
  sortBy: HospitalSortField;
  sortDirection: SortDirection;
  hasUserSorted: boolean;
  onSort: (field: HospitalSortField) => void;
}

export function HospitalTableHeader({
  allSelected,
  someSelected,
  onToggleSelectAll,
  sortBy,
  sortDirection,
  hasUserSorted,
  onSort,
}: HospitalTableHeaderProps) {
  return (
    <thead className="bg-[var(--color-surface-overlay)]">
      <tr className="h-[44px]">
        <th
          scope="col"
          className="w-[48px] min-w-[48px] border-b border-r border-white/12 p-0"
        >
          <div className="flex items-center justify-center">
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected && !allSelected}
              onChange={onToggleSelectAll}
              ariaLabel="Select all hospitals on this page"
            />
          </div>
        </th>

        {COLUMNS.map((col, idx) => {
          const isSorted = hasUserSorted && sortBy === col.key;
          const SortIcon =
            isSorted && sortDirection === "asc" ? ChevronUp : ChevronDown;

          return (
            <th
              key={col.key}
              scope="col"
              className={cn(
                "border-b border-white/12 px-[12px] text-left font-display text-[14px] font-medium leading-[20px] text-white whitespace-nowrap",
                idx < COLUMNS.length - 1 && "border-r",
                col.className
              )}
            >
              <button
                type="button"
                onClick={() => onSort(col.key)}
                className="group inline-flex w-full items-center justify-between gap-[6px] py-1 text-left cursor-pointer focus-visible:outline-none focus-visible:text-[#1c75b3]"
              >
                <span>{col.label}</span>
                <SortIcon
                  strokeWidth={1.6}
                  className={cn(
                    "h-[13px] w-[13px] shrink-0 transition-colors",
                    isSorted
                      ? "text-[#1c75b3]"
                      : "text-[#a0a0a0] group-hover:text-white"
                  )}
                />
              </button>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
