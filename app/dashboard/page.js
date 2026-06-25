"use client";

import AuthGuard from "@/app/components/AuthGuard";
import Header from "@/app/components/Header";
import { formatCurrency } from "@/app/components/ui";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarDays, CircleDollarSign, Clock3, Database, ReceiptText, TrendingUp } from "lucide-react";

const Flatpickr = dynamic(() => import("react-flatpickr"), { ssr: false });

function formatDate(date) {
  const value = new Date(date);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function defaultRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 6);
  return [start, end];
}

export default function DashboardPage() {
  return (
    <>
      <Header />
      <AuthGuard roles={["cashier", "admin", "developer"]}>
        {() => <DashboardWorkspace />}
      </AuthGuard>
    </>
  );
}

function DashboardWorkspace() {
  const [dates, setDates] = useState(defaultRange);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const from = dates[0] ? formatDate(dates[0]) : "";
  const to = dates[1] ? formatDate(dates[1]) : from;

  useEffect(() => {
    if (!from || !to) return;

    setLoading(true);
    fetch(`/api/dashboard?from=${from}&to=${to}`)
      .then((response) => response.json())
      .then((data) => setDashboard(data))
      .finally(() => setLoading(false));
  }, [from, to]);

  const cards = useMemo(() => {
    const totals = dashboard?.totals || {};
    return [
      { label: "Order", value: totals.orders || 0, icon: ReceiptText, tone: "bg-[#e4f0ec] text-[#2f6f66]" },
      { label: "Pendapatan", value: formatCurrency(totals.revenue), icon: CircleDollarSign, tone: "bg-[#f6ead7] text-[#6b4a1f]" },
      { label: "Rata-rata", value: formatCurrency(totals.averageOrder), icon: TrendingUp, tone: "bg-[#e4edf5] text-[#285d82]" },
      { label: "Belum Lunas", value: totals.openOrders || 0, icon: Clock3, tone: "bg-[#f2d7d2] text-[#7c2f25]" }
    ];
  }, [dashboard]);

  const series = dashboard?.series || [];

  return (
    <main className="app-shell py-7">
      <section className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#253431]">Dashboard</h1>
          <p className="mt-1 text-sm font-semibold text-[#69736e]">Order harian, pendapatan, dan transaksi terbaru.</p>
        </div>
        <label className="soft-panel flex min-h-12 items-center gap-2 rounded-lg px-3">
          <CalendarDays size={18} className="text-[#2f6f66]" />
          <Flatpickr
            value={dates}
            onChange={(value) => setDates(value.length === 1 ? [value[0], value[0]] : value)}
            options={{ mode: "range", dateFormat: "Y-m-d" }}
            className="w-56 bg-transparent text-sm font-bold outline-none"
          />
        </label>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.label} className="soft-panel animate__animated animate__fadeInUp rounded-lg p-5">
              <div className={`mb-4 grid size-12 place-items-center rounded-lg ${card.tone}`}>
                <Icon size={22} />
              </div>
              <p className="text-sm font-bold text-[#69736e]">{card.label}</p>
              <h2 className="mt-1 break-words text-2xl font-black text-[#253431]">{loading ? "..." : card.value}</h2>
            </article>
          );
        })}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <article className="soft-panel rounded-lg p-5">
          <h2 className="mb-4 text-xl font-black text-[#253431]">Grafik Order Harian</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d9d2c7" />
                <XAxis dataKey="label" tick={{ fill: "#69736e", fontSize: 12 }} />
                <YAxis tick={{ fill: "#69736e", fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="orders" fill="#2f6f66" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="soft-panel rounded-lg p-5">
          <h2 className="mb-4 text-xl font-black text-[#253431]">Grafik Pendapatan</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d9d2c7" />
                <XAxis dataKey="label" tick={{ fill: "#69736e", fontSize: 12 }} />
                <YAxis tick={{ fill: "#69736e", fontSize: 12 }} tickFormatter={(value) => `${Math.round(value / 1000)}k`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line type="monotone" dataKey="revenue" stroke="#d56552" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <article className="soft-panel rounded-lg p-5">
          <h2 className="mb-4 text-xl font-black text-[#253431]">Order Terbaru</h2>
          <div className="space-y-3">
            {(dashboard?.recentOrders || []).map((order) => (
              <div key={order.id} className="grid gap-3 rounded-lg bg-white/76 p-3 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <p className="font-black text-[#253431]">#{order.id} - {order.customerName}</p>
                  <p className="text-sm font-semibold text-[#69736e]">
                    {order.orderType === "dine_in" ? `Dine In ${order.tableNumber || ""}` : "Take Away"} - {order.items.length} item
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="font-black text-[#6b4a1f]">{formatCurrency(order.subtotal)}</p>
                  <span className="rounded-md bg-[#e4f0ec] px-2 py-1 text-xs font-black text-[#2f6f66]">{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="soft-panel rounded-lg p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-[#253431]">
            <Database size={21} />
            Database
          </h2>
          <div className={`rounded-lg p-4 ${dashboard?.db?.connected ? "bg-[#e4f0ec]" : "bg-[#fff7e8]"}`}>
            <p className="font-black text-[#253431]">{dashboard?.db?.connected ? "Terhubung" : "Mode Demo"}</p>
            <p className="mt-1 text-sm font-semibold leading-6 text-[#69736e]">{dashboard?.db?.message || "Memeriksa koneksi."}</p>
          </div>
        </article>
      </section>
    </main>
  );
}
