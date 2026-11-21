"use client";

import * as React from "react";
import { CheckCircle2, X } from "lucide-react";
import { HospitalDetailsDialog } from "@/components/hospitals/HospitalDetailsDialog";
import { HospitalPagination } from "@/components/hospitals/HospitalPagination";
import { HospitalTable } from "@/components/hospitals/HospitalTable";
import { HospitalToolbar } from "@/components/hospitals/HospitalToolbar";
import { SetupHospitalDialog } from "@/components/hospitals/SetupHospitalDialog";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { useHospitals } from "@/hooks/useHospitals";
import { downloadCsv, formatGridDate } from "@/lib/utils";
import type {
  CreateHospitalInput,
  CreateHospitalResult,
  Hospital,
} from "@/types/hospital";

interface SetupBannerState {
  hospitalName: string;
  adminEmail: string;
}

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
    addHospital,
    withdrawInvitation,
    editHospital,
  } = useHospitals();

  const [setupOpen, setSetupOpen] = React.useState(false);
  const [editingHospital, setEditingHospital] = React.useState<Hospital | null>(
    null
  );
  const [detailsHospital, setDetailsHospital] =
    React.useState<Hospital | null>(null);
  const [setupBanner, setSetupBanner] =
    React.useState<SetupBannerState | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = React.useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  React.useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

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
    return res.data;
  };

  const handleCompleteSetup = (result: CreateHospitalResult) => {
    setSetupBanner({
      hospitalName: result.hospital.name,
      adminEmail: result.invitation.email,
    });
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
    const res = await withdrawInvitation(hospital.id);
    setSetupBanner(null);
    showToast(res.message ?? `Invitation withdrawn for ${hospital.name}.`);
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
      formatGridDate(h.createdAt),
    ]);

    downloadCsv("probase-hospitals.csv", headers, rows);
    showToast(
      `Exported ${dataset.length} ${
        dataset.length === 1 ? "hospital" : "hospitals"
      } to CSV.`
    );
  };

  const breadcrumbLabel =
    viewMode === "pending"
      ? "Pending invitations"
      : viewMode === "all"
      ? "All hospitals"
      : "Active hospitals";

  return (
    <AppShell
      globalSearch={search}
      onGlobalSearchChange={setSearch}
      currentBreadcrumbLabel={breadcrumbLabel}
    >
      <div className="flex min-h-[calc(100vh-64px)] flex-1 flex-col gap-[16px] bg-[var(--color-bg)]">
        {/* PA 13 · Set Up Banner */}
        {setupBanner && (
          <div className="px-[16px] pt-[16px]">
            <div
              role="status"
              className="flex flex-wrap items-center gap-[12px] rounded-[6px] border border-white/12 bg-[var(--color-surface-overlay)] px-[16px] py-[12px]"
            >
              <CheckCircle2
                strokeWidth={1.6}
                className="h-[18px] w-[18px] shrink-0 text-white"
                aria-hidden="true"
              />
              <p className="min-w-0 flex-1 text-[14px] font-normal leading-[20px] text-white">
                {setupBanner.hospitalName} is set up. It joins this list once{" "}
                {setupBanner.adminEmail} accepts the invitation — until then it
                lives under Invitations.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("pending")}
              >
                View in Invitations
              </Button>
            </div>
          </div>
        )}

        {/* PA 09 / PA 13 · Table — Data Grid / Hospitals */}
        <div
          className={`flex flex-1 flex-col border-b border-white/12 bg-[var(--color-bg)] ${
            setupBanner ? "border-t" : ""
          }`}
        >
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
            hasUserSorted={hasUserSorted}
            pageSize={pageSize}
            onSort={(field) => handleSort(field)}
            onToggleSelect={toggleSelectRow}
            onToggleSelectAll={toggleSelectAllOnPage}
            onViewDetails={setDetailsHospital}
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
      </div>

      <SetupHospitalDialog
        open={setupOpen}
        onClose={() => {
          setSetupOpen(false);
          setEditingHospital(null);
        }}
        editingHospital={editingHospital}
        onCreateHospital={handleCreateHospital}
        onUpdateHospital={handleUpdateHospital}
        onWithdrawInvitation={handleWithdrawInvitation}
        onCompleteSetup={handleCompleteSetup}
      />

      <HospitalDetailsDialog
        hospital={detailsHospital}
        onClose={() => setDetailsHospital(null)}
        onEdit={handleOpenEdit}
      />

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-[8px] border border-white/12 bg-[#1f1f1f] px-3.5 py-2.5 text-[13px] text-white shadow-[0px_8px_24px_0px_rgba(0,0,0,0.45)]"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#1c75b3]" />
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            aria-label="Dismiss notification"
            className="ml-1 rounded p-0.5 text-[#a0a0a0] hover:text-white cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </AppShell>
  );
}
