import { INITIAL_HOSPITALS, INITIAL_INVITATIONS } from "@/mocks/hospital.data";
import type {
  ApiResponse,
  CreateHospitalInput,
  CreateHospitalResult,
  DateRangeFilter,
  Hospital,
  HospitalInvitation,
  HospitalQueryParams,
  HospitalSortField,
  PaginatedResponse,
  SortDirection,
  UpdateHospitalInput,
} from "@/types/hospital";

// In-memory mock stores for the session
let hospitalStore: Hospital[] = [...INITIAL_HOSPITALS];
let invitationStore: HospitalInvitation[] = [...INITIAL_INVITATIONS];

const REFERENCE_DATE = new Date("2026-11-16T00:00:00Z");

export function simulateLatency(ms = 280): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function matchesDateFilter(createdAt: string, filter: DateRangeFilter): boolean {
  if (filter === "all") return true;

  const date = new Date(`${createdAt}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return true;

  if (filter === "nov_2026") {
    return date.getUTCFullYear() === 2026 && date.getUTCMonth() === 10;
  }

  if (filter === "oct_2026") {
    return date.getUTCFullYear() === 2026 && date.getUTCMonth() === 9;
  }

  const diffDays =
    (REFERENCE_DATE.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

  if (filter === "last_7_days") {
    return diffDays >= 0 && diffDays <= 7;
  }

  if (filter === "last_30_days") {
    return diffDays >= 0 && diffDays <= 30;
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
    return a.organisationId.localeCompare(b.organisationId) * multiplier;
  }

  const valA = a[sortBy].toLowerCase();
  const valB = b[sortBy].toLowerCase();
  return valA.localeCompare(valB, undefined, { numeric: true }) * multiplier;
}

export async function handleGetHospitals(
  params: HospitalQueryParams = {}
): Promise<ApiResponse<PaginatedResponse<Hospital>>> {
  await simulateLatency(260);

  if (params.simulateError) {
    throw new Error(
      "Simulated network error: Unable to reach the ProBase hospital directory."
    );
  }

  const {
    search = "",
    sortBy = "createdAt",
    sortDirection = "desc",
    dateFilter = "all",
    viewMode = "active",
    page = 1,
    pageSize = 10,
  } = params;

  const normalizedQuery = search.trim().toLowerCase();

  const filtered = hospitalStore.filter((hospital) => {
    if (hospital.deletedAt) {
      return false;
    }

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
): Promise<ApiResponse<{ available: boolean; organisationId: string }>> {
  await simulateLatency(120);
  const normalizedOrgId = orgId.trim().toUpperCase();
  const exists = hospitalStore.some(
    (h) => h.organisationId.toUpperCase() === normalizedOrgId
  );

  return {
    success: true,
    data: {
      available: !exists,
      organisationId: normalizedOrgId,
    },
  };
}

export async function handleCreateHospital(
  input: CreateHospitalInput
): Promise<ApiResponse<CreateHospitalResult>> {
  await simulateLatency(350);

  const normalizedOrgId = input.organisationId.trim().toUpperCase();
  const duplicate = hospitalStore.some(
    (h) => h.organisationId.toUpperCase() === normalizedOrgId
  );

  if (duplicate) {
    throw new Error(
      `Organisation ID "${normalizedOrgId}" is already in use.`
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
    status: "active",
    invitationStatus: "pending",
  };

  hospitalStore = [newHospital, ...hospitalStore];

  const token = Math.random().toString(36).slice(2, 10);
  const invitation: HospitalInvitation = {
    id: `inv-${Date.now()}`,
    hospitalId,
    url: `https://app.probase.health/invite/${normalizedOrgId.toLowerCase()}-${token}`,
    email: normalizedEmail,
    role: "Administrator",
    status: "pending",
    expiresAt: expiryDate,
  };

  invitationStore = [invitation, ...invitationStore];

  return {
    success: true,
    data: {
      hospital: newHospital,
      invitation,
    },
    message: `Tenant "${newHospital.name}" created and invitation sent to ${newHospital.adminEmail}.`,
  };
}

export async function handleWithdrawInvitation(
  hospitalId: string
): Promise<ApiResponse<{ withdrawnId: string; hospital: Hospital }>> {
  await simulateLatency(280);

  const hospital = hospitalStore.find(
    (h) => h.id === hospitalId && !h.deletedAt
  );
  if (!hospital) {
    throw new Error("Invitation or hospital record could not be found.");
  }

  if (hospital.invitationStatus !== "pending") {
    throw new Error(
      "Setup can only be withdrawn while the initial administrator invitation is pending."
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const updatedHospital: Hospital = {
    ...hospital,
    status: "setup_withdrawn",
    invitationStatus: "withdrawn",
    withdrawnAt: today,
  };

  hospitalStore = hospitalStore.map((h) =>
    h.id === hospitalId ? updatedHospital : h
  );

  invitationStore = invitationStore.map((inv) =>
    inv.hospitalId === hospitalId && inv.status === "pending"
      ? { ...inv, status: "withdrawn", withdrawnAt: today }
      : inv
  );

  return {
    success: true,
    data: { withdrawnId: hospitalId, hospital: updatedHospital },
    message: `Setup withdrawn for ${hospital.name}. Pending invitation has been revoked.`,
  };
}

export async function handleDeleteHospital(
  hospitalId: string
): Promise<ApiResponse<{ deletedId: string }>> {
  await simulateLatency(300);

  const hospital = hospitalStore.find(
    (h) => h.id === hospitalId && !h.deletedAt
  );
  if (!hospital) {
    throw new Error("Hospital record could not be found.");
  }

  const today = new Date().toISOString().slice(0, 10);

  hospitalStore = hospitalStore.map((h) =>
    h.id === hospitalId
      ? {
          ...h,
          deletedAt: today,
          invitationStatus:
            h.invitationStatus === "pending" ? "withdrawn" : h.invitationStatus,
          withdrawnAt:
            h.invitationStatus === "pending" ? today : h.withdrawnAt,
        }
      : h
  );

  invitationStore = invitationStore.map((inv) =>
    inv.hospitalId === hospitalId && inv.status === "pending"
      ? { ...inv, status: "withdrawn", withdrawnAt: today }
      : inv
  );

  return {
    success: true,
    data: { deletedId: hospitalId },
    message: `${hospital.name} (${hospital.organisationId}) has been deleted from active platform records.`,
  };
}

export async function handleUpdateHospital(
  input: UpdateHospitalInput
): Promise<ApiResponse<Hospital>> {
  await simulateLatency(300);

  const index = hospitalStore.findIndex((h) => h.id === input.id);
  if (index === -1) {
    throw new Error("Hospital record could not be found.");
  }

  const normalizedOrgId = input.organisationId.trim().toUpperCase();
  const duplicate = hospitalStore.some(
    (h) => h.id !== input.id && h.organisationId.toUpperCase() === normalizedOrgId
  );

  if (duplicate) {
    throw new Error(
      `Organisation ID "${normalizedOrgId}" is already assigned to another hospital.`
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

export function getNextSuggestedOrgId(): string {
  const maxNum = hospitalStore.reduce((max, h) => {
    const match = /^ORG-(\d+)$/i.exec(h.organisationId);
    if (!match) return max;
    const num = Number.parseInt(match[1], 10);
    return Number.isNaN(num) ? max : Math.max(max, num);
  }, 0);

  return `ORG-${String(maxNum + 1).padStart(3, "0")}`;
}
