"use client";

import { ChevronDown, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

interface HospitalPaginationProps {
  page: number;
  totalPages: number;
  pageSize: number;
  total: number;
  selectedCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onExportCsv: () => void;
}

export function HospitalPagination({
  page,
  totalPages,
  pageSize,
  total,
  selectedCount,
  onPageChange,
  onPageSizeChange,
  onExportCsv,
}: HospitalPaginationProps) {
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  return (
    <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--border-table)] bg-[var(--bg-table)] px-3.5 py-2.5">
      {/* Left: Pagination controls + rows per page + count */}
      <div className="flex flex-wrap items-center gap-3 text-[13px]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={!canGoPrev}
            aria-label="Previous page"
            className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-md border border-[var(--border-default)] bg-[var(--bg-input)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] disabled:pointer-events-none disabled:opacity-40 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1686D9]"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
            <span>Page</span>
            <span className="inline-flex h-[30px] min-w-[30px] items-center justify-center rounded-md border border-[var(--border-default)] bg-[var(--bg-pill)] px-2 text-[12.5px] font-medium text-[var(--text-primary)]">
              {page}
            </span>
            <span>of {totalPages}</span>
          </div>

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={!canGoNext}
            aria-label="Next page"
            className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-md border border-[var(--border-default)] bg-[var(--bg-input)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] disabled:pointer-events-none disabled:opacity-40 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1686D9]"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <Dropdown
          align="left"
          menuClassName="min-w-[115px] bottom-full mb-1.5 mt-0"
          trigger={({ toggle }) => (
            <button
              type="button"
              onClick={toggle}
              aria-label="Rows per page"
              className="inline-flex h-[30px] items-center gap-2 rounded-md border border-[var(--border-default)] bg-[var(--bg-input)] px-2.5 text-[12.5px] font-medium text-[var(--text-body)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1686D9]"
            >
              <span>{pageSize} rows</span>
              <ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            </button>
          )}
        >
          {(close) =>
            PAGE_SIZE_OPTIONS.map((size) => (
              <DropdownItem
                key={size}
                active={pageSize === size}
                onClick={() => {
                  onPageSizeChange(size);
                  close();
                }}
              >
                {size} rows
              </DropdownItem>
            ))
          }
        </Dropdown>

        <span className="text-[12.5px] text-[var(--text-muted)]">
          {total} {total === 1 ? "hospital" : "hospitals"}
        </span>

        {selectedCount > 0 && (
          <span className="rounded bg-[#1686D9]/15 px-2 py-0.5 text-[12px] font-medium text-[#1686D9] dark:text-[#60A5FA]">
            {selectedCount} selected
          </span>
        )}
      </div>

      {/* Right: Export CSV */}
      <Button
        variant="secondary"
        size="sm"
        onClick={onExportCsv}
        disabled={total === 0}
        className="h-[30px] px-3 text-[12.5px]"
      >
        <Download className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
        <span>Export CSV</span>
      </Button>
    </div>
  );
}
