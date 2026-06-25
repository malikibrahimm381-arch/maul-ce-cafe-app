import { NextResponse } from "next/server";
import { roles } from "@/lib/auth";
import { jsonError, requireRoles } from "@/lib/http";
import { deleteOrder, getOrderById, updateOrder } from "@/lib/repository";

export const runtime = "nodejs";

export async function GET(request, { params }) {
  const auth = requireRoles(request, [roles.cashier, roles.admin, roles.developer]);
  if (auth.response) return auth.response;

  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) return jsonError("Order tidak ditemukan.", 404);
  return NextResponse.json({ order });
}

export async function PUT(request, { params }) {
  const auth = requireRoles(request, [roles.cashier, roles.admin, roles.developer]);
  if (auth.response) return auth.response;

  const { id } = await params;
  const body = await request.json();
  const order = await updateOrder(id, body);
  if (!order) return jsonError("Order tidak ditemukan.", 404);
  return NextResponse.json({ order });
}

export async function DELETE(request, { params }) {
  const auth = requireRoles(request, [roles.admin, roles.developer]);
  if (auth.response) return auth.response;

  const { id } = await params;
  const result = await deleteOrder(id);
  return NextResponse.json(result);
}
