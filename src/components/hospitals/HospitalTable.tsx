"use client";

import { AlertCircle, Building2, RefreshCw } from "lucide-react";
import { HospitalTableHeader } from "@/components/hospitals/HospitalTableHeader";
import { HospitalTableRow } from "@/components/hospitals/HospitalTableRow";
import { Button } from "@/components/ui/Button";
import type {
  Hospital,
  HospitalSortField,
  SortDirection,
} from "@/types/hospital";

interface HospitalTableProps {
  hospitals: Hospital[];
  isLoading: boolean;
  error: string | null;
  selectedIds: string[];
  sortBy: HospitalSortField;
  sortDirection: SortDirection;
  hasUserSorted: boolean;
  pageSize: number;
  onSort: (field: HospitalSortField) => void;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onViewDetails: (hospital: Hospital) => void;
  onRetry: () => void;
  onClearFilters: () => void;
}

export function HospitalTable({
  hospitals,
  isLoading,
  error,
  selectedIds,
  sortBy,
  sortDirection,
  hasUserSorted,
  pageSize,
  onSort,
  onToggleSelect,
  onToggleSelectAll,
  onViewDetails,
  onRetry,
  onClearFilters,
}: HospitalTableProps) {
  const allSelected =
    hospitals.length > 0 && hospitals.every((h) => selectedIds.includes(h.id));
  const someSelected = hospitals.some((h) => selectedIds.includes(h.id));

  if (error) {
    return (
      <div className="flex min-h-[360px] flex-1 flex-col items-center justify-center bg-[#121212] px-6 py-12 text-center">
        <div className="mb-3 flex h-[44px] w-[44px] items-center justify-center rounded-full border border-[#c93a2e] bg-[#1f1f1f] text-[#f0705f]">
          <AlertCircle className="h-[20px] w-[20px]" />
        </div>
        <h3 className="font-display text-[16px] font-semibold text-white">
          Unable to load hospitals
        </h3>
        <p className="mt-1 max-w-md text-[14px] text-[#a0a0a0]">{error}</p>
        <Button
          variant="outline"
          size="md"
          onClick={onRetry}
          className="mt-4"
        >
          <RefreshCw className="h-[14px] w-[14px]" />
          <span>Try again</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-x-auto bg-[#121212]">
      <table className="w-full border-collapse text-left">
        <HospitalTableHeader
          allSelected={allSelected}
          someSelected={someSelected}
          onToggleSelectAll={onToggleSelectAll}
          sortBy={sortBy}
          sortDirection={sortDirection}
          hasUserSorted={hasUserSorted}
          onSort={onSort}
        />

        <tbody>
          {isLoading ? (
            Array.from({ length: Math.min(pageSize, 12) }).map((_, idx) => (
              <tr key={`skeleton-${idx}`} className="h-[43px]">
                <td className="border-b border-r border-white/12 p-0">
                  <div className="mx-auto h-[14px] w-[14px] animate-pulse rounded-[2px] bg-[#1f1f1f]" />
                </td>
                <td className="border-b border-r border-white/12 px-[12px]">
                  <div className="h-3.5 w-44 animate-pulse rounded bg-[#1f1f1f]" />
                </td>
                <td className="border-b border-r border-white/12 px-[12px]">
                  <div className="h-3.5 w-28 animate-pulse rounded bg-[#1f1f1f]" />
                </td>
                <td className="border-b border-r border-white/12 px-[12px]">
                  <div className="h-3.5 w-28 animate-pulse rounded bg-[#1f1f1f]" />
                </td>
                <td className="border-b border-r border-white/12 px-[12px]">
                  <div className="h-3.5 w-40 animate-pulse rounded bg-[#1f1f1f]" />
                </td>
                <td className="border-b border-white/12 px-[12px]">
                  <div className="h-3.5 w-20 animate-pulse rounded bg-[#1f1f1f]" />
                </td>
              </tr>
            ))
          ) : hospitals.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-16 text-center">
                <div className="mx-auto flex max-w-sm flex-col items-center">
                  <div className="mb-3 flex h-[44px] w-[44px] items-center justify-center rounded-full border border-white/12 bg-[#1f1f1f] text-[#a0a0a0]">
                    <Building2 className="h-[20px] w-[20px]" />
                  </div>
                  <p className="font-display text-[15px] font-semibold text-white">
                    No hospitals found
                  </p>
                  <p className="mt-1 text-[14px] text-[#a0a0a0]">
                    No hospital records match your current search or filter
                    criteria.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onClearFilters}
                    className="mt-4"
                  >
                    Clear search & filters
                  </Button>
                </div>
              </td>
            </tr>
          ) : (
            hospitals.map((hospital) => (
              <HospitalTableRow
                key={hospital.id}
                hospital={hospital}
                selected={selectedIds.includes(hospital.id)}
                onToggleSelect={onToggleSelect}
                onViewDetails={onViewDetails}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
