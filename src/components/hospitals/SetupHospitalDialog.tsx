"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Building2, Link2, Loader2 } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { Dialog } from "@/components/ui/Dialog";
import { FormInput } from "@/components/ui/Input";
import { formatDisplayDate, formatGridDate } from "@/lib/utils";
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
    .min(2, "Organisation ID is required.")
    .max(32, "Organisation ID must be 32 characters or fewer.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens only (e.g. airedale)."
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
  onCreateHospital: (
    values: CreateHospitalInput
  ) => Promise<CreateHospitalResult>;
  onUpdateHospital: (
    id: string,
    values: CreateHospitalInput
  ) => Promise<void>;
  onWithdrawInvitation: (hospital: Hospital) => Promise<void>;
  onCompleteSetup: (result: CreateHospitalResult) => void;
}

export function SetupHospitalDialog({
  open,
  onClose,
  editingHospital,
  onCreateHospital,
  onUpdateHospital,
  onWithdrawInvitation,
  onCompleteSetup,
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
      organisationId: "",
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
        organisationId: "",
        adminEmail: "",
        administrator: "",
      });
    }
  }, [open, editingHospital, reset]);

  // Live duplicate Organisation ID check via mock API (PA 12)
  React.useEffect(() => {
    if (!open || createdResult) return;

    const normalized = (watchedOrgId ?? "").trim().toLowerCase();
    if (
      normalized.length < 2 ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)
    ) {
      return;
    }

    if (
      editingHospital &&
      editingHospital.organisationId.toLowerCase() === normalized
    ) {
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsCheckingOrgId(true);
      try {
        const res = await checkOrganisationId(normalized, controller.signal);
        if (!res.available) {
          if (res.conflict) {
            setDuplicateOrgError(
              `Taken by ${res.conflict.name}, set up ${formatGridDate(
                res.conflict.createdAt
              )}. Try ${res.organisationId}-nhs or ${res.organisationId}-ft.`
            );
          } else {
            setDuplicateOrgError(
              `Organisation ID "${res.organisationId}" is already in use.`
            );
          }
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

  const resetLocalState = () => {
    setSubmitError(null);
    setDuplicateOrgError(null);
    setCreatedResult(null);
    setCopiedUrl(false);
    setWithdrawError(null);
  };

  const handleClose = () => {
    resetLocalState();
    onClose();
  };

  const handleDone = () => {
    if (createdResult) {
      onCompleteSetup(createdResult);
    }
    handleClose();
  };

  const onSubmit = async (values: HospitalFormValues) => {
    setSubmitError(null);
    try {
      const payload: CreateHospitalInput = {
        name: values.name,
        organisationId: values.organisationId.toLowerCase(),
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
      if (
        message.toLowerCase().includes("taken by") ||
        message.toLowerCase().includes("already in use")
      ) {
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
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "");
      setValue("organisationId", sanitized, { shouldValidate: true });
      setDuplicateOrgError(null);
    },
  });

  const isDuplicateState = Boolean(duplicateOrgError);
  const orgIdErrorMessage =
    errors.organisationId?.message ?? duplicateOrgError ?? undefined;
  const isSubmitDisabled =
    isSubmitting || !isValid || isDuplicateState || isCheckingOrgId;

  // PA 11 · Invitation created — link
  if (createdResult) {
    const { hospital, invitation } = createdResult;

    return (
      <Dialog
        open={open}
        onClose={handleDone}
        icon={<Link2 strokeWidth={1.6} className="h-[20px] w-[20px]" />}
        title={`${hospital.name} is set up`}
        description={`Send this link to ${invitation.email}. It is the only way into the new hospital.`}
      >
        {withdrawError && (
          <div
            role="alert"
            className="rounded-[8px] border border-[var(--color-danger-border)] bg-[var(--color-surface-overlay)] px-3 py-2 text-[13px] text-[var(--color-danger-text)]"
          >
            {withdrawError}
          </div>
        )}

        {/* Invite Link */}
        <div className="flex items-center gap-[12px] rounded-[6px] border border-[var(--color-border)] bg-[var(--color-surface-overlay)] px-[14px] py-[12px]">
          <p className="min-w-0 flex-1 break-all font-mono-code text-[13px] font-medium leading-[22.1px] text-[var(--color-text)]">
            {invitation.url}
          </p>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleCopyInviteUrl}
            className="shrink-0"
          >
            {copiedUrl ? "Copied" : "Copy"}
          </Button>
        </div>

        {/* Details */}
        <dl className="flex flex-col gap-[14px] rounded-[6px] border border-[var(--color-border)] bg-[var(--color-surface-overlay)] p-[16px]">
          <div className="flex flex-col gap-[4px]">
            <dt className="text-[12px] font-normal leading-[16px] tracking-[0.72px] uppercase text-[var(--color-text-subtle)]">
              ORGANISATION ID
            </dt>
            <dd className="text-[16px] font-normal leading-[24px] text-[var(--color-text)]">
              {hospital.organisationId}
            </dd>
          </div>
          <div className="flex flex-col gap-[4px]">
            <dt className="text-[12px] font-normal leading-[16px] tracking-[0.72px] uppercase text-[var(--color-text-subtle)]">
              INVITED
            </dt>
            <dd className="break-all text-[16px] font-normal leading-[24px] text-[var(--color-text)]">
              {invitation.email}
            </dd>
          </div>
          <div className="flex flex-col gap-[4px]">
            <dt className="text-[12px] font-normal leading-[16px] tracking-[0.72px] uppercase text-[var(--color-text-subtle)]">
              ROLE
            </dt>
            <dd className="text-[16px] font-normal leading-[24px] text-[var(--color-text)]">
              {invitation.role}
            </dd>
          </div>
          <div className="flex flex-col gap-[4px]">
            <dt className="text-[12px] font-normal leading-[16px] tracking-[0.72px] uppercase text-[var(--color-text-subtle)]">
              EXPIRES
            </dt>
            <dd className="text-[16px] font-normal leading-[24px] text-[var(--color-text)]">
              {formatDisplayDate(invitation.expiresAt)} (seven days)
            </dd>
          </div>
        </dl>

        {/* Callout */}
        <Callout
          icon={<Building2 strokeWidth={1.6} className="h-[18px] w-[18px]" />}
          title="Pass this link on yourself"
          description="ProBase cannot send email yet. Copy it into whatever channel you already use with this hospital. It is recorded in the audit trail against your name."
        />

        {/* Dialog Actions */}
        <div className="flex items-center justify-end gap-[10px]">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleWithdraw}
            disabled={isWithdrawing}
          >
            {isWithdrawing && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{isWithdrawing ? "Withdrawing..." : "Withdraw"}</span>
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleDone}
            disabled={isWithdrawing}
          >
            Done
          </Button>
        </div>
      </Dialog>
    );
  }

  // PA 10 (default) & PA 12 (duplicate Organisation ID)
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      icon={
        isDuplicateState ? (
          <AlertTriangle strokeWidth={1.6} className="h-[20px] w-[20px]" />
        ) : (
          <Building2 strokeWidth={1.6} className="h-[20px] w-[20px]" />
        )
      }
      title={isEdit ? "Edit hospital" : "Set up a hospital"}
      description={
        isDuplicateState
          ? "This Organisation ID is already in use. Nothing has been created."
          : isEdit
          ? "Update the registered hospital details and primary administrator."
          : "Creating the tenant also creates the invitation for its first administrator, so a new hospital is never left with nobody who can get in."
      }
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-[18px]"
      >
        {submitError && (
          <div
            role="alert"
            className="rounded-[8px] border border-[var(--color-danger-border)] bg-[var(--color-surface-overlay)] px-3 py-2 text-[13px] text-[var(--color-danger-text)]"
          >
            {submitError}
          </div>
        )}

        <div className="flex flex-col gap-[16px]">
          <FormInput
            id="hospital-name"
            type="text"
            label="Hospital name"
            autoComplete="organization"
            placeholder="Airedale NHS Foundation Trust"
            helperText="The display name. It can be changed later."
            errorText={errors.name?.message}
            {...register("name")}
          />

          <FormInput
            id="organisation-id"
            type="text"
            label="Organisation ID"
            inputMode="text"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={32}
            placeholder="airedale"
            helperText="Permanent — people sign in with this, and renaming the hospital never changes it."
            errorText={orgIdErrorMessage}
            {...orgIdRegister}
          />

          {isEdit && (
            <FormInput
              id="administrator-name"
              type="text"
              label="Administrator name"
              placeholder="Sobin John"
              errorText={errors.administrator?.message}
              {...register("administrator")}
            />
          )}

          <FormInput
            id="administrator-email"
            type="email"
            label="First administrator's email"
            inputMode="email"
            autoComplete="email"
            placeholder="j.harding@anhst.nhs.uk"
            helperText="They choose their own password from the invitation link."
            errorText={errors.adminEmail?.message}
            {...register("adminEmail")}
          />
        </div>

        {/* Callout (PA 10 vs PA 12) */}
        {!isEdit && (
          <Callout
            icon={<Building2 strokeWidth={1.6} className="h-[18px] w-[18px]" />}
            title={
              isDuplicateState
                ? "Organisation IDs are permanent"
                : "Always an administrator, never a password"
            }
            description={
              isDuplicateState
                ? "They can never be reused or changed, because people sign in with them. Pick one this hospital will still recognise in ten years."
                : "The first invitation is fixed to the administrator role, so the hospital can always staff itself. You never see or choose the password."
            }
          />
        )}

        {/* Dialog Actions */}
        <div className="flex items-center justify-end gap-[10px]">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitDisabled}
          >
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
