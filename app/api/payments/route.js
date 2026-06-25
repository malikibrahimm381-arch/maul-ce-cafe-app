import { NextResponse } from "next/server";
import { roles } from "@/lib/auth";
import { jsonError, requireRoles } from "@/lib/http";
import { createPayment, getPayments } from "@/lib/repository";

export const runtime = "nodejs";

export async function GET(request) {
  const auth = requireRoles(request, [roles.cashier, roles.admin, roles.developer]);
  if (auth.response) return auth.response;

  const from = request.nextUrl.searchParams.get("from") || "";
  const to = request.nextUrl.searchParams.get("to") || "";
  const payments = await getPayments({ from, to });
  return NextResponse.json({ payments });
}

export async function POST(request) {
  const auth = requireRoles(request, [roles.cashier, roles.admin, roles.developer]);
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const payment = await createPayment(body, auth.session);
    return NextResponse.json({ payment }, { status: 201 });
  } catch (error) {
    return jsonError(error.message, 400);
  }
}
