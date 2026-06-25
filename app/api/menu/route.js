import { NextResponse } from "next/server";
import { roles } from "@/lib/auth";
import { jsonError, requireRoles } from "@/lib/http";
import { createMenuItem, getMenuItems } from "@/lib/repository";

export const runtime = "nodejs";

export async function GET(request) {
  const activeOnly = request.nextUrl.searchParams.get("active") === "1";
  const items = await getMenuItems({ activeOnly });
  return NextResponse.json({ items });
}

export async function POST(request) {
  const auth = requireRoles(request, [roles.admin, roles.developer]);
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const item = await createMenuItem(body);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    return jsonError(error.message, 400);
  }
}
