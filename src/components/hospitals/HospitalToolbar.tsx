"use client";

import {
  AlertTriangle,
  Check,
  ChevronDown,
  Download,
  LayoutGrid,
  MoreVertical,
  Plus,
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
  { value: "pending", label: "Pending setup" },
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
    <div className="mb-4 flex flex-col gap-2.5 xl:flex-row xl:items-center xl:justify-between">
      {/* Left: Search input */}
      <div className="relative w-full xl:max-w-[440px]">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]"
          aria-hidden="true"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter by hospital, Organisation ID or administrator..."
          aria-label="Filter hospitals"
          className="h-[34px] w-full rounded-md border border-[var(--border-input)] bg-[var(--bg-surface)] pl-8.5 pr-8 text-[13px] text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-colors focus:border-[#1686D9] focus:outline-none"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Right: Action controls */}
      <div className="flex flex-wrap items-center gap-2">
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
          menuClassName="min-w-[180px]"
          trigger={({ toggle }) => (
            <button
              type="button"
              onClick={toggle}
              className="inline-flex h-[34px] items-center gap-2 rounded-md border border-[var(--border-default)] bg-[var(--bg-input)] px-3 text-[13px] font-medium text-[var(--text-body)] transition-colors hover:border-[var(--border-input-hover)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1686D9]"
            >
              <LayoutGrid className="h-3.5 w-3.5 text-[var(--text-subtle)]" />
              <span>{activeViewLabel}</span>
              <ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)]" />
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
                    <Check className="h-3.5 w-3.5 text-[#1686D9]" />
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
              <MoreVertical className="h-4 w-4 text-[var(--text-secondary)]" />
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
              <div className="my-1 border-t border-[var(--border-subtle)]" />
              <DropdownItem
                icon={<AlertTriangle className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />}
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
            className={cn(
              "h-3.5 w-3.5 text-[var(--text-secondary)]",
              isRefreshing && "animate-spin text-[var(--text-primary)]"
            )}
          />
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={onOpenSetupDialog}
          className="px-3.5 font-medium"
        >
          <Plus className="h-4 w-4" />
          <span>Set up a hospital</span>
        </Button>
      </div>
    </div>
  );
}
