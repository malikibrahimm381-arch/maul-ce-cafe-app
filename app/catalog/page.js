"use client";

import Header from "@/app/components/Header";
import { formatCurrency } from "@/app/components/ui";
import { Coffee, Printer, QrCode } from "lucide-react";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useMemo, useState } from "react";

export default function CatalogPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
    fetch("/api/menu?active=1")
      .then((response) => response.json())
      .then((data) => setMenuItems(data.items || []));
  }, []);

  const groupedMenu = useMemo(() => {
    return menuItems.reduce((groups, item) => {
      groups[item.category] ||= [];
      groups[item.category].push(item);
      return groups;
    }, {});
  }, [menuItems]);

  return (
    <>
      <Header />
      <main className="app-shell py-7">
        <section className="soft-panel rounded-lg p-6">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <div className="flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-lg bg-[#2f6f66] text-white">
                  <Coffee size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-[#1a0f0a]">MAUL.CE</h1>
                  <p className="mt-1 text-sm font-semibold text-[#69736e]">Katalog Menu</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-white p-2">
                {origin ? <QRCodeCanvas value={`${origin}/customer`} size={94} /> : null}
              </div>
              <div className="no-print flex flex-col gap-2">
                <button type="button" onClick={() => window.print()} className="icon-button bg-[#8a5a34] text-white">
                  <Printer size={18} />
                  <span>Cetak</span>
                </button>
                <Link href="/customer" className="icon-button bg-white text-[#3b2a22]">
                  <QrCode size={18} />
                  <span>Menu Digital</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 space-y-6">
          {Object.entries(groupedMenu).map(([category, items]) => (
            <div key={category}>
              <h2 className="mb-3 text-2xl font-black text-[#1a0f0a]">{category}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <article key={item.id} className="rounded-lg border border-[#31413d14] bg-white/86 p-3 shadow-sm">
                    <img src={item.thumbnail} alt={item.name} className="h-40 w-full rounded-md object-cover" />
                    <div className="mt-3 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-black text-[#1a0f0a]">{item.name}</h3>
                        <p className="mt-1 text-sm leading-5 text-[#69736e]">{item.description}</p>
                      </div>
                      <p className="shrink-0 rounded-lg bg-[#fff1df] px-2.5 py-1 text-sm font-black text-[#9a6d3c]">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
