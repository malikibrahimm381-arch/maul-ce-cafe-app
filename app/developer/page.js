"use client";

import AuthGuard from "@/app/components/AuthGuard";
import Header from "@/app/components/Header";
import { roleLabel } from "@/app/components/ui";
import { Code2, Database, KeyRound, Route, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

const endpoints = [
  ["POST", "/api/auth/login", "Login bcrypt"],
  ["POST", "/api/auth/logout", "Logout"],
  ["GET", "/api/auth/me", "Session aktif"],
  ["GET", "/api/menu", "List menu"],
  ["POST", "/api/menu", "Tambah menu"],
  ["PUT", "/api/menu/[id]", "Edit menu"],
  ["DELETE", "/api/menu/[id]", "Hapus menu"],
  ["GET", "/api/orders", "List order"],
  ["POST", "/api/orders", "Buat order"],
  ["PUT", "/api/orders/[id]", "Ubah status"],
  ["DELETE", "/api/orders/[id]", "Hapus order"],
  ["GET", "/api/payments", "List pembayaran"],
  ["POST", "/api/payments", "Simpan pembayaran"],
  ["GET", "/api/dashboard", "Grafik dan ringkasan"]
];

export default function DeveloperPage() {
  return (
    <>
      <Header />
      <AuthGuard roles={["developer"]}>
        {(user) => <DeveloperWorkspace user={user} />}
      </AuthGuard>
    </>
  );
}

function DeveloperWorkspace({ user }) {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((response) => response.json())
      .then((data) => setStatus(data.db))
      .catch(() => setStatus(null));
  }, []);

  return (
    <main className="app-shell py-7">
      <section className="mb-5">
        <h1 className="text-3xl font-black text-[#0e1713]">Developer Console</h1>
        <p className="mt-1 text-sm font-semibold text-[#607066]">REST API, session, env, dan status database.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="soft-panel rounded-lg p-5">
          <div className="mb-4 grid size-12 place-items-center rounded-lg bg-[#e3f4ea] text-[#0b3b28]">
            <ShieldCheck size={22} />
          </div>
          <p className="text-sm font-bold text-[#607066]">Session</p>
          <h2 className="mt-1 text-xl font-black text-[#0e1713]">{user.name}</h2>
          <p className="mt-1 text-sm font-semibold text-[#607066]">{roleLabel(user.role)}</p>
        </article>

        <article className="soft-panel rounded-lg p-5">
          <div className="mb-4 grid size-12 place-items-center rounded-lg bg-[#fff1d8] text-[#8b5b00]">
            <Database size={22} />
          </div>
          <p className="text-sm font-bold text-[#607066]">MariaDB</p>
          <h2 className="mt-1 text-xl font-black text-[#0e1713]">{status?.connected ? "Terhubung" : "Demo"}</h2>
          <p className="mt-1 text-sm font-semibold leading-5 text-[#607066]">{status?.message || "Memuat status."}</p>
        </article>

        <article className="soft-panel rounded-lg p-5">
          <div className="mb-4 grid size-12 place-items-center rounded-lg bg-[#e4edf5] text-[#285d82]">
            <KeyRound size={22} />
          </div>
          <p className="text-sm font-bold text-[#607066]">Env</p>
          <h2 className="mt-1 text-xl font-black text-[#0e1713]">.env</h2>
          <p className="mt-1 text-sm font-semibold leading-5 text-[#607066]">APP_SECRET dan akses database disimpan di file environment.</p>
        </article>
      </section>

      <section className="soft-panel mt-6 rounded-lg p-5">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-black text-[#0e1713]">
          <Route size={22} />
          REST API
        </h2>
        <div className="grid gap-3 md:grid-cols-2">
          {endpoints.map(([method, path, label]) => (
            <article key={`${method}-${path}`} className="rounded-lg bg-white/78 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-[#0b3b28] px-2 py-1 text-xs font-black text-white">{method}</span>
                <code className="text-sm font-bold text-[#0b3b28]">{path}</code>
              </div>
              <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#607066]">
                <Code2 size={15} />
                {label}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
