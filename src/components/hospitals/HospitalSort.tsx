"use client";

import { ArrowUpDown, Check, ChevronDown } from "lucide-react";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import type { HospitalSortField, SortDirection } from "@/types/hospital";

interface SortOption {
  label: string;
  field: HospitalSortField;
  direction: SortDirection;
}

const SORT_OPTIONS: SortOption[] = [
  { label: "Created (Newest first)", field: "createdAt", direction: "desc" },
  { label: "Created (Oldest first)", field: "createdAt", direction: "asc" },
  { label: "Hospital name (A–Z)", field: "name", direction: "asc" },
  { label: "Hospital name (Z–A)", field: "name", direction: "desc" },
  { label: "Organisation ID (Asc)", field: "organisationId", direction: "asc" },
  { label: "Organisation ID (Desc)", field: "organisationId", direction: "desc" },
  { label: "Administrator (A–Z)", field: "administrator", direction: "asc" },
  { label: "Administrator (Z–A)", field: "administrator", direction: "desc" },
];

interface HospitalSortProps {
  sortBy: HospitalSortField;
  sortDirection: SortDirection;
  onSortChange: (field: HospitalSortField, direction: SortDirection) => void;
}

export function HospitalSort({
  sortBy,
  sortDirection,
  onSortChange,
}: HospitalSortProps) {
  return (
    <Dropdown
      align="right"
      menuClassName="min-w-[220px]"
      trigger={({ toggle }) => (
        <button
          type="button"
          onClick={toggle}
          className="inline-flex h-[34px] items-center gap-2 rounded-md border border-[var(--border-default)] bg-[var(--bg-input)] px-3 text-[13px] font-medium text-[var(--text-body)] transition-colors hover:border-[var(--border-input-hover)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1686D9]"
        >
          <ArrowUpDown className="h-3.5 w-3.5 text-[var(--text-subtle)]" />
          <span>Sort</span>
          <ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)]" />
        </button>
      )}
    >
      {(close) => (
        <>
          <div className="px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
            Sort by
          </div>
          {SORT_OPTIONS.map((option) => {
            const isActive =
              sortBy === option.field && sortDirection === option.direction;
            return (
              <DropdownItem
                key={`${option.field}-${option.direction}`}
                active={isActive}
                onClick={() => {
                  onSortChange(option.field, option.direction);
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
        </>
      )}
    </Dropdown>
  );
}
