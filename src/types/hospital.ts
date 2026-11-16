export type HospitalStatus = "active" | "pending" | "setup_withdrawn";

export type InvitationStatus = "pending" | "accepted" | "withdrawn";

export type HospitalSortField =
  | "name"
  | "organisationId"
  | "administrator"
  | "adminEmail"
  | "createdAt";

export type SortDirection = "asc" | "desc";

export type DateRangeFilter = "all" | "last_7_days" | "last_30_days" | "nov_2026" | "oct_2026";

export type HospitalViewMode = "active" | "all" | "pending";

export interface Hospital {
  id: string;
  name: string;
  organisationId: string;
  administrator: string;
  adminEmail: string;
  createdAt: string; // ISO date string YYYY-MM-DD
  status: HospitalStatus;
  region?: string;
  invitationStatus?: InvitationStatus;
  withdrawnAt?: string;
  deletedAt?: string;
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
  hospitalId: string;
  url: string;
  email: string;
  role: "Administrator";
  status: InvitationStatus;
  expiresAt: string; // ISO date string YYYY-MM-DD
  withdrawnAt?: string;
}

export interface CreateHospitalResult {
  hospital: Hospital;
  invitation: HospitalInvitation;
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
