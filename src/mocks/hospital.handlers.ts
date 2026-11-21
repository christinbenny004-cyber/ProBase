import { INITIAL_HOSPITALS } from "@/mocks/hospital.data";
import { formatGridDate } from "@/lib/utils";
import type {
  ApiResponse,
  CreateHospitalInput,
  CreateHospitalResult,
  DateRangeFilter,
  Hospital,
  HospitalQueryParams,
  HospitalSortField,
  OrgIdCheckResult,
  PaginatedResponse,
  SortDirection,
  UpdateHospitalInput,
} from "@/types/hospital";

// In-memory mock store for the session
let hospitalStore: Hospital[] = [...INITIAL_HOSPITALS];

export function simulateLatency(ms = 220): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function matchesDateFilter(createdAt: string, filter: DateRangeFilter): boolean {
  if (filter === "all") return true;

  const date = new Date(`${createdAt}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return true;

  const month = date.getUTCMonth(); // 0-indexed: 4=May, 5=Jun, 6=Jul, 7=Aug, 8=Sep
  if (filter === "may_jun_2026") {
    return month === 4 || month === 5;
  }
  if (filter === "jul_aug_2026") {
    return month === 6 || month === 7;
  }
  if (filter === "sep_2026") {
    return month === 8;
  }

  return true;
}

function compareHospitals(
  a: Hospital,
  b: Hospital,
  sortBy: HospitalSortField,
  direction: SortDirection
): number {
  const multiplier = direction === "asc" ? 1 : -1;

  if (sortBy === "createdAt") {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    if (timeA !== timeB) {
      return (timeA - timeB) * multiplier;
    }
    return a.id.localeCompare(b.id) * multiplier;
  }

  const valA = a[sortBy].toLowerCase();
  const valB = b[sortBy].toLowerCase();
  return valA.localeCompare(valB, undefined, { numeric: true }) * multiplier;
}

export async function handleGetHospitals(
  params: HospitalQueryParams = {}
): Promise<ApiResponse<PaginatedResponse<Hospital>>> {
  await simulateLatency(220);

  if (params.simulateError) {
    throw new Error(
      "Simulated network error: Unable to reach the ProBase hospital directory."
    );
  }

  const {
    search = "",
    sortBy = "createdAt",
    sortDirection = "asc",
    dateFilter = "all",
    viewMode = "active",
    page = 1,
    pageSize = 50,
  } = params;

  const normalizedQuery = search.trim().toLowerCase();

  const filtered = hospitalStore.filter((hospital) => {
    if (viewMode === "active" && hospital.status !== "active") {
      return false;
    }
    if (viewMode === "pending" && hospital.status !== "pending") {
      return false;
    }

    if (!matchesDateFilter(hospital.createdAt, dateFilter)) {
      return false;
    }

    if (!normalizedQuery) return true;

    return (
      hospital.name.toLowerCase().includes(normalizedQuery) ||
      hospital.organisationId.toLowerCase().includes(normalizedQuery) ||
      hospital.administrator.toLowerCase().includes(normalizedQuery) ||
      hospital.adminEmail.toLowerCase().includes(normalizedQuery)
    );
  });

  const sorted = [...filtered].sort((a, b) =>
    compareHospitals(a, b, sortBy, sortDirection)
  );

  const total = sorted.length;
  const safePageSize = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const startIndex = (safePage - 1) * safePageSize;
  const items = sorted.slice(startIndex, startIndex + safePageSize);

  return {
    success: true,
    data: {
      items,
      total,
      page: safePage,
      pageSize: safePageSize,
      totalPages,
      allMatchingItems: sorted,
    },
  };
}

function deriveAdministratorName(email: string): string {
  const localPart = email.split("@")[0] ?? "Administrator";
  const words = localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase());

  return words.length > 0 ? words.join(" ") : "Administrator";
}

export async function handleCheckOrganisationId(
  orgId: string
): Promise<ApiResponse<OrgIdCheckResult>> {
  await simulateLatency(120);
  const normalizedOrgId = orgId.trim().toLowerCase();
  const existing = hospitalStore.find(
    (h) => h.organisationId.toLowerCase() === normalizedOrgId
  );

  return {
    success: true,
    data: {
      available: !existing,
      organisationId: normalizedOrgId,
      conflict: existing
        ? {
            name: existing.name,
            createdAt: existing.createdAt,
          }
        : undefined,
    },
  };
}

export async function handleCreateHospital(
  input: CreateHospitalInput
): Promise<ApiResponse<CreateHospitalResult>> {
  await simulateLatency(320);

  const normalizedOrgId = input.organisationId.trim().toLowerCase();
  const duplicate = hospitalStore.find(
    (h) => h.organisationId.toLowerCase() === normalizedOrgId
  );

  if (duplicate) {
    throw new Error(
      `Taken by ${duplicate.name}, set up ${formatGridDate(duplicate.createdAt)}. Try ${normalizedOrgId}-nhs or ${normalizedOrgId}-ft.`
    );
  }

  const normalizedEmail = input.adminEmail.trim().toLowerCase();
  const resolvedAdmin =
    input.administrator?.trim() || deriveAdministratorName(normalizedEmail);

  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const expiryDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const hospitalId = `hosp-${Date.now()}`;
  const newHospital: Hospital = {
    id: hospitalId,
    name: input.name.trim(),
    organisationId: normalizedOrgId,
    administrator: resolvedAdmin,
    adminEmail: normalizedEmail,
    createdAt: today,
    status: "pending",
  };

  hospitalStore = [newHospital, ...hospitalStore];

  const token = Math.random().toString(16).slice(2, 16).padEnd(14, "a");
  const invitation = {
    id: `inv-${Date.now()}`,
    url: `probase.uk/i/${normalizedOrgId}/${token}`,
    email: normalizedEmail,
    role: "Administrator — fixed for a first administrator",
    expiresAt: expiryDate,
  };

  return {
    success: true,
    data: {
      hospital: newHospital,
      invitation,
    },
    message: `${newHospital.name} is set up.`,
  };
}

export async function handleWithdrawInvitation(
  hospitalId: string
): Promise<ApiResponse<{ withdrawnId: string }>> {
  await simulateLatency(260);

  const exists = hospitalStore.some((h) => h.id === hospitalId);
  if (!exists) {
    throw new Error("Invitation or hospital record could not be found.");
  }

  hospitalStore = hospitalStore.filter((h) => h.id !== hospitalId);

  return {
    success: true,
    data: { withdrawnId: hospitalId },
    message: "Administrator invitation withdrawn.",
  };
}

export async function handleDeleteHospital(
  hospitalId: string
): Promise<ApiResponse<{ deletedId: string }>> {
  await simulateLatency(260);

  const existing = hospitalStore.find((h) => h.id === hospitalId);
  if (!existing) {
    throw new Error("Hospital record could not be found.");
  }

  hospitalStore = hospitalStore.filter((h) => h.id !== hospitalId);

  return {
    success: true,
    data: { deletedId: hospitalId },
    message: `${existing.name} has been deleted.`,
  };
}

export async function handleUpdateHospital(
  input: UpdateHospitalInput
): Promise<ApiResponse<Hospital>> {
  await simulateLatency(280);

  const index = hospitalStore.findIndex((h) => h.id === input.id);
  if (index === -1) {
    throw new Error("Hospital record could not be found.");
  }

  const normalizedOrgId = input.organisationId.trim().toLowerCase();
  const duplicate = hospitalStore.find(
    (h) => h.id !== input.id && h.organisationId.toLowerCase() === normalizedOrgId
  );

  if (duplicate) {
    throw new Error(
      `Taken by ${duplicate.name}, set up ${formatGridDate(duplicate.createdAt)}. Try ${normalizedOrgId}-nhs or ${normalizedOrgId}-ft.`
    );
  }

  const updated: Hospital = {
    ...hospitalStore[index],
    name: input.name.trim(),
    organisationId: normalizedOrgId,
    administrator: input.administrator.trim(),
    adminEmail: input.adminEmail.trim().toLowerCase(),
  };

  hospitalStore = hospitalStore.map((h) => (h.id === input.id ? updated : h));

  return {
    success: true,
    data: updated,
    message: `${updated.name} has been updated.`,
  };
}
