"use client";

import Header from "@/app/components/Header";
import { cafeCategories, formatCurrency, statusTone } from "@/app/components/ui";
import { Camera, CheckCircle2, Minus, Plus, QrCode, ShoppingCart, Trash2, X } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useMemo, useState } from "react";

export default function CustomerPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [category, setCategory] = useState("Semua");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderType, setOrderType] = useState("dine_in");
  const [tableNumber, setTableNumber] = useState("03");
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

  const categories = useMemo(() => {
    const unique = new Set([...cafeCategories, ...menuItems.map((item) => item.category)]);
    return [...unique];
  }, [menuItems]);

  const filteredMenu = category === "Semua" ? menuItems : menuItems.filter((item) => item.category === category);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function addToCart(item) {
    setCart((current) => {
      const existing = current.find((cartItem) => cartItem.id === item.id);
      if (existing) return current.map((cartItem) => (cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem));
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
          customerName: customerName || "Customer",
          source: "qr",
          items: cart.map((item) => ({ menuItemId: item.id, quantity: item.quantity }))
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Pesanan gagal dikirim.");

      setCart([]);
      setMessage(`Pesanan #INV-250625-${String(data.order.id).padStart(3, "0")} masuk ke dapur. Total ${formatCurrency(data.order.subtotal)}.`);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f7f6f1]">
        <section className="bg-[#062419] py-10 text-white">
          <div className="app-shell grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#8bd46c]">Digital Menu</p>
              <h1 className="mt-2 text-4xl font-black">Pilih menu favorit Anda</h1>
              <p className="mt-3 max-w-2xl text-white/68">Pesan Dine In atau Take Away. Order akan tersimpan otomatis dan bisa diproses kasir/dapur.</p>
            </div>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative icon-button min-h-12 bg-white px-5 text-[#0b3b28]"
            >
              <ShoppingCart size={20} />
              <span>Keranjang</span>
              {cart.length ? <span className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-[#f08b19] text-xs font-black text-white">{cart.length}</span> : null}
            </button>
          </div>
        </section>

        <section className="app-shell py-6">
          <div className="mb-5 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-lg px-4 py-2 text-sm font-black ${
                  category === item ? "bg-[#0b3b28] text-white" : "bg-white text-[#607066] shadow-sm hover:bg-[#eef4ee]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {message ? (
            <div className={`mb-5 rounded-lg p-4 text-sm font-black ${statusTone("ready")}`}>
              {message}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMenu.map((item, index) => (
              <article key={item.id} className="cafe-card animate__animated animate__fadeInUp overflow-hidden" style={{ animationDelay: `${Math.min(index * 35, 300)}ms` }}>
                <div className="relative">
                  <img src={item.thumbnail} alt={item.name} className="h-44 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => addToCart(item)}
                    className="absolute bottom-3 right-3 grid size-10 place-items-center rounded-full bg-[#0b3b28] text-white shadow-lg"
                    title={`Tambah ${item.name}`}
                  >
                    <Plus size={19} />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-xs font-black uppercase text-[#1f8a58]">{item.category}</p>
                  <h3 className="mt-1 text-lg font-black text-[#0e1713]">{item.name}</h3>
                  <p className="mt-2 min-h-10 text-sm font-semibold leading-5 text-[#607066]">{item.description}</p>
                  <p className="mt-3 font-black text-[#0b3b28]">{formatCurrency(item.price)}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="qr" className="app-shell pb-10">
          <div className="dark-glass rounded-lg p-6 text-white">
            <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <h2 className="flex items-center gap-3 text-2xl font-black">
                  <QrCode size={24} className="text-[#8bd46c]" />
                  QR Code Meja
                </h2>
                <p className="mt-2 max-w-2xl text-white/66">Gunakan QR ini untuk simulasi scan meja. Nomor meja otomatis masuk ke pesanan customer.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["01", "02", "03", "05", "06", "07", "08", "12"].map((table) => (
                    <button
                      key={table}
                      type="button"
                      onClick={() => setTableNumber(table)}
                      className={`grid size-10 place-items-center rounded-lg font-black ${tableNumber === table ? "bg-[#8bd46c] text-[#062419]" : "bg-white/10 text-white"}`}
                    >
                      {table}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-lg bg-white p-4 text-center">
                {origin ? <QRCodeCanvas value={`${origin}/customer?table=${tableNumber}`} size={150} /> : null}
                <p className="mt-2 font-black text-[#0e1713]">Meja {tableNumber}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {cartOpen ? (
        <div className="fixed inset-0 z-50 bg-black/40 p-4 backdrop-blur-sm" onClick={() => setCartOpen(false)}>
          <aside className="ml-auto flex h-full w-full max-w-md flex-col rounded-lg bg-white p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-black">Keranjang</h2>
              <button type="button" onClick={() => setCartOpen(false)} className="grid size-10 place-items-center rounded-lg bg-[#eef4ee]">
                <X size={19} />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 rounded-lg bg-[#eef4ee] p-1">
              {[
                ["dine_in", "Dine In"],
                ["take_away", "Take Away"]
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setOrderType(value)}
                  className={`rounded-md px-3 py-2 text-sm font-black ${orderType === value ? "bg-white text-[#0b3b28] shadow-sm" : "text-[#607066]"}`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-4 grid gap-3">
              <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} className="field" placeholder="Nama customer" />
              <input value={tableNumber} onChange={(event) => setTableNumber(event.target.value)} className="field" placeholder="Nomor meja" disabled={orderType === "take_away"} />
            </div>

            <div className="thin-scrollbar mt-5 flex-1 space-y-3 overflow-auto pr-1">
              {cart.length ? (
                cart.map((item) => (
                  <div key={item.id} className="rounded-lg bg-[#f7f6f1] p-3">
                    <div className="flex items-center gap-3">
                      <img src={item.thumbnail} alt={item.name} className="size-16 rounded-md object-cover" />
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-black">{item.name}</h3>
                        <p className="text-sm font-bold text-[#0b3b28]">{formatCurrency(item.price)}</p>
                      </div>
                      <button type="button" onClick={() => updateQuantity(item.id, 0)} className="grid size-9 place-items-center rounded-md bg-[#ffe0e0] text-[#bc3131]">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="grid size-8 place-items-center rounded-md bg-white">
                          <Minus size={15} />
                        </button>
                        <span className="w-8 text-center font-black">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="grid size-8 place-items-center rounded-md bg-[#0b3b28] text-white">
                          <Plus size={15} />
                        </button>
                      </div>
                      <strong>{formatCurrency(item.price * item.quantity)}</strong>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-dashed border-[#0b221820] bg-[#f7f6f1] p-6 text-center font-semibold text-[#607066]">
                  Keranjang kosong
                </div>
              )}
            </div>

            <div className="mt-5 border-t border-[#0b22180f] pt-4">
              <div className="flex items-center justify-between text-xl font-black">
                <span>Total</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <button type="button" onClick={submitOrder} disabled={!cart.length || submitting} className="icon-button mt-4 w-full min-h-13 bg-[#0b3b28] text-white">
                <CheckCircle2 size={19} />
                <span>{submitting ? "Mengirim" : "Kirim Pesanan"}</span>
              </button>
            </div>
          </aside>
        </div>
      ) : null}

      <a href="#qr" className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-[#0b3b28] text-white shadow-2xl" title="Scan QR">
        <Camera size={23} />
      </a>
    </>
  );
}
