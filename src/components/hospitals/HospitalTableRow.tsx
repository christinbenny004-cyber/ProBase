"use client";

import {
  Copy,
  Eye,
  Hospital as HospitalIcon,
  MoreHorizontal,
  Pencil,
  Trash2,
  Undo2,
} from "lucide-react";
import { Checkbox } from "@/components/ui/Checkbox";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { cn, formatDisplayDate } from "@/lib/utils";
import type { Hospital } from "@/types/hospital";

interface HospitalTableRowProps {
  hospital: Hospital;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onViewDetails: (hospital: Hospital) => void;
  onEdit: (hospital: Hospital) => void;
  onCopyOrgId: (orgId: string) => void;
  onWithdrawSetup: (hospital: Hospital) => void;
  onDelete: (hospital: Hospital) => void;
}

export function HospitalTableRow({
  hospital,
  selected,
  onToggleSelect,
  onViewDetails,
  onEdit,
  onCopyOrgId,
  onWithdrawSetup,
  onDelete,
}: HospitalTableRowProps) {
  const canWithdrawSetup =
    hospital.invitationStatus === "pending" &&
    hospital.status !== "setup_withdrawn";
  return (
    <tr
      className={cn(
        "h-[46px] border-b border-[var(--border-row)] last:border-b-0 transition-colors",
        selected
          ? "bg-[#1686D9]/[0.08] hover:bg-[#1686D9]/[0.12]"
          : "hover:bg-[var(--bg-row-hover)]"
      )}
    >
      <td className="w-[46px] pl-4 pr-2">
        <div className="flex items-center justify-center">
          <Checkbox
            checked={selected}
            onChange={() => onToggleSelect(hospital.id)}
            ariaLabel={`Select ${hospital.name}`}
          />
        </div>
      </td>

      <td className="px-3 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <span
            className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[5px] border border-[#BFDBFE] bg-[#EFF6FF] text-[#1686D9] dark:border-[#273549] dark:bg-[#1C2533] dark:text-[#60A5FA]"
            aria-hidden="true"
          >
            <HospitalIcon className="h-3.5 w-3.5" />
          </span>
          <button
            type="button"
            onClick={() => onViewDetails(hospital)}
            className="text-[13px] font-medium text-[var(--text-primary)] hover:text-[#1686D9] dark:hover:text-[#60A5FA] transition-colors cursor-pointer focus-visible:outline-none focus-visible:underline"
          >
            {hospital.name}
          </button>
          {hospital.status === "setup_withdrawn" && (
            <span className="inline-flex items-center rounded border border-[#FDE68A] bg-[#FFFBEB] px-1.5 py-0.5 text-[11px] font-medium text-[#B45309] dark:border-[#4A3B19] dark:bg-[#241E11] dark:text-[#FBBF24]">
              Setup Withdrawn
            </span>
          )}
        </div>
      </td>

      <td className="px-3 whitespace-nowrap">
        <span className="inline-flex items-center rounded-[5px] border border-[var(--border-default)] bg-[var(--bg-pill)] px-2 py-0.5 text-[12px] font-medium text-[var(--text-body)]">
          {hospital.organisationId}
        </span>
      </td>

      <td className="px-3 text-[13px] text-[var(--text-body)] whitespace-nowrap">
        {hospital.administrator}
      </td>

      <td className="px-3 text-[13px] text-[var(--text-secondary)] whitespace-nowrap">
        {hospital.adminEmail}
      </td>

      <td className="px-3 text-[13px] text-[var(--text-secondary)] whitespace-nowrap">
        {formatDisplayDate(hospital.createdAt)}
      </td>

      <td className="w-[52px] pr-4 text-right whitespace-nowrap">
        <Dropdown
          align="right"
          menuClassName="min-w-[195px]"
          trigger={({ toggle }) => (
            <button
              type="button"
              onClick={toggle}
              aria-label={`Actions for ${hospital.name}`}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1686D9]"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          )}
        >
          {(close) => (
            <>
              <DropdownItem
                icon={<Eye className="h-3.5 w-3.5" />}
                onClick={() => {
                  onViewDetails(hospital);
                  close();
                }}
              >
                View hospital details
              </DropdownItem>
              <DropdownItem
                icon={<Pencil className="h-3.5 w-3.5" />}
                onClick={() => {
                  onEdit(hospital);
                  close();
                }}
              >
                Edit hospital
              </DropdownItem>
              <DropdownItem
                icon={<Copy className="h-3.5 w-3.5" />}
                onClick={() => {
                  onCopyOrgId(hospital.organisationId);
                  close();
                }}
              >
                Copy Organisation ID
              </DropdownItem>
              <div className="my-1 border-t border-[var(--border-subtle)]" />
              <DropdownItem
                icon={<Undo2 className="h-3.5 w-3.5" />}
                disabled={!canWithdrawSetup}
                title={
                  canWithdrawSetup
                    ? "Withdraw pending hospital setup"
                    : "Available only while the initial administrator invitation is pending"
                }
                onClick={() => {
                  if (!canWithdrawSetup) return;
                  onWithdrawSetup(hospital);
                  close();
                }}
                className={cn(
                  !canWithdrawSetup && "opacity-45 cursor-not-allowed"
                )}
              >
                Withdraw setup
              </DropdownItem>
              <DropdownItem
                icon={
                  <Trash2 className="h-3.5 w-3.5 text-[#DC2626] dark:text-[#F87171]" />
                }
                onClick={() => {
                  onDelete(hospital);
                  close();
                }}
                className="text-[#DC2626] hover:text-[#B91C1C] dark:text-[#F87171] dark:hover:text-[#FCA5A5]"
              >
                Delete hospital
              </DropdownItem>
            </>
          )}
        </Dropdown>
      </td>
    </tr>
  );
}
