"use client";

import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { formatGridDate } from "@/lib/utils";
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
      icon={<Building2 className="h-[20px] w-[20px]" />}
      title={hospital.name}
      description="Registered organisation and primary administrator details."
    >
      <dl className="flex flex-col gap-[14px] rounded-[6px] border border-white/12 bg-[#1f1f1f] p-[16px]">
        <div className="flex flex-col gap-[4px]">
          <dt className="text-[12px] font-normal leading-[16px] tracking-[0.72px] uppercase text-[#707070]">
            ORGANISATION ID
          </dt>
          <dd className="text-[16px] font-normal leading-[24px] text-white">
            {hospital.organisationId}
          </dd>
        </div>
        <div className="flex flex-col gap-[4px]">
          <dt className="text-[12px] font-normal leading-[16px] tracking-[0.72px] uppercase text-[#707070]">
            ADMINISTRATOR
          </dt>
          <dd className="text-[16px] font-normal leading-[24px] text-white">
            {hospital.administrator}
          </dd>
        </div>
        <div className="flex flex-col gap-[4px]">
          <dt className="text-[12px] font-normal leading-[16px] tracking-[0.72px] uppercase text-[#707070]">
            ADMIN EMAIL
          </dt>
          <dd className="text-[16px] font-normal leading-[24px] text-white">
            {hospital.adminEmail}
          </dd>
        </div>
        <div className="flex flex-col gap-[4px]">
          <dt className="text-[12px] font-normal leading-[16px] tracking-[0.72px] uppercase text-[#707070]">
            CREATED
          </dt>
          <dd className="text-[16px] font-normal leading-[24px] text-white">
            {formatGridDate(hospital.createdAt)}
          </dd>
        </div>
      </dl>

      <div className="flex items-center justify-end gap-[10px]">
        <Button variant="ghost" size="md" onClick={onClose}>
          Close
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={() => {
            onClose();
            onEdit(hospital);
          }}
        >
          Edit hospital
        </Button>
      </div>
    </Dialog>
  );
}
