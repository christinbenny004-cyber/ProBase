"use client";

import { ArrowDownWideNarrow, Check, ChevronDown } from "lucide-react";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import type { HospitalSortField, SortDirection } from "@/types/hospital";

interface SortOption {
  label: string;
  field: HospitalSortField;
  direction: SortDirection;
}

const SORT_OPTIONS: SortOption[] = [
  { label: "Created (Oldest first)", field: "createdAt", direction: "asc" },
  { label: "Created (Newest first)", field: "createdAt", direction: "desc" },
  { label: "Hospital name (A–Z)", field: "name", direction: "asc" },
  { label: "Hospital name (Z–A)", field: "name", direction: "desc" },
  { label: "Organisation ID (A–Z)", field: "organisationId", direction: "asc" },
  { label: "Organisation ID (Z–A)", field: "organisationId", direction: "desc" },
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
          className="inline-flex h-[30px] items-center gap-[6px] rounded-[6px] border border-white/20 bg-[#1a1a1a] px-[10px] font-display text-[14px] font-medium leading-[20px] text-white transition-colors hover:bg-[#242424] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c75b3]"
        >
          <ArrowDownWideNarrow strokeWidth={1.6} className="h-[14px] w-[14px] text-[#a0a0a0]" />
          <span>Sort</span>
          <ChevronDown strokeWidth={1.6} className="h-[13px] w-[13px] text-[#a0a0a0]" />
        </button>
      )}
    >
      {(close) => (
        <>
          <div className="px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-[#707070]">
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
                  {isActive && <Check className="h-3.5 w-3.5 text-[#1c75b3]" />}
                </span>
              </DropdownItem>
            );
          })}
        </>
      )}
    </Dropdown>
  );
}
