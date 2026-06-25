"use client";

import AuthGuard from "@/app/components/AuthGuard";
import CafeShell from "@/app/components/CafeShell";
import { formatCurrency, statusLabel, statusTone } from "@/app/components/ui";
import { CheckCircle2, Flame, RefreshCw, Soup } from "lucide-react";
import { useEffect, useState } from "react";

export default function KitchenPage() {
  return (
    <AuthGuard roles={["cashier", "admin", "developer"]}>
      {(user) => <KitchenWorkspace user={user} />}
    </AuthGuard>
  );
}

function KitchenWorkspace({ user }) {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  async function loadOrders() {
    const response = await fetch("/api/orders");
    const data = await response.json();
    setOrders(data.orders || []);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function updateStatus(id, status) {
    const response = await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || "Status gagal diubah.");
      return;
    }
    setMessage(`Pesanan #INV-250625-${String(id).padStart(3, "0")} diubah ke ${statusLabel(status)}.`);
    loadOrders();
  }

  const activeOrders = orders.filter((order) => !["paid", "cancelled"].includes(order.status));

  return (
    <CafeShell
      user={user}
      title="Dapur - Pesanan Aktif"
      subtitle="Kitchen display untuk memantau dan mengubah status pesanan"
      actions={
        <button type="button" onClick={loadOrders} className="icon-button bg-white px-4 text-[#0e1713]">
          <RefreshCw size={17} />
          <span>Refresh</span>
        </button>
      }
    >
      {message ? <p className="mb-4 rounded-lg bg-[#e3f4ea] p-4 text-sm font-black text-[#0b3b28]">{message}</p> : null}

      <section className="grid gap-4 xl:grid-cols-2">
        {activeOrders.map((order) => (
          <article key={order.id} className="cafe-card overflow-hidden">
            <div className="flex items-center justify-between gap-3 bg-[#07120d] px-5 py-4 text-white">
              <div>
                <h2 className="text-lg font-black">#INV-250625-{String(order.id).padStart(3, "0")}</h2>
                <p className="text-sm font-semibold text-white/60">Meja {order.tableNumber || "-"} - {order.items.length} Item</p>
              </div>
              <span className={`status-pill ${statusTone(order.status)}`}>{statusLabel(order.status)}</span>
            </div>
            <div className="p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {order.items.map((item) => (
                  <div key={item.id} className="rounded-lg bg-[#f7f6f1] p-3">
                    <p className="font-black">{item.quantity}x {item.menuName}</p>
                    <p className="text-sm font-bold text-[#607066]">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" onClick={() => updateStatus(order.id, "processing")} className="icon-button bg-[#fff1d8] px-4 text-[#c46600]">
                  <Flame size={17} />
                  <span>Mulai Masak</span>
                </button>
                <button type="button" onClick={() => updateStatus(order.id, "ready")} className="icon-button bg-[#e3f4ea] px-4 text-[#096b3c]">
                  <Soup size={17} />
                  <span>Siap Saji</span>
                </button>
                <button type="button" onClick={() => updateStatus(order.id, "paid")} className="icon-button bg-[#0b3b28] px-4 text-white">
                  <CheckCircle2 size={17} />
                  <span>Selesai</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {!activeOrders.length ? (
        <div className="cafe-card p-8 text-center">
          <p className="text-lg font-black">Tidak ada pesanan aktif.</p>
          <p className="mt-2 text-sm font-semibold text-[#607066]">Pesanan baru dari customer atau kasir akan muncul di sini.</p>
        </div>
      ) : null}
    </CafeShell>
  );
}
