"use client";

import * as React from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Dialog } from "@/components/ui/Dialog";
import type { Hospital } from "@/types/hospital";

interface DeleteHospitalDialogProps {
  hospital: Hospital | null;
  onClose: () => void;
  onConfirmDelete: (hospital: Hospital) => Promise<void>;
}

export function DeleteHospitalDialog({
  hospital,
  onClose,
  onConfirmDelete,
}: DeleteHospitalDialogProps) {
  const [confirmed, setConfirmed] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!hospital) return null;

  const handleClose = () => {
    if (isSubmitting) return;
    setConfirmed(false);
    setError(null);
    onClose();
  };

  const handleDelete = async () => {
    if (!confirmed || isSubmitting) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await onConfirmDelete(hospital);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete hospital. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={Boolean(hospital)}
      onClose={handleClose}
      title="Delete hospital"
      description="This action removes the hospital from active platform records."
    >
      <div className="space-y-4">
        {error && (
          <div
            role="alert"
            className="rounded-md border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-[12.5px] text-[#DC2626] dark:border-[#5C262B] dark:bg-[#2A1719] dark:text-[#FCA5A5]"
          >
            {error}
          </div>
        )}

        <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-input-dialog)] p-3.5">
          <div className="text-[11.5px] uppercase tracking-wider text-[var(--text-muted)]">
            Target Hospital
          </div>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[14px] font-semibold text-[var(--text-primary)]">
              {hospital.name}
            </span>
            <span className="inline-flex items-center rounded-[5px] border border-[var(--border-default)] bg-[var(--bg-pill)] px-2 py-0.5 text-[12px] font-medium text-[var(--text-body)]">
              {hospital.organisationId}
            </span>
          </div>
        </div>

        <div className="rounded-md border border-[#FECACA] bg-[#FEF2F2] p-3.5 dark:border-[#5C262B] dark:bg-[#2A1719]">
          <div className="flex items-start gap-2.5">
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0 text-[#DC2626] dark:text-[#F87171]"
              aria-hidden="true"
            />
            <p className="text-[12.5px] leading-relaxed text-[#991B1B] dark:text-[#FCA5A5]">
              Deleting <strong>{hospital.name}</strong> (
              <strong>{hospital.organisationId}</strong>) removes the hospital
              from all active platform records and directory views, and revokes
              any pending administrator invitations.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-input-dialog)] p-3">
          <Checkbox
            checked={confirmed}
            onChange={() => {
              if (!isSubmitting) setConfirmed((prev) => !prev);
            }}
            ariaLabel={`Confirm deletion of ${hospital.name}`}
            className="mt-0.5"
          />
          <button
            type="button"
            onClick={() => {
              if (!isSubmitting) setConfirmed((prev) => !prev);
            }}
            className="text-left text-[12.5px] leading-snug text-[var(--text-body)] cursor-pointer select-none"
          >
            I understand this will remove{" "}
            <strong className="text-[var(--text-primary)]">
              {hospital.name}
            </strong>{" "}
            from active platform records.
          </button>
        </div>

        <div className="flex items-center justify-end gap-2.5 border-t border-[var(--border-subtle)] pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            disabled={!confirmed || isSubmitting}
          >
            {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{isSubmitting ? "Deleting..." : "Delete hospital"}</span>
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
