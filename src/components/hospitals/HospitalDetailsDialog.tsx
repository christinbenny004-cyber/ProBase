"use client";

import { Hospital as HospitalIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { formatDisplayDate } from "@/lib/utils";
import type { Hospital } from "@/types/hospital";

interface HospitalDetailsDialogProps {
  hospital: Hospital | null;
  onClose: () => void;
  onEdit: (hospital: Hospital) => void;
}

export function HospitalDetailsDialog({
  hospital,
  onClose,
  onEdit,
}: HospitalDetailsDialogProps) {
  if (!hospital) return null;

  return (
    <Dialog
      open={Boolean(hospital)}
      onClose={onClose}
      title="Hospital details"
      description="Registered organisation and primary administrator summary."
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-md border border-[var(--border-table)] bg-[var(--bg-input-dialog)] p-3.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#BFDBFE] bg-[#EFF6FF] text-[#1686D9] dark:border-[#273549] dark:bg-[#1C2533] dark:text-[#60A5FA]">
            <HospitalIcon className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <div className="truncate text-[14px] font-semibold text-[var(--text-primary)]">
              {hospital.name}
            </div>
            <div className="mt-0.5 text-[12px] text-[var(--text-subtle)]">
              {hospital.organisationId}
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-3 text-[13px] sm:grid-cols-2">
          <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-table)] p-3">
            <dt className="text-[11.5px] text-[var(--text-muted)]">Administrator</dt>
            <dd className="mt-1 font-medium text-[var(--text-body)]">
              {hospital.administrator}
            </dd>
          </div>
          <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-table)] p-3">
            <dt className="text-[11.5px] text-[var(--text-muted)]">Admin Email</dt>
            <dd className="mt-1 truncate font-medium text-[var(--text-body)]">
              {hospital.adminEmail}
            </dd>
          </div>
          <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-table)] p-3">
            <dt className="text-[11.5px] text-[var(--text-muted)]">Created</dt>
            <dd className="mt-1 font-medium text-[var(--text-body)]">
              {formatDisplayDate(hospital.createdAt)}
            </dd>
          </div>
          <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-table)] p-3">
            <dt className="text-[11.5px] text-[var(--text-muted)]">Status</dt>
            <dd className="mt-1 font-medium capitalize text-[var(--text-body)]">
              {hospital.status === "setup_withdrawn"
                ? "Setup Withdrawn"
                : hospital.status}
            </dd>
          </div>
        </dl>

        <div className="flex justify-end gap-2.5 border-t border-[var(--border-subtle)] pt-4">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              onClose();
              onEdit(hospital);
            }}
          >
            Edit hospital
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
