"use client";

import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  Download,
  Filter,
} from "lucide-react";
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
    <div className="flex min-h-[46px] w-full flex-wrap items-center gap-[8px] border-t border-white/12 bg-[#1a1a1a] px-[12px] py-2">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={!canGoPrev}
        aria-label="Previous page"
        className="inline-flex h-[26px] w-[26px] items-center justify-center rounded-[4px] border border-white/20 bg-[var(--color-surface)] text-white transition-colors hover:bg-[#242424] disabled:pointer-events-none disabled:text-[#707070] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c75b3]"
      >
        <ChevronLeft strokeWidth={1.6} className="h-[13px] w-[13px]" />
      </button>

      <span className="text-[12px] font-normal leading-[16px] text-[#707070]">
        Page
      </span>

      <span className="inline-flex h-[26px] w-[38px] items-center justify-center rounded-[4px] border border-white/20 bg-[var(--color-surface-overlay)] text-[14px] font-normal leading-[20px] text-white">
        {page}
      </span>

      <span className="text-[12px] font-normal leading-[16px] text-[#707070]">
        of {totalPages}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={!canGoNext}
        aria-label="Next page"
        className="inline-flex h-[26px] w-[26px] items-center justify-center rounded-[4px] border border-white/20 bg-[var(--color-surface)] text-white transition-colors hover:bg-[#242424] disabled:pointer-events-none disabled:text-[#707070] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c75b3]"
      >
        <ArrowRight strokeWidth={1.6} className="h-[13px] w-[13px]" />
      </button>

      <Dropdown
        align="left"
        menuClassName="min-w-[120px] bottom-full mb-1.5 mt-0"
        trigger={({ toggle }) => (
          <button
            type="button"
            onClick={toggle}
            aria-label="Rows per page"
            className="inline-flex h-[30px] items-center gap-[6px] rounded-[6px] border border-white/20 bg-[var(--color-surface)] px-[10px] font-display text-[14px] font-medium leading-[20px] text-white transition-colors hover:bg-[#242424] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c75b3]"
          >
            <Filter strokeWidth={1.6} className="h-[14px] w-[14px] text-[#a0a0a0]" />
            <span>{pageSize} rows</span>
            <ChevronDown strokeWidth={1.6} className="h-[13px] w-[13px] text-[#a0a0a0]" />
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

      <span className="text-[12px] font-normal leading-[16px] text-[#707070]">
        {total} {total === 1 ? "hospital" : "hospitals"}
      </span>

      {selectedCount > 0 && (
        <span className="rounded-[4px] bg-[#1c75b3]/20 px-2 py-0.5 text-[12px] font-medium text-white">
          {selectedCount} selected
        </span>
      )}

      <div className="flex-1" />

      <button
        type="button"
        onClick={onExportCsv}
        disabled={total === 0}
        className="inline-flex h-[30px] items-center gap-[6px] rounded-[6px] border border-white/20 bg-[#1a1a1a] px-[10px] font-display text-[14px] font-medium leading-[20px] text-white transition-colors hover:bg-[#242424] disabled:pointer-events-none disabled:opacity-40 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1c75b3]"
      >
        <Download strokeWidth={1.6} className="h-[14px] w-[14px] text-[#a0a0a0]" />
        <span>Export CSV</span>
      </button>
    </div>
  );
}
