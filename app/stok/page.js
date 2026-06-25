"use client";

import AuthGuard from "@/app/components/AuthGuard";
import CafeShell from "@/app/components/CafeShell";
import { Package, Plus, Minus } from "lucide-react";
import { useEffect, useState } from "react";

export default function StockPage() {
  return (
    <AuthGuard roles={["cashier", "admin", "developer"]}>
      {(user) => <StockWorkspace user={user} />}
    </AuthGuard>
  );
}

function StockWorkspace({ user }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("/api/menu?active=1")
      .then((response) => response.json())
      .then((data) =>
        setItems(
          (data.items || []).map((item, index) => ({
            ...item,
            stock: [18, 24, 8, 14, 30, 12, 7, 10, 22, 16, 9, 11][index] || 10,
            unit: item.category === "Minuman" ? "porsi" : "item"
          }))
        )
      );
  }, []);

  function updateStock(id, delta) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, stock: Math.max(0, item.stock + delta) } : item)));
  }

  return (
    <CafeShell user={user} title="Produk (Stok)" subtitle="Pantau stok menu dan bahan operasional cafe">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="cafe-card p-4">
            <div className="grid grid-cols-[84px_1fr] gap-4">
              <img src={item.thumbnail} alt={item.name} className="size-20 rounded-lg object-cover" />
              <div className="min-w-0">
                <p className="text-xs font-black uppercase text-[#1f8a58]">{item.category}</p>
                <h2 className="truncate text-lg font-black">{item.name}</h2>
                <p className="mt-1 text-sm font-bold text-[#607066]">Stok: {item.stock} {item.unit}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className={`status-pill ${item.stock <= 8 ? "bg-[#ffe0e0] text-[#bc3131]" : item.stock <= 14 ? "bg-[#fff1d8] text-[#c46600]" : "bg-[#e3f4ea] text-[#096b3c]"}`}>
                {item.stock <= 8 ? "Kritis" : item.stock <= 14 ? "Rendah" : "Aman"}
              </span>
              <div className="flex gap-2">
                <button type="button" onClick={() => updateStock(item.id, -1)} className="grid size-9 place-items-center rounded-lg bg-[#eef4ee]">
                  <Minus size={16} />
                </button>
                <button type="button" onClick={() => updateStock(item.id, 1)} className="grid size-9 place-items-center rounded-lg bg-[#0b3b28] text-white">
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="cafe-card mt-5 p-5">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-black">
          <Package size={20} />
          Bahan Hampir Habis
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          {["Biji Kopi Arabica - 450 gr", "Susu Full Cream - 1 Liter", "Syrup Caramel - 2 Botol"].map((item) => (
            <div key={item} className="rounded-lg bg-[#fff1d8] p-4 text-sm font-black text-[#8b5b00]">{item}</div>
          ))}
        </div>
      </section>
    </CafeShell>
  );
}
