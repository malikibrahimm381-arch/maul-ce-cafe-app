"use client";

import Header from "@/app/components/Header";
import { formatCurrency } from "@/app/components/ui";
import { Camera, CheckCircle2, Coffee, Minus, Plus, QrCode, ReceiptText, ShoppingCart, Trash2, Utensils, X } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useMemo, useState } from "react";

const categoryMeta = {
  Semua: { icon: ReceiptText },
  Makanan: { icon: Utensils },
  Minuman: { icon: Coffee }
};

export default function CustomerPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [category, setCategory] = useState("Semua");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderType, setOrderType] = useState("dine_in");
  const [tableNumber, setTableNumber] = useState("1");
  const [customerName, setCustomerName] = useState("");
  const [origin, setOrigin] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
    const url = new URL(window.location.href);
    const table = url.searchParams.get("table");
    if (table) setTableNumber(table);

    fetch("/api/menu?active=1")
      .then((response) => response.json())
      .then((data) => setMenuItems(data.items || []));
  }, []);

  const counts = useMemo(() => {
    return menuItems.reduce(
      (result, item) => {
        result.Semua += 1;
        result[item.category] = (result[item.category] || 0) + 1;
        return result;
      },
      { Semua: 0 }
    );
  }, [menuItems]);

  const categories = useMemo(() => ["Semua", ...new Set(menuItems.map((item) => item.category))], [menuItems]);
  const filteredMenu = category === "Semua" ? menuItems : menuItems.filter((item) => item.category === category);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function addToCart(item) {
    setCart((current) => {
      const existing = current.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return current.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...current, { ...item, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function updateQuantity(id, quantity) {
    setCart((current) =>
      current
        .map((item) => (item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item))
        .filter((item) => item.quantity > 0)
    );
  }

  async function submitOrder() {
    setMessage("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderType,
          tableNumber,
          customerName,
          source: "qr",
          items: cart.map((item) => ({ menuItemId: item.id, quantity: item.quantity }))
        })
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Pesanan gagal dikirim.");

      setCart([]);
      setMessage(`Order #${data.order.id} tersimpan. Total ${formatCurrency(data.order.subtotal)}.`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#fff8f0]">
        <section className="app-shell py-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-3">
              {categories.map((item) => {
                const Icon = categoryMeta[item]?.icon || ReceiptText;
                const active = category === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`icon-button min-h-11 rounded-xl px-4 ${
                      active ? "bg-[#8a5a34] text-white shadow-lg shadow-[#8a5a3424]" : "bg-[#f3eadf] text-[#6d5a49] hover:bg-[#ead8c6]"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs ${active ? "bg-white/18" : "bg-[#e5d5c2]"}`}>{counts[item] || 0}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <a href="#qr" className="icon-button min-h-11 bg-[#d6a265] px-4 text-[#1a0f0a]">
                <Camera size={18} />
                <span>Scan</span>
              </a>
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative grid size-12 place-items-center rounded-xl border border-[#5c3b2518] bg-white text-[#3b2a22] shadow-sm"
                title="Keranjang"
              >
                <ShoppingCart size={20} />
                {cart.length ? (
                  <span className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-[#8a5a34] text-xs font-black text-white">
                    {cart.length}
                  </span>
                ) : null}
              </button>
            </div>
          </div>

          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {filteredMenu.map((item, index) => (
              <article
                key={item.id}
                className="animate__animated animate__fadeInUp overflow-hidden rounded-2xl border border-[#5c3b2514] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[#5c3b2512]"
                style={{ animationDelay: `${Math.min(index * 45, 300)}ms` }}
              >
                <div className="relative">
                  <img src={item.thumbnail} alt={item.name} className="h-64 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => addToCart(item)}
                    className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-[#281b16] text-[#d6a265] shadow-lg shadow-black/20"
                    title={`Tambah ${item.name}`}
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-black text-[#1a0f0a]">{item.name}</h3>
                  <p className="mt-2 text-[#786a5d]">{item.description}</p>
                  <p className="mt-4 text-lg font-black text-[#b98750]">{formatCurrency(item.price)}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="qr" className="app-shell py-12">
          <div className="rounded-3xl bg-[#281b16] p-7 text-white shadow-2xl shadow-[#281b1614]">
            <div className="grid gap-6 lg:grid-cols-[1fr_240px] lg:items-center">
              <div>
                <h3 className="flex items-center gap-3 text-2xl font-black">
                  <QrCode size={26} className="text-[#d6a265]" />
                  Pesan Lewat QR Code
                </h3>
                <p className="mt-3 max-w-2xl leading-7 text-[#d8cabe]">
                  Generate QR Code untuk setiap meja atau scan QR yang tersedia.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6].map((table) => (
                    <button
                      key={table}
                      type="button"
                      onClick={() => setTableNumber(String(table))}
                      className={`grid size-11 place-items-center rounded-xl font-black ${
                        tableNumber === String(table) ? "bg-[#d6a265] text-[#1a0f0a]" : "bg-white/10 text-[#f2e7dc]"
                      }`}
                    >
                      {table}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl bg-white p-4 text-center">
                {origin ? <QRCodeCanvas value={`${origin}/customer?table=${tableNumber}`} size={178} /> : null}
                <p className="mt-3 font-black text-[#1a0f0a]">Meja {tableNumber}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {cartOpen ? (
        <div className="fixed inset-0 z-50 bg-black/38 p-4 backdrop-blur-sm" onClick={() => setCartOpen(false)}>
          <aside
            className="ml-auto flex h-full w-full max-w-md flex-col rounded-2xl bg-[#fff8f0] p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-2xl font-black text-[#1a0f0a]">
                <ShoppingCart size={22} />
                Keranjang
              </h2>
              <button type="button" onClick={() => setCartOpen(false)} className="grid size-10 place-items-center rounded-xl bg-[#f0e2d4] text-[#6d5a49]">
                <X size={19} />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-[#f0e2d4] p-1">
              {[
                ["dine_in", "Dine In"],
                ["take_away", "Take Away"]
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setOrderType(value)}
                  className={`rounded-lg px-3 py-2 text-sm font-black ${
                    orderType === value ? "bg-white text-[#8a5a34] shadow-sm" : "text-[#786a5d]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-4 grid gap-3">
              <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} className="field" placeholder="Nama customer" />
              <input
                value={tableNumber}
                onChange={(event) => setTableNumber(event.target.value)}
                className="field"
                placeholder="Nomor meja"
                disabled={orderType === "take_away"}
              />
            </div>

            <div className="mt-5 flex-1 space-y-3 overflow-auto pr-1">
              {cart.length ? (
                cart.map((item) => (
                  <div key={item.id} className="rounded-2xl bg-white p-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <img src={item.thumbnail} alt={item.name} className="size-16 rounded-xl object-cover" />
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-black text-[#1a0f0a]">{item.name}</h3>
                        <p className="text-sm font-bold text-[#b98750]">{formatCurrency(item.price)}</p>
                      </div>
                      <button type="button" onClick={() => updateQuantity(item.id, 0)} className="grid size-9 place-items-center rounded-xl bg-[#f2d7d2] text-[#7c2f25]">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="grid size-8 place-items-center rounded-lg bg-[#f0e2d4]">
                          <Minus size={15} />
                        </button>
                        <span className="w-8 text-center font-black">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="grid size-8 place-items-center rounded-lg bg-[#281b16] text-[#d6a265]">
                          <Plus size={15} />
                        </button>
                      </div>
                      <strong>{formatCurrency(item.price * item.quantity)}</strong>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-[#5c3b2526] bg-white p-6 text-center font-semibold text-[#786a5d]">
                  Keranjang kosong
                </div>
              )}
            </div>

            <div className="mt-5 border-t border-[#5c3b2514] pt-4">
              <div className="flex items-center justify-between text-xl font-black">
                <span>Total</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <button
                type="button"
                onClick={submitOrder}
                disabled={!cart.length || submitting}
                className="icon-button mt-4 w-full min-h-13 bg-[#8a5a34] text-white"
              >
                <CheckCircle2 size={19} />
                <span>{submitting ? "Mengirim" : "Kirim Pesanan"}</span>
              </button>
              {message ? <p className="mt-3 rounded-xl bg-[#fff1df] p-3 text-sm font-bold text-[#6d4611]">{message}</p> : null}
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
