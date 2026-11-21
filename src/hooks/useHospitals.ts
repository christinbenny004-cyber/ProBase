"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  createHospital as createHospitalApi,
  deleteHospital as deleteHospitalApi,
  fetchHospitals,
  updateHospital as updateHospitalApi,
  withdrawHospitalInvitation as withdrawHospitalInvitationApi,
} from "@/services/hospital.service";
import type {
  CreateHospitalInput,
  DateRangeFilter,
  Hospital,
  HospitalSortField,
  HospitalViewMode,
  SortDirection,
  UpdateHospitalInput,
} from "@/types/hospital";

export interface UseHospitalsState {
  hospitals: Hospital[];
  allMatchingHospitals: Hospital[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  search: string;
  sortBy: HospitalSortField;
  sortDirection: SortDirection;
  dateFilter: DateRangeFilter;
  viewMode: HospitalViewMode;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  selectedIds: string[];
}

export function useHospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [allMatchingHospitals, setAllMatchingHospitals] = useState<Hospital[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearchState] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<HospitalSortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [hasUserSorted, setHasUserSorted] = useState(false);
  const [dateFilter, setDateFilterState] = useState<DateRangeFilter>("all");
  const [viewMode, setViewModeState] = useState<HospitalViewMode>("active");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(50);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [refreshTick, setRefreshTick] = useState(0);
  const [simulateErrorNext, setSimulateErrorNext] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  // Debounce search input slightly for smooth typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 180);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchHospitals(
          {
            search: debouncedSearch,
            sortBy,
            sortDirection,
            dateFilter,
            viewMode,
            page,
            pageSize,
            simulateError: simulateErrorNext,
          },
          controller.signal
        );

        setHospitals(data.items);
        setAllMatchingHospitals(data.allMatchingItems);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        if (data.page !== page) {
          setPage(data.page);
        }
        setSimulateErrorNext(false);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        setError(
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while loading hospitals."
        );
        setSimulateErrorNext(false);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    }

    load();

    return () => {
      controller.abort();
    };
  }, [
    debouncedSearch,
    sortBy,
    sortDirection,
    dateFilter,
    viewMode,
    page,
    pageSize,
    refreshTick,
    simulateErrorNext,
  ]);

  const setSearch = useCallback((value: string) => {
    setSearchState(value);
    setPage(1);
    setSelectedIds([]);
  }, []);

  const setDateFilter = useCallback((value: DateRangeFilter) => {
    setDateFilterState(value);
    setPage(1);
    setSelectedIds([]);
  }, []);

  const setViewMode = useCallback((value: HospitalViewMode) => {
    setViewModeState(value);
    setPage(1);
    setSelectedIds([]);
  }, []);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setPage(1);
  }, []);

  const handleSort = useCallback(
    (field: HospitalSortField, explicitDirection?: SortDirection) => {
      setHasUserSorted(true);
      if (explicitDirection) {
        setSortBy(field);
        setSortDirection(explicitDirection);
      } else if (sortBy === field) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortBy(field);
        setSortDirection(field === "createdAt" ? "desc" : "asc");
      }
      setPage(1);
    },
    [sortBy]
  );

  const clearFilters = useCallback(() => {
    setSearchState("");
    setDebouncedSearch("");
    setDateFilterState("all");
    setViewModeState("active");
    setPage(1);
    setSelectedIds([]);
  }, []);

  const refresh = useCallback((withSimulatedError = false) => {
    setIsRefreshing(true);
    setSimulateErrorNext(withSimulatedError);
    setRefreshTick((t) => t + 1);
  }, []);

  const toggleSelectRow = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const toggleSelectAllOnPage = useCallback(() => {
    const pageIds = hospitals.map((h) => h.id);
    const allSelected =
      pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  }, [hospitals, selectedIds]);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const addHospital = useCallback(async (input: CreateHospitalInput) => {
    const result = await createHospitalApi(input);
    setPage(1);
    setRefreshTick((t) => t + 1);
    return result;
  }, []);

  const withdrawInvitation = useCallback(async (hospitalId: string) => {
    const result = await withdrawHospitalInvitationApi(hospitalId);
    setSelectedIds((prev) => prev.filter((id) => id !== hospitalId));
    setRefreshTick((t) => t + 1);
    return result;
  }, []);

  const deleteHospital = useCallback(async (hospitalId: string) => {
    const result = await deleteHospitalApi(hospitalId);
    setSelectedIds((prev) => prev.filter((id) => id !== hospitalId));
    setRefreshTick((t) => t + 1);
    return result;
  }, []);

  const editHospital = useCallback(async (input: UpdateHospitalInput) => {
    const result = await updateHospitalApi(input);
    setRefreshTick((t) => t + 1);
    return result;
  }, []);

  return {
    hospitals,
    allMatchingHospitals,
    total,
    page,
    pageSize,
    totalPages,
    search,
    sortBy,
    sortDirection,
    hasUserSorted,
    dateFilter,
    viewMode,
    isLoading,
    isRefreshing,
    error,
    selectedIds,
    setPage,
    setPageSize,
    setSearch,
    setDateFilter,
    setViewMode,
    handleSort,
    clearFilters,
    refresh,
    toggleSelectRow,
    toggleSelectAllOnPage,
    clearSelection,
    addHospital,
    withdrawInvitation,
    deleteHospital,
    editHospital,
  };
}
