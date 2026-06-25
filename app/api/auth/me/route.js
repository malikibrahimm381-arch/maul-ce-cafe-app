import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(request) {
  return NextResponse.json({ user: getSessionFromRequest(request) });
}
