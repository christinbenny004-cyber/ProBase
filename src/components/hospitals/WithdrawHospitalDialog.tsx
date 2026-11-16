"use client";

import * as React from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import type { Hospital } from "@/types/hospital";

interface WithdrawHospitalDialogProps {
  hospital: Hospital | null;
  onClose: () => void;
  onConfirmWithdraw: (hospital: Hospital) => Promise<void>;
}

export function WithdrawHospitalDialog({
  hospital,
  onClose,
  onConfirmWithdraw,
}: WithdrawHospitalDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  if (!hospital) return null;

  const handleClose = () => {
    if (isSubmitting) return;
    setError(null);
    onClose();
  };

  const handleConfirm = async () => {
    if (isSubmitting) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await onConfirmWithdraw(hospital);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to withdraw hospital setup. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={Boolean(hospital)}
      onClose={handleClose}
      title="Withdraw hospital setup"
      description="Revoke the pending initial administrator invitation and mark this setup as withdrawn."
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
          <div className="text-[13.5px] font-semibold text-[var(--text-primary)]">
            {hospital.name}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px] text-[var(--text-secondary)]">
            <span className="inline-flex items-center rounded-[5px] border border-[var(--border-default)] bg-[var(--bg-pill)] px-2 py-0.5 font-medium text-[var(--text-body)]">
              {hospital.organisationId}
            </span>
            <span>•</span>
            <span className="truncate">{hospital.adminEmail}</span>
          </div>
        </div>

        <div className="rounded-md border border-[#FDE68A] bg-[#FFFBEB] p-3.5 dark:border-[#4A3B19] dark:bg-[#241E11]">
          <div className="flex items-start gap-2.5">
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0 text-[#D97706] dark:text-[#FBBF24]"
              aria-hidden="true"
            />
            <div className="space-y-1 text-[12.5px] leading-relaxed text-[#92400E] dark:text-[#FDE68A]">
              <p className="font-medium">Consequences of withdrawing setup:</p>
              <ul className="list-disc space-y-1 pl-4">
                <li>
                  Hospital status will be updated to{" "}
                  <strong>Setup Withdrawn</strong>.
                </li>
                <li>
                  The pending administrator invitation for{" "}
                  <strong>{hospital.adminEmail}</strong> will be revoked and can
                  no longer be accepted.
                </li>
                <li>
                  The record is preserved for audit and history, and will no
                  longer appear in the Active hospitals view.
                </li>
              </ul>
            </div>
          </div>
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
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{isSubmitting ? "Withdrawing..." : "Withdraw setup"}</span>
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
