export type HospitalStatus = "active" | "pending";

export type HospitalSortField =
  | "name"
  | "organisationId"
  | "administrator"
  | "adminEmail"
  | "createdAt";

export type SortDirection = "asc" | "desc";

export type DateRangeFilter =
  | "all"
  | "may_jun_2026"
  | "jul_aug_2026"
  | "sep_2026";

export type HospitalViewMode = "active" | "all" | "pending";

export interface Hospital {
  id: string;
  name: string;
  organisationId: string;
  administrator: string;
  adminEmail: string;
  createdAt: string; // ISO date string YYYY-MM-DD
  status: HospitalStatus;
}

export interface HospitalQueryParams {
  search?: string;
  sortBy?: HospitalSortField;
  sortDirection?: SortDirection;
  dateFilter?: DateRangeFilter;
  viewMode?: HospitalViewMode;
  page?: number;
  pageSize?: number;
  simulateError?: boolean;
}

export interface CreateHospitalInput {
  name: string;
  organisationId: string;
  adminEmail: string;
  administrator?: string;
}

export interface UpdateHospitalInput extends CreateHospitalInput {
  id: string;
  administrator: string;
}

export interface HospitalInvitation {
  id: string;
  url: string;
  email: string;
  role: string;
  expiresAt: string; // ISO date string YYYY-MM-DD
}

export interface CreateHospitalResult {
  hospital: Hospital;
  invitation: HospitalInvitation;
}

export interface OrgIdCheckResult {
  available: boolean;
  organisationId: string;
  conflict?: {
    name: string;
    createdAt: string;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  allMatchingItems: T[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
