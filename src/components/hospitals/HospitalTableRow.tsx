"use client";

import { Checkbox } from "@/components/ui/Checkbox";
import { cn, formatGridDate } from "@/lib/utils";
import type { Hospital } from "@/types/hospital";

interface HospitalTableRowProps {
  hospital: Hospital;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onViewDetails: (hospital: Hospital) => void;
}

export function HospitalTableRow({
  hospital,
  selected,
  onToggleSelect,
  onViewDetails,
}: HospitalTableRowProps) {
  return (
    <tr
      className={cn(
        "h-[43px] transition-colors",
        selected
          ? "bg-[#1c75b3]/[0.12] hover:bg-[#1c75b3]/[0.16]"
          : "bg-[#121212] hover:bg-white/[0.03]"
      )}
    >
      <td className="w-[48px] min-w-[48px] border-b border-r border-white/12 p-0">
        <div className="flex items-center justify-center">
          <Checkbox
            checked={selected}
            onChange={() => onToggleSelect(hospital.id)}
            ariaLabel={`Select ${hospital.name}`}
          />
        </div>
      </td>

      <td className="border-b border-r border-white/12 px-[12px] text-[14px] font-normal leading-[20px] text-white whitespace-nowrap">
        <button
          type="button"
          onClick={() => onViewDetails(hospital)}
          className="block max-w-full truncate text-left text-white transition-colors hover:text-[#1c75b3] cursor-pointer focus-visible:outline-none focus-visible:underline"
        >
          {hospital.name}
        </button>
      </td>

      <td className="border-b border-r border-white/12 px-[12px] text-[14px] font-normal leading-[20px] text-white whitespace-nowrap">
        {hospital.organisationId}
      </td>

      <td className="border-b border-r border-white/12 px-[12px] text-[14px] font-normal leading-[20px] text-white whitespace-nowrap">
        {hospital.administrator}
      </td>

      <td className="border-b border-r border-white/12 px-[12px] text-[14px] font-normal leading-[20px] text-white whitespace-nowrap">
        {hospital.adminEmail}
      </td>

      <td className="border-b border-white/12 px-[12px] text-[14px] font-normal leading-[20px] text-white whitespace-nowrap">
        {formatGridDate(hospital.createdAt)}
      </td>
    </tr>
  );
}
