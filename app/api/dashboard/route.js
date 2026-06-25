import { NextResponse } from "next/server";
import { roles } from "@/lib/auth";
import { requireRoles } from "@/lib/http";
import { getDashboardData } from "@/lib/repository";

export const runtime = "nodejs";

export async function GET(request) {
  const auth = requireRoles(request, [roles.cashier, roles.admin, roles.developer]);
  if (auth.response) return auth.response;

  const from = request.nextUrl.searchParams.get("from") || "";
  const to = request.nextUrl.searchParams.get("to") || "";
  const dashboard = await getDashboardData({ from, to });
  return NextResponse.json(dashboard);
}
