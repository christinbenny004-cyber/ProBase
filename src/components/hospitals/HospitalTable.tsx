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
  pageSize: number;
  onSort: (field: HospitalSortField) => void;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onViewDetails: (hospital: Hospital) => void;
  onEdit: (hospital: Hospital) => void;
  onCopyOrgId: (orgId: string) => void;
  onWithdrawSetup: (hospital: Hospital) => void;
  onDelete: (hospital: Hospital) => void;
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
  pageSize,
  onSort,
  onToggleSelect,
  onToggleSelectAll,
  onViewDetails,
  onEdit,
  onCopyOrgId,
  onWithdrawSetup,
  onDelete,
  onRetry,
  onClearFilters,
}: HospitalTableProps) {
  const allSelected =
    hospitals.length > 0 && hospitals.every((h) => selectedIds.includes(h.id));
  const someSelected = hospitals.some((h) => selectedIds.includes(h.id));

  if (error) {
    return (
      <div className="flex min-h-[340px] flex-col items-center justify-center rounded-lg border border-[var(--border-default)] bg-[var(--bg-table)] px-6 py-12 text-center">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[#FECACA] bg-[#FEF2F2] text-[#DC2626] dark:border-[#5C262B] dark:bg-[#2A1719] dark:text-[#F87171]">
          <AlertCircle className="h-5 w-5" />
        </div>
        <h3 className="text-[15px] font-semibold text-[var(--text-primary)]">
          Unable to load hospitals
        </h3>
        <p className="mt-1 max-w-md text-[13px] text-[var(--text-secondary)]">
          {error}
        </p>
        <Button
          variant="secondary"
          size="md"
          onClick={onRetry}
          className="mt-4"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Try again</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--border-table)] bg-[var(--bg-table)]">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <HospitalTableHeader
            allSelected={allSelected}
            someSelected={someSelected}
            onToggleSelectAll={onToggleSelectAll}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSort={onSort}
          />

          <tbody>
            {isLoading ? (
              Array.from({ length: Math.min(pageSize, 10) }).map((_, idx) => (
                <tr
                  key={`skeleton-${idx}`}
                  className="h-[46px] border-b border-[var(--border-row)] last:border-b-0"
                >
                  <td className="pl-4 pr-2">
                    <div className="mx-auto h-4 w-4 animate-pulse rounded bg-[var(--bg-skeleton)]" />
                  </td>
                  <td className="px-3">
                    <div className="flex items-center gap-3">
                      <div className="h-[26px] w-[26px] animate-pulse rounded-[5px] bg-[var(--bg-skeleton)]" />
                      <div className="h-3.5 w-36 animate-pulse rounded bg-[var(--bg-skeleton)]" />
                    </div>
                  </td>
                  <td className="px-3">
                    <div className="h-5 w-16 animate-pulse rounded-[5px] bg-[var(--bg-skeleton)]" />
                  </td>
                  <td className="px-3">
                    <div className="h-3.5 w-28 animate-pulse rounded bg-[var(--bg-skeleton)]" />
                  </td>
                  <td className="px-3">
                    <div className="h-3.5 w-40 animate-pulse rounded bg-[var(--bg-skeleton)]" />
                  </td>
                  <td className="px-3">
                    <div className="h-3.5 w-20 animate-pulse rounded bg-[var(--bg-skeleton)]" />
                  </td>
                  <td className="pr-4">
                    <div className="ml-auto h-4 w-5 animate-pulse rounded bg-[var(--bg-skeleton)]" />
                  </td>
                </tr>
              ))
            ) : hospitals.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-14 text-center">
                  <div className="mx-auto flex max-w-sm flex-col items-center">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-input)] bg-[var(--bg-input-dialog)] text-[var(--text-muted)]">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <p className="text-[14px] font-medium text-[var(--text-primary)]">
                      No hospitals found
                    </p>
                    <p className="mt-1 text-[13px] text-[var(--text-subtle)]">
                      No hospital records match your current search or filter
                      criteria.
                    </p>
                    <Button
                      variant="secondary"
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
                  onEdit={onEdit}
                  onCopyOrgId={onCopyOrgId}
                  onWithdrawSetup={onWithdrawSetup}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
