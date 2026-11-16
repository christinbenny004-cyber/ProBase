import { NextRequest, NextResponse } from "next/server";
import {
  handleCheckOrganisationId,
  handleCreateHospital,
  handleDeleteHospital,
  handleGetHospitals,
  handleUpdateHospital,
  handleWithdrawInvitation,
} from "@/mocks/hospital.handlers";
import type {
  DateRangeFilter,
  HospitalSortField,
  HospitalViewMode,
  SortDirection,
} from "@/types/hospital";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const checkOrgId = searchParams.get("checkOrgId");

    if (checkOrgId !== null) {
      const checkResult = await handleCheckOrganisationId(checkOrgId);
      return NextResponse.json(checkResult, { status: 200 });
    }

    const search = searchParams.get("search") ?? "";
    const sortBy = (searchParams.get("sortBy") as HospitalSortField) ?? "createdAt";
    const sortDirection =
      (searchParams.get("sortDirection") as SortDirection) ?? "desc";
    const dateFilter =
      (searchParams.get("dateFilter") as DateRangeFilter) ?? "all";
    const viewMode =
      (searchParams.get("viewMode") as HospitalViewMode) ?? "active";
    const page = Number.parseInt(searchParams.get("page") ?? "1", 10);
    const pageSize = Number.parseInt(searchParams.get("pageSize") ?? "10", 10);
    const simulateError = searchParams.get("simulateError") === "true";

    const response = await handleGetHospitals({
      search,
      sortBy,
      sortDirection,
      dateFilter,
      viewMode,
      page: Number.isNaN(page) ? 1 : page,
      pageSize: Number.isNaN(pageSize) ? 10 : pageSize,
      simulateError,
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load hospitals.";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await handleCreateHospital({
      name: String(body.name ?? ""),
      organisationId: String(body.organisationId ?? ""),
      adminEmail: String(body.adminEmail ?? ""),
      administrator:
        typeof body.administrator === "string" ? body.administrator : undefined,
    });
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create hospital.";
    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await handleUpdateHospital({
      id: String(body.id ?? ""),
      name: String(body.name ?? ""),
      organisationId: String(body.organisationId ?? ""),
      administrator: String(body.administrator ?? ""),
      adminEmail: String(body.adminEmail ?? ""),
    });
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update hospital.";
    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") ?? "";
    const action = searchParams.get("action") ?? "withdraw";

    if (action === "delete") {
      const response = await handleDeleteHospital(id);
      return NextResponse.json(response, { status: 200 });
    }

    const response = await handleWithdrawInvitation(id);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to process hospital request.";
    return NextResponse.json(
      { success: false, message },
      { status: 400 }
    );
  }
}
