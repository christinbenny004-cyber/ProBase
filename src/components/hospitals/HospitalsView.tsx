"use client";

import * as React from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { DeleteHospitalDialog } from "@/components/hospitals/DeleteHospitalDialog";
import { HospitalDetailsDialog } from "@/components/hospitals/HospitalDetailsDialog";
import { HospitalPageHeader } from "@/components/hospitals/HospitalPageHeader";
import { HospitalPagination } from "@/components/hospitals/HospitalPagination";
import { HospitalTable } from "@/components/hospitals/HospitalTable";
import { HospitalToolbar } from "@/components/hospitals/HospitalToolbar";
import { SetupHospitalDialog } from "@/components/hospitals/SetupHospitalDialog";
import { WithdrawHospitalDialog } from "@/components/hospitals/WithdrawHospitalDialog";
import { AppShell } from "@/components/layout/AppShell";
import { useHospitals } from "@/hooks/useHospitals";
import { downloadCsv, formatDisplayDate } from "@/lib/utils";
import type { CreateHospitalInput, Hospital } from "@/types/hospital";

export function HospitalsView() {
  const {
    hospitals,
    allMatchingHospitals,
    total,
    page,
    pageSize,
    totalPages,
    search,
    sortBy,
    sortDirection,
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
    addHospital,
    withdrawInvitation,
    deleteHospital,
    editHospital,
  } = useHospitals();

  const [setupOpen, setSetupOpen] = React.useState(false);
  const [editingHospital, setEditingHospital] = React.useState<Hospital | null>(
    null
  );
  const [detailsHospital, setDetailsHospital] =
    React.useState<Hospital | null>(null);
  const [withdrawTarget, setWithdrawTarget] =
    React.useState<Hospital | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Hospital | null>(null);
  const [toast, setToast] = React.useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = React.useCallback(
    (message: string, type: "success" | "error" = "success") => {
      setToast({ message, type });
    },
    []
  );

  React.useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const suggestedOrgId = React.useMemo(() => {
    const source = allMatchingHospitals.length > 0 ? allMatchingHospitals : hospitals;
    const maxNum = source.reduce((max, h) => {
      const match = /^ORG-(\d+)$/i.exec(h.organisationId);
      if (!match) return max;
      const parsed = Number.parseInt(match[1], 10);
      return Number.isNaN(parsed) ? max : Math.max(max, parsed);
    }, 20);
    return `ORG-${String(maxNum + 1).padStart(3, "0")}`;
  }, [allMatchingHospitals, hospitals]);

  const handleOpenCreate = () => {
    setEditingHospital(null);
    setSetupOpen(true);
  };

  const handleOpenEdit = (hospital: Hospital) => {
    setEditingHospital(hospital);
    setSetupOpen(true);
  };

  const handleCreateHospital = async (values: CreateHospitalInput) => {
    const res = await addHospital(values);
    showToast(res.message ?? `${values.name} created.`);
    return res.data;
  };

  const handleUpdateHospital = async (
    id: string,
    values: CreateHospitalInput
  ) => {
    const res = await editHospital({
      id,
      name: values.name,
      organisationId: values.organisationId,
      adminEmail: values.adminEmail,
      administrator:
        values.administrator ?? editingHospital?.administrator ?? "",
    });
    showToast(res.message ?? `${values.name} updated.`);
  };

  const handleWithdrawInvitation = async (hospital: Hospital) => {
    try {
      const res = await withdrawInvitation(hospital.id);
      showToast(
        res.message ?? `Setup withdrawn for ${hospital.name}.`,
        "success"
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : `Failed to withdraw setup for ${hospital.name}.`;
      showToast(message, "error");
      throw err;
    }
  };

  const handleDeleteHospital = async (hospital: Hospital) => {
    try {
      const res = await deleteHospital(hospital.id);
      showToast(
        res.message ?? `${hospital.name} has been deleted.`,
        "success"
      );
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : `Failed to delete ${hospital.name}.`;
      showToast(message, "error");
      throw err;
    }
  };

  const handleCopyOrgId = async (orgId: string) => {
    try {
      await navigator.clipboard.writeText(orgId);
      showToast(`Copied ${orgId} to clipboard.`);
    } catch {
      showToast(`Organisation ID: ${orgId}`);
    }
  };

  const handleExportCsv = () => {
    const dataset =
      selectedIds.length > 0
        ? allMatchingHospitals.filter((h) => selectedIds.includes(h.id))
        : allMatchingHospitals;

    if (dataset.length === 0) return;

    const headers = [
      "Hospital",
      "Organisation ID",
      "Administrator",
      "Admin Email",
      "Created",
    ];
    const rows = dataset.map((h) => [
      h.name,
      h.organisationId,
      h.administrator,
      h.adminEmail,
      formatDisplayDate(h.createdAt),
    ]);

    downloadCsv("probase-hospitals.csv", headers, rows);
    showToast(
      `Exported ${dataset.length} ${
        dataset.length === 1 ? "hospital" : "hospitals"
      } to CSV.`
    );
  };

  return (
    <AppShell globalSearch={search} onGlobalSearchChange={setSearch}>
      <div className="mx-auto w-full max-w-[1480px]">
        <HospitalPageHeader />

        <HospitalToolbar
          search={search}
          onSearchChange={setSearch}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortChange={handleSort}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onClearFilters={clearFilters}
          onRefresh={() => refresh(false)}
          onSimulateError={() => refresh(true)}
          onExportCsv={handleExportCsv}
          onOpenSetupDialog={handleOpenCreate}
          isRefreshing={isRefreshing}
        />

        <HospitalTable
          hospitals={hospitals}
          isLoading={isLoading}
          error={error}
          selectedIds={selectedIds}
          sortBy={sortBy}
          sortDirection={sortDirection}
          pageSize={pageSize}
          onSort={(field) => handleSort(field)}
          onToggleSelect={toggleSelectRow}
          onToggleSelectAll={toggleSelectAllOnPage}
          onViewDetails={setDetailsHospital}
          onEdit={handleOpenEdit}
          onCopyOrgId={handleCopyOrgId}
          onWithdrawSetup={setWithdrawTarget}
          onDelete={setDeleteTarget}
          onRetry={() => refresh(false)}
          onClearFilters={clearFilters}
        />

        {!error && (
          <HospitalPagination
            page={page}
            totalPages={totalPages}
            pageSize={pageSize}
            total={total}
            selectedCount={selectedIds.length}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            onExportCsv={handleExportCsv}
          />
        )}
      </div>

      <SetupHospitalDialog
        open={setupOpen}
        onClose={() => {
          setSetupOpen(false);
          setEditingHospital(null);
        }}
        editingHospital={editingHospital}
        suggestedOrgId={suggestedOrgId}
        onCreateHospital={handleCreateHospital}
        onUpdateHospital={handleUpdateHospital}
        onWithdrawInvitation={handleWithdrawInvitation}
      />

      <HospitalDetailsDialog
        hospital={detailsHospital}
        onClose={() => setDetailsHospital(null)}
        onEdit={handleOpenEdit}
      />

      <WithdrawHospitalDialog
        key={`withdraw-${withdrawTarget?.id ?? "none"}`}
        hospital={withdrawTarget}
        onClose={() => setWithdrawTarget(null)}
        onConfirmWithdraw={handleWithdrawInvitation}
      />

      <DeleteHospitalDialog
        key={`delete-${deleteTarget?.id ?? "none"}`}
        hospital={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirmDelete={handleDeleteHospital}
      />

      {toast && (
        <div
          role={toast.type === "error" ? "alert" : "status"}
          aria-live={toast.type === "error" ? "assertive" : "polite"}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-dropdown)] px-3.5 py-2.5 text-[13px] text-[var(--text-primary)] shadow-xl shadow-black/15 dark:shadow-black/60"
        >
          {toast.type === "error" ? (
            <AlertCircle className="h-4 w-4 shrink-0 text-[#DC2626] dark:text-[#F87171]" />
          ) : (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#1686D9]" />
          )}
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Dismiss notification"
            className="ml-1 rounded p-0.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </AppShell>
  );
}
