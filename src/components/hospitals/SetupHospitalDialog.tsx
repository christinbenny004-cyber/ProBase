"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  CheckCircle2,
  Copy,
  Info,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { formatDisplayDate } from "@/lib/utils";
import { checkOrganisationId } from "@/services/hospital.service";
import type {
  CreateHospitalInput,
  CreateHospitalResult,
  Hospital,
} from "@/types/hospital";

const createHospitalSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Hospital name must be at least 2 characters.")
    .max(100, "Hospital name must be 100 characters or fewer."),
  organisationId: z
    .string()
    .trim()
    .min(3, "Organisation ID is required.")
    .max(24, "Organisation ID must be 24 characters or fewer.")
    .regex(
      /^[A-Z0-9]+(?:-[A-Z0-9]+)*$/,
      "Use uppercase letters, numbers, and hyphens only (e.g. ORG-021)."
    ),
  adminEmail: z
    .string()
    .trim()
    .min(1, "First administrator's email is required.")
    .email("Enter a valid email address."),
  administrator: z.string().trim().optional(),
});

const editHospitalSchema = createHospitalSchema.extend({
  administrator: z
    .string()
    .trim()
    .min(2, "Administrator name must be at least 2 characters.")
    .max(80, "Administrator name must be 80 characters or fewer."),
});

type HospitalFormValues = z.infer<typeof createHospitalSchema>;

interface SetupHospitalDialogProps {
  open: boolean;
  onClose: () => void;
  editingHospital: Hospital | null;
  suggestedOrgId: string;
  onCreateHospital: (
    values: CreateHospitalInput
  ) => Promise<CreateHospitalResult>;
  onUpdateHospital: (
    id: string,
    values: CreateHospitalInput
  ) => Promise<void>;
  onWithdrawInvitation: (hospital: Hospital) => Promise<void>;
}

