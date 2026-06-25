"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Code2, Coffee, Home, LogIn, LogOut, MenuSquare, ReceiptText, Settings, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

const baseLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/customer", label: "Menu", icon: MenuSquare },
  { href: "/catalog", label: "Katalog", icon: MenuSquare }
];

const roleLinks = {
  cashier: [
    { href: "/kasir", label: "Kasir", icon: ReceiptText },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 }
  ],
  admin: [
    { href: "/kasir", label: "Kasir", icon: ReceiptText },
    { href: "/admin", label: "Admin", icon: Settings },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 }
  ],
  developer: [
    { href: "/kasir", label: "Kasir", icon: ReceiptText },
    { href: "/admin", label: "Admin", icon: Settings },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/developer", label: "Dev", icon: Code2 }
  ]
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;

    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((data) => {
        if (mounted) setUser(data.user);
      })
      .catch(() => {
        if (mounted) setUser(null);
      });

    return () => {
      mounted = false;
    };
  }, [pathname]);

  const links = [...baseLinks, ...(roleLinks[user?.role] || [])];
  const landing = pathname === "/";

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  }

  return (
    <header
      className={`no-print sticky top-0 z-30 border-b backdrop-blur-xl ${
        landing ? "border-[#fff8f033] bg-[#281b16]/96" : "border-[#5c3b2514] bg-[#fff8f0d9]"
      }`}
    >
      <div className="app-shell flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
        <Link href="/" className={`flex items-center gap-3 font-black tracking-normal ${landing ? "text-white" : "text-[#1a0f0a]"}`}>
          <span className={`grid size-11 place-items-center rounded-lg ${landing ? "bg-white/10 text-[#d6a265]" : "bg-[#281b16] text-[#d6a265]"}`}>
            <Coffee size={22} />
          </span>
          <span className="leading-tight">
            MAUL.CE
            <span className={`block text-xs font-semibold ${landing ? "text-[#c8b7a6]" : "text-[#786a5d]"}`}>premium cafe app</span>
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-2">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`icon-button min-h-10 px-3 text-sm ${
                  active
                    ? "bg-[#d6a265] text-[#1a0f0a] shadow-lg shadow-[#d6a26526]"
                    : landing
                      ? "bg-transparent text-[#e8ded3] hover:bg-white/10"
                      : "bg-white/72 text-[#3b2a22] hover:bg-white"
                }`}
                title={link.label}
              >
                <Icon size={17} />
                <span>{link.label}</span>
              </Link>
            );
          })}

          {user ? (
            <button
              type="button"
              onClick={logout}
              className="icon-button min-h-10 bg-[#f2d7d2] px-3 text-sm text-[#7c2f25] hover:bg-[#edc7bf]"
              title="Logout"
            >
              <LogOut size={17} />
              <span>{user.name}</span>
            </button>
          ) : (
            <>
              <Link
                href="/customer"
                className="icon-button min-h-10 bg-[#d6a265] px-3 text-sm text-[#1a0f0a] hover:bg-[#e5b875]"
                title="Pesan sekarang"
              >
                <ShoppingCart size={17} />
                <span>Pesan Sekarang</span>
              </Link>
              <Link
                href="/login"
                className={`icon-button min-h-10 px-3 text-sm ${
                  landing ? "border border-white/20 bg-transparent text-[#e8ded3] hover:bg-white/10" : "bg-[#fff1df] text-[#6d4611] hover:bg-[#ffe0bd]"
                }`}
                title="Masuk"
              >
                <LogIn size={17} />
                <span>Masuk</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
