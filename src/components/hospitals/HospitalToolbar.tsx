"use client";

import {
  AlertTriangle,
  Check,
  ChevronDown,
  Download,
  LayoutGrid,
  MoreVertical,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { HospitalFilters } from "@/components/hospitals/HospitalFilters";
import { HospitalSort } from "@/components/hospitals/HospitalSort";
import { Button } from "@/components/ui/Button";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { cn } from "@/lib/utils";
import type {
  DateRangeFilter,
  HospitalSortField,
  HospitalViewMode,
  SortDirection,
} from "@/types/hospital";

const VIEW_MODES: Array<{ value: HospitalViewMode; label: string }> = [
  { value: "active", label: "Active hospitals" },
  { value: "all", label: "All hospitals" },
  { value: "pending", label: "Pending invitations" },
];

interface HospitalToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: HospitalSortField;
  sortDirection: SortDirection;
  onSortChange: (field: HospitalSortField, direction: SortDirection) => void;
  dateFilter: DateRangeFilter;
  onDateFilterChange: (value: DateRangeFilter) => void;
  viewMode: HospitalViewMode;
  onViewModeChange: (value: HospitalViewMode) => void;
  onClearFilters: () => void;
  onRefresh: () => void;
  onSimulateError: () => void;
  onExportCsv: () => void;
  onOpenSetupDialog: () => void;
  isRefreshing: boolean;
}

export function HospitalToolbar({
  search,
  onSearchChange,
  sortBy,
  sortDirection,
  onSortChange,
  dateFilter,
  onDateFilterChange,
  viewMode,
  onViewModeChange,
  onClearFilters,
  onRefresh,
  onSimulateError,
  onExportCsv,
  onOpenSetupDialog,
  isRefreshing,
}: HospitalToolbarProps) {
  const activeViewLabel =
    VIEW_MODES.find((v) => v.value === viewMode)?.label ?? "Active hospitals";

  return (
    <div className="flex min-h-[52px] w-full flex-wrap items-center gap-[8px] border-b border-white/12 bg-[#1a1a1a] px-[12px] py-2">
      {/* Left: Borderless inline search */}
      <div className="flex min-w-[220px] flex-1 items-center gap-[8px]">
        <Search
          strokeWidth={1.6}
          className="h-[16px] w-[16px] shrink-0 text-[#707070]"
          aria-hidden="true"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter by hospital, Organisation ID or administrator…"
          aria-label="Filter hospitals"
          className="w-full min-w-0 bg-transparent text-[14px] font-normal leading-[20px] text-white placeholder-[#707070] focus:outline-none"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
            className="rounded p-0.5 text-[#707070] hover:text-white cursor-pointer"
          >
            <X className="h-[14px] w-[14px]" />
          </button>
        )}
      </div>

      {/* Right: Controls */}
      <div className="flex flex-wrap items-center gap-[8px]">
        <HospitalSort
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortChange={onSortChange}
        />

        <HospitalFilters
          dateFilter={dateFilter}
          onDateFilterChange={onDateFilterChange}
          onClearFilters={onClearFilters}
        />

        <Dropdown
          align="right"
          menuClassName="min-w-[190px]"
          trigger={({ toggle }) => (
            <button
              type="button"
              onClick={toggle}
              className="inline-flex h-[30px] items-center gap-[6px] rounded-[6px] border border-white/20 bg-[#1a1a1a] px-[10px] font-display text-[14px] font-medium leading-[20px] text-white transition-colors hover:bg-[#242424] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c75b3]"
            >
              <LayoutGrid strokeWidth={1.6} className="h-[14px] w-[14px] text-[#a0a0a0]" />
              <span className="whitespace-nowrap">{activeViewLabel}</span>
              <ChevronDown strokeWidth={1.6} className="h-[13px] w-[13px] text-[#a0a0a0]" />
            </button>
          )}
        >
          {(close) =>
            VIEW_MODES.map((mode) => (
              <DropdownItem
                key={mode.value}
                active={viewMode === mode.value}
                onClick={() => {
                  onViewModeChange(mode.value);
                  close();
                }}
              >
                <span className="flex items-center justify-between gap-2">
                  <span>{mode.label}</span>
                  {viewMode === mode.value && (
                    <Check className="h-3.5 w-3.5 text-[#1c75b3]" />
                  )}
                </span>
              </DropdownItem>
            ))
          }
        </Dropdown>

        <Dropdown
          align="right"
          menuClassName="min-w-[200px]"
          trigger={({ toggle }) => (
            <Button
              variant="secondary"
              size="icon"
              onClick={toggle}
              aria-label="More actions"
              title="More actions"
            >
              <MoreVertical strokeWidth={1.6} className="h-[14px] w-[14px] text-[#a0a0a0]" />
            </Button>
          )}
        >
          {(close) => (
            <>
              <DropdownItem
                icon={<Download className="h-3.5 w-3.5" />}
                onClick={() => {
                  onExportCsv();
                  close();
                }}
              >
                Export filtered CSV
              </DropdownItem>
              <DropdownItem
                icon={<RefreshCw className="h-3.5 w-3.5" />}
                onClick={() => {
                  onRefresh();
                  close();
                }}
              >
                Reload directory
              </DropdownItem>
              <div className="my-1 border-t border-white/12" />
              <DropdownItem
                icon={<AlertTriangle className="h-3.5 w-3.5 text-[#f0705f]" />}
                onClick={() => {
                  onSimulateError();
                  close();
                }}
              >
                Simulate API error
              </DropdownItem>
            </>
          )}
        </Dropdown>

        <Button
          variant="secondary"
          size="icon"
          onClick={onRefresh}
          disabled={isRefreshing}
          aria-label="Refresh hospitals"
          title="Refresh hospitals"
        >
          <RefreshCw
            strokeWidth={1.6}
            className={cn(
              "h-[14px] w-[14px] text-[#a0a0a0]",
              isRefreshing && "animate-spin text-white"
            )}
          />
        </Button>

        <Button variant="primary" size="sm" onClick={onOpenSetupDialog}>
          Set up a hospital
        </Button>
      </div>
    </div>
  );
}
