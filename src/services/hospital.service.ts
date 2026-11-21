import type {
  ApiResponse,
  CreateHospitalInput,
  CreateHospitalResult,
  Hospital,
  HospitalQueryParams,
  OrgIdCheckResult,
  PaginatedResponse,
  UpdateHospitalInput,
} from "@/types/hospital";

const BASE_URL = "/api/hospitals";

async function parseJsonResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const payload = (await response.json()) as ApiResponse<T> & { message?: string };

  if (!response.ok || !payload.success) {
    throw new Error(payload.message ?? `Request failed with status ${response.status}`);
  }

  return payload;
}

export async function fetchHospitals(
  params: HospitalQueryParams,
  signal?: AbortSignal
): Promise<PaginatedResponse<Hospital>> {
  const query = new URLSearchParams();

  if (params.search) query.set("search", params.search);
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortDirection) query.set("sortDirection", params.sortDirection);
  if (params.dateFilter) query.set("dateFilter", params.dateFilter);
  if (params.viewMode) query.set("viewMode", params.viewMode);
  if (params.page) query.set("page", String(params.page));
  if (params.pageSize) query.set("pageSize", String(params.pageSize));
  if (params.simulateError) query.set("simulateError", "true");

  const response = await fetch(`${BASE_URL}?${query.toString()}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal,
  });

  const result = await parseJsonResponse<PaginatedResponse<Hospital>>(response);
  return result.data;
}

export async function checkOrganisationId(
  organisationId: string,
  signal?: AbortSignal
): Promise<OrgIdCheckResult> {
  const query = new URLSearchParams({ checkOrgId: organisationId });
  const response = await fetch(`${BASE_URL}?${query.toString()}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal,
  });

  const result = await parseJsonResponse<OrgIdCheckResult>(response);
  return result.data;
}

export async function createHospital(
  input: CreateHospitalInput
): Promise<ApiResponse<CreateHospitalResult>> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(input),
  });

  return parseJsonResponse<CreateHospitalResult>(response);
}

export async function withdrawHospitalInvitation(
  hospitalId: string
): Promise<ApiResponse<{ withdrawnId: string; hospital: Hospital }>> {
  const query = new URLSearchParams({ id: hospitalId, action: "withdraw" });
  const response = await fetch(`${BASE_URL}?${query.toString()}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });

  return parseJsonResponse<{ withdrawnId: string; hospital: Hospital }>(
    response
  );
}

export async function deleteHospital(
  hospitalId: string
): Promise<ApiResponse<{ deletedId: string }>> {
  const query = new URLSearchParams({ id: hospitalId, action: "delete" });
  const response = await fetch(`${BASE_URL}?${query.toString()}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });

  return parseJsonResponse<{ deletedId: string }>(response);
}

export async function updateHospital(
  input: UpdateHospitalInput
): Promise<ApiResponse<Hospital>> {
  const response = await fetch(BASE_URL, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(input),
  });

  return parseJsonResponse<Hospital>(response);
}