export function SetupHospitalDialog({
  open,
  onClose,
  editingHospital,
  suggestedOrgId,
  onCreateHospital,
  onUpdateHospital,
  onWithdrawInvitation,
}: SetupHospitalDialogProps) {
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [createdResult, setCreatedResult] =
    React.useState<CreateHospitalResult | null>(null);
  const [duplicateOrgError, setDuplicateOrgError] = React.useState<
    string | null
  >(null);
  const [isCheckingOrgId, setIsCheckingOrgId] = React.useState(false);
  const [copiedUrl, setCopiedUrl] = React.useState(false);
  const [isWithdrawing, setIsWithdrawing] = React.useState(false);
  const [withdrawError, setWithdrawError] = React.useState<string | null>(null);

  const isEdit = Boolean(editingHospital);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<HospitalFormValues>({
    resolver: zodResolver(isEdit ? editHospitalSchema : createHospitalSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      organisationId: suggestedOrgId,
      adminEmail: "",
      administrator: "",
    },
  });

  const watchedOrgId = useWatch({ control, name: "organisationId" });

  React.useEffect(() => {
    if (!open) return;

    if (editingHospital) {
      reset({
        name: editingHospital.name,
        organisationId: editingHospital.organisationId,
        adminEmail: editingHospital.adminEmail,
        administrator: editingHospital.administrator,
      });
    } else {
      reset({
        name: "",
        organisationId: suggestedOrgId,
        adminEmail: "",
        administrator: "",
      });
    }
  }, [open, editingHospital, suggestedOrgId, reset]);

  // Live duplicate Organisation ID check via mock API
  React.useEffect(() => {
    if (!open || createdResult) return;

    const normalized = (watchedOrgId ?? "").trim().toUpperCase();
    if (
      normalized.length < 3 ||
      !/^[A-Z0-9]+(?:-[A-Z0-9]+)*$/.test(normalized)
    ) {
      return;
    }

    if (
      editingHospital &&
      editingHospital.organisationId.toUpperCase() === normalized
    ) {
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsCheckingOrgId(true);
      try {
        const res = await checkOrganisationId(normalized, controller.signal);
        if (!res.available) {
          setDuplicateOrgError(
            `Organisation ID "${res.organisationId}" is already in use.`
          );
        } else {
          setDuplicateOrgError(null);
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      } finally {
        if (!controller.signal.aborted) {
          setIsCheckingOrgId(false);
        }
      }
    }, 180);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [open, watchedOrgId, editingHospital, createdResult]);

  const handleClose = () => {
    setSubmitError(null);
    setDuplicateOrgError(null);
    setCreatedResult(null);
    setCopiedUrl(false);
    setWithdrawError(null);
    onClose();
  };

  const onSubmit = async (values: HospitalFormValues) => {
    setSubmitError(null);
    try {
      const payload: CreateHospitalInput = {
        name: values.name,
        organisationId: values.organisationId.toUpperCase(),
        adminEmail: values.adminEmail,
        administrator: values.administrator,
      };

      if (editingHospital) {
        await onUpdateHospital(editingHospital.id, payload);
        handleClose();
      } else {
        const result = await onCreateHospital(payload);
        setCreatedResult(result);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to save hospital record.";
      if (message.toLowerCase().includes("already in use")) {
        setDuplicateOrgError(message);
      } else {
        setSubmitError(message);
      }
    }
  };

  const handleCopyInviteUrl = async () => {
    if (!createdResult) return;
    try {
      await navigator.clipboard.writeText(createdResult.invitation.url);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      setCopiedUrl(false);
    }
  };

  const handleWithdraw = async () => {
    if (!createdResult) return;
    setWithdrawError(null);
    setIsWithdrawing(true);
    try {
      await onWithdrawInvitation(createdResult.hospital);
      handleClose();
    } catch (err) {
      setWithdrawError(
        err instanceof Error
          ? err.message
          : "Unable to withdraw the administrator invitation."
      );
    } finally {
      setIsWithdrawing(false);
    }
  };

  const orgIdRegister = register("organisationId", {
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      const sanitized = event.target.value
        .toUpperCase()
        .replace(/[^A-Z0-9-]/g, "");
      setValue("organisationId", sanitized, { shouldValidate: true });
      setDuplicateOrgError(null);
    },
  });

  const orgIdErrorMessage =
    errors.organisationId?.message ?? duplicateOrgError ?? undefined;
  const isSubmitDisabled =
    isSubmitting ||
    !isValid ||
    Boolean(duplicateOrgError) ||
    isCheckingOrgId;

  if (createdResult) {
    const { hospital, invitation } = createdResult;

    return (
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidthClassName="max-w-[520px]"
        title={`${hospital.name} is set up`}
        description="The hospital tenant is active and the first administrator invitation has been created."
      >
        <div className="space-y-4">
          {withdrawError && (
            <div
              role="alert"
              className="rounded-md border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-[12.5px] text-[#DC2626] dark:border-[#5C262B] dark:bg-[#2A1719] dark:text-[#FCA5A5]"
            >
              {withdrawError}
            </div>
          )}

          {/* Confirmation status banner */}
          <div className="flex items-center gap-2.5 rounded-md border border-[#A7F3D0] bg-[#ECFDF5] px-3.5 py-2.5 text-[12.5px] text-[#065F46] dark:border-[#1E3A2F] dark:bg-[#13221C] dark:text-[#6EE7B7]">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#059669] dark:text-[#34D399]" />
            <span>
              Administrator invitation generated for{" "}
              <strong className="font-medium text-[#064E3B] dark:text-[#ECFDF5]">
                {invitation.email}
              </strong>
              .
            </span>
          </div>

          {/* Invitation URL + Copy */}
          <div>
            <label
              htmlFor="invitation-url"
              className="mb-1.5 block text-[12.5px] font-medium text-[var(--text-body)]"
            >
              Invitation URL
            </label>
            <div className="flex items-center gap-2">
              <input
                id="invitation-url"
                type="text"
                readOnly
                value={invitation.url}
                className="h-[36px] min-w-0 flex-1 rounded-md border border-[var(--border-default)] bg-[var(--bg-input-dialog)] px-3 font-mono text-[12px] text-[var(--text-body)] focus:border-[#1686D9] focus:outline-none"
              />
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleCopyInviteUrl}
                className="h-[36px] shrink-0 px-3"
              >
                {copiedUrl ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#059669] dark:text-[#34D399]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Metadata summary */}
          <dl className="grid grid-cols-1 gap-2.5 text-[12.5px] sm:grid-cols-2">
            <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-input-dialog)] px-3 py-2.5">
              <dt className="text-[11.5px] text-[var(--text-muted)]">Organisation ID</dt>
              <dd className="mt-0.5 font-medium text-[var(--text-primary)]">
                {hospital.organisationId}
              </dd>
            </div>
            <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-input-dialog)] px-3 py-2.5">
              <dt className="text-[11.5px] text-[var(--text-muted)]">Invited email</dt>
              <dd className="mt-0.5 truncate font-medium text-[var(--text-primary)]">
                {invitation.email}
              </dd>
            </div>
            <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-input-dialog)] px-3 py-2.5">
              <dt className="text-[11.5px] text-[var(--text-muted)]">Role</dt>
              <dd className="mt-0.5 font-medium text-[var(--text-primary)]">
                {invitation.role}
              </dd>
            </div>
            <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--bg-input-dialog)] px-3 py-2.5">
              <dt className="text-[11.5px] text-[var(--text-muted)]">
                Invitation expiry
              </dt>
              <dd className="mt-0.5 font-medium text-[var(--text-primary)]">
                {formatDisplayDate(invitation.expiresAt)}
              </dd>
            </div>
          </dl>

          {/* Manual sharing informational panel */}
          <div className="rounded-md border border-[var(--border-table)] bg-[var(--bg-input-dialog)] p-3.5">
            <div className="flex items-start gap-2.5">
              <Info
                className="mt-0.5 h-4 w-4 shrink-0 text-[#1686D9]"
                aria-hidden="true"
              />
              <p className="text-[12px] leading-relaxed text-[var(--text-secondary)]">
                You can copy and share this invitation link manually with the
                first administrator. They will set their own password when
                accepting the invitation.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2.5 border-t border-[var(--border-subtle)] pt-4">
            <Button
              type="button"
              variant="danger"
              onClick={handleWithdraw}
              disabled={isWithdrawing}
            >
              {isWithdrawing && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              <span>{isWithdrawing ? "Withdrawing..." : "Withdraw"}</span>
            </Button>

            <Button
              type="button"
              variant="primary"
              onClick={handleClose}
              disabled={isWithdrawing}
            >
              Done
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidthClassName="max-w-[520px]"
      title={isEdit ? "Edit hospital" : "Set up a hospital"}
      description={
        isEdit
          ? "Update the registered hospital details and primary administrator."
          : "Creating the tenant also creates the invitation for its first administrator, so a new hospital is never left with nobody who can get in."
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {submitError && (
          <div
            role="alert"
            className="rounded-md border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-[12.5px] text-[#DC2626] dark:border-[#5C262B] dark:bg-[#2A1719] dark:text-[#FCA5A5]"
          >
            {submitError}
          </div>
        )}

        <div>
          <label
            htmlFor="hospital-name"
            className="mb-1.5 block text-[12.5px] font-medium text-[var(--text-body)]"
          >
            Hospital name <span className="text-[#EF4444]">*</span>
          </label>
          <input
            id="hospital-name"
            type="text"
            autoComplete="organization"
            placeholder="e.g. St. Mary's General Hospital"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={
              errors.name ? "hospital-name-error" : "hospital-name-help"
            }
            {...register("name")}
            className="h-[36px] w-full rounded-md border border-[var(--border-default)] bg-[var(--bg-input-dialog)] px-3 text-[13px] text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-colors focus:border-[#1686D9] focus:outline-none aria-[invalid=true]:border-[#EF4444]"
          />
          {errors.name ? (
            <p
              id="hospital-name-error"
              className="mt-1.5 text-[12px] text-[#DC2626] dark:text-[#F87171]"
            >
              {errors.name.message}
            </p>
          ) : (
            <p
              id="hospital-name-help"
              className="mt-1.5 text-[12px] text-[var(--text-muted)]"
            >
              The display name. It can be changed later.
            </p>
          )}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="organisation-id"
              className="block text-[12.5px] font-medium text-[var(--text-body)]"
            >
              Organisation ID <span className="text-[#EF4444]">*</span>
            </label>
            {isCheckingOrgId && (
              <span className="inline-flex items-center gap-1 text-[11px] text-[var(--text-subtle)]">
                <Loader2 className="h-3 w-3 animate-spin" />
                Checking...
              </span>
            )}
          </div>
          <input
            id="organisation-id"
            type="text"
            inputMode="text"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={24}
            placeholder="ORG-021"
            aria-invalid={Boolean(orgIdErrorMessage)}
            aria-describedby={
              orgIdErrorMessage
                ? "organisation-id-error"
                : "organisation-id-help"
            }
            {...orgIdRegister}
            className="h-[36px] w-full rounded-md border border-[var(--border-default)] bg-[var(--bg-input-dialog)] px-3 text-[13px] uppercase tracking-wide text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-colors focus:border-[#1686D9] focus:outline-none aria-[invalid=true]:border-[#EF4444]"
          />
          {orgIdErrorMessage ? (
            <p
              id="organisation-id-error"
              role="alert"
              className="mt-1.5 text-[12px] text-[#DC2626] dark:text-[#F87171]"
            >
              {orgIdErrorMessage}
            </p>
          ) : (
            <p
              id="organisation-id-help"
              className="mt-1.5 text-[12px] text-[var(--text-muted)]"
            >
              Permanent — people sign in with this, and renaming the hospital
              never changes it.
            </p>
          )}
        </div>

        {isEdit && (
          <div>
            <label
              htmlFor="administrator-name"
              className="mb-1.5 block text-[12.5px] font-medium text-[var(--text-body)]"
            >
              Administrator name <span className="text-[#EF4444]">*</span>
            </label>
            <input
              id="administrator-name"
              type="text"
              placeholder="e.g. Rachel Mathew"
              aria-invalid={Boolean(errors.administrator)}
              {...register("administrator")}
              className="h-[36px] w-full rounded-md border border-[var(--border-default)] bg-[var(--bg-input-dialog)] px-3 text-[13px] text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-colors focus:border-[#1686D9] focus:outline-none aria-[invalid=true]:border-[#EF4444]"
            />
            {errors.administrator && (
              <p className="mt-1.5 text-[12px] text-[#DC2626] dark:text-[#F87171]">
                {errors.administrator.message}
              </p>
            )}
          </div>
        )}

        <div>
          <label
            htmlFor="administrator-email"
            className="mb-1.5 block text-[12.5px] font-medium text-[var(--text-body)]"
          >
            First administrator&apos;s email{" "}
            <span className="text-[#EF4444]">*</span>
          </label>
          <input
            id="administrator-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="e.g. admin@hospital.org"
            aria-invalid={Boolean(errors.adminEmail)}
            aria-describedby={
              errors.adminEmail ? "admin-email-error" : "admin-email-help"
            }
            {...register("adminEmail")}
            className="h-[36px] w-full rounded-md border border-[var(--border-default)] bg-[var(--bg-input-dialog)] px-3 text-[13px] text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-colors focus:border-[#1686D9] focus:outline-none aria-[invalid=true]:border-[#EF4444]"
          />
          {errors.adminEmail ? (
            <p
              id="admin-email-error"
              className="mt-1.5 text-[12px] text-[#DC2626] dark:text-[#F87171]"
            >
              {errors.adminEmail.message}
            </p>
          ) : (
            <p
              id="admin-email-help"
              className="mt-1.5 text-[12px] text-[var(--text-muted)]"
            >
              They choose their own password from the invitation link.
            </p>
          )}
        </div>

        {!isEdit && (
          <div className="rounded-md border border-[var(--border-table)] bg-[var(--bg-input-dialog)] p-3.5">
            <div className="flex items-start gap-2.5">
              <ShieldCheck
                className="mt-0.5 h-4 w-4 shrink-0 text-[#1686D9]"
                aria-hidden="true"
              />
              <div className="space-y-1">
                <h3 className="text-[12.5px] font-semibold text-[var(--text-primary)]">
                  Always an administrator, never a password
                </h3>
                <p className="text-[12px] leading-relaxed text-[var(--text-secondary)]">
                  Organisation IDs are permanent and cannot be reassigned once
                  created. The first invitation is fixed to the administrator
                  role, so the hospital can always staff itself without you
                  ever seeing or choosing a password.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 border-t border-[var(--border-subtle)] pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitDisabled}>
            {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>
              {isSubmitting
                ? isEdit
                  ? "Saving..."
                  : "Creating..."
                : isEdit
                ? "Save changes"
                : "Create tenant and invite"}
            </span>
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
