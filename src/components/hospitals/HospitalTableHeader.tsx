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
  { key: "name", label: "Hospital", className: "min-w-[240px]" },
  { key: "organisationId", label: "Organisation ID", className: "min-w-[140px]" },
  { key: "administrator", label: "Administrator", className: "min-w-[165px]" },
  { key: "adminEmail", label: "Admin Email", className: "min-w-[220px]" },
  { key: "createdAt", label: "Created", className: "min-w-[130px]" },
];

interface HospitalTableHeaderProps {
  allSelected: boolean;
  someSelected: boolean;
  onToggleSelectAll: () => void;
  sortBy: HospitalSortField;
  sortDirection: SortDirection;
  onSort: (field: HospitalSortField) => void;
}

export function HospitalTableHeader({
  allSelected,
  someSelected,
  onToggleSelectAll,
  sortBy,
  sortDirection,
  onSort,
}: HospitalTableHeaderProps) {
  return (
    <thead className="border-b border-[var(--border-table)] bg-[var(--bg-table-header)]">
      <tr className="h-[40px]">
        <th scope="col" className="w-[46px] pl-4 pr-2">
          <div className="flex items-center justify-center">
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected && !allSelected}
              onChange={onToggleSelectAll}
              ariaLabel="Select all hospitals on this page"
            />
          </div>
        </th>

        {COLUMNS.map((col) => {
          const isSorted = sortBy === col.key;
          const SortIcon =
            isSorted && sortDirection === "asc" ? ChevronUp : ChevronDown;

          return (
            <th
              key={col.key}
              scope="col"
              className={cn(
                "px-3 text-left text-[12.5px] font-medium text-[var(--text-secondary)] whitespace-nowrap",
                col.className
              )}
            >
              <button
                type="button"
                onClick={() => onSort(col.key)}
                className={cn(
                  "group inline-flex w-full items-center justify-between gap-2 rounded py-1 text-left transition-colors hover:text-[var(--text-primary)] cursor-pointer focus-visible:outline-none focus-visible:text-[var(--text-primary)]",
                  isSorted && "text-[var(--text-primary)]"
                )}
              >
                <span>{col.label}</span>
                <SortIcon
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 transition-colors",
                    isSorted
                      ? "text-[#1686D9]"
                      : "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"
                  )}
                />
              </button>
            </th>
          );
        })}

        <th scope="col" className="w-[52px] pr-4 text-right">
          <span className="sr-only">Actions</span>
        </th>
      </tr>
    </thead>
  );
}
